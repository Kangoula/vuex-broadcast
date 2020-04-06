import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'
import broadcastModule, {
  isMutationFromBroadcastModule
} from './broadcastModule'

/**
 * @author Guillaume Denis <guillaume.denis@laposte.net>
 *
 * Shares Vuex mutations between multiples tabs or instances using the broadcast-channel library (https://github.com/pubkey/broadcast-channel/)
 */
export default class VuexBroadcast {
  /**
   * @private {String} a short unique ID used to recognize the instance
   */
  #uid

  /**
   * @private {String} the main channel name, the main channel is mainly used to elect a leader between instances
   */
  #mainChannelName

  /**
   * @private {String} since this plugin registers a namespaced vuex module, it required a name
   */
  #moduleName

  /**
   * @private {Map} a dictionnary of the created channels by name
   */
  #channels

  /**
   * @private {LeaderElection} the leader election mecanism, check the broadcast-channel documentation for more informations
   */
  #elector

  /**
   * @private {Object} options to set when creating a new channel (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   */
  #channelsOptions = {}

  /**
   * @private {Boolean} flag if the current instance is elected as leader
   */
  #isLeader = false

  /**
   * @private {String} key used to create a Symbol for augmenting Vuex mutations with hidden(ish) metadata
   */
  #symbolKey = 'fromMessage'

  /**
   * Registers the vuex module, if `enableLeaderElection` option is set to true, creates a main brodcast channel to handle leader election.
   * Creates a channel for each eligible store module, subscribes to store mutations and broadcasts the mutations to the appropriate channels.
   *
   * @param {Object} options -
   * @property {Boolean} [options.type] - a channel creation option, see (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   * @property {Boolean} [options.webWorkerSupport=false] - a channel creation option, see (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   * @property {String} [options.mainChannelName="vuexBroadcast"] - the broadcast channel name, mainly used to elect a leader between all the app instances, defaults to "vuexBroadcast"
   * @property {String} [options.moduleName="vuexBroadcast"] - the vuex module name that will be registered, defaults to "vuexBroadcast"
   * @property {Boolean} [options.enableLeaderElection=false] -
   */
  constructor (options) {
    const {
      type,
      webWorkerSupport,
      mainChannelName,
      moduleName,
      enableLeaderElection
    } = options
    this.#uid = Date.now().toString(24)
    this.#mainChannelName = mainChannelName || 'vuexBroadcast'
    this.#moduleName = moduleName || 'vuexBroadcast'
    this.#channels = new Map()
    this.#channelsOptions.webWorkerSupport = webWorkerSupport || false
    if (type) {
      this.#channelsOptions.type = type
    }

    return store => {
      this.init(store, { enableLeaderElection })
    }
  }

  /**
   * @public
   *
   * @param {Vuex.Store} store - the created vuex store
   * @param {Object} options -
   * @property {Boolean} options.enableLeaderElection - defaults to false
   *
   * @returns {void}
   */
  init (store, { enableLeaderElection }) {
    store.registerModule(this.#moduleName, broadcastModule)

    if (enableLeaderElection) {
      const mainChannel = this.createChannel(this.#mainChannelName)
      this.#elector = createLeaderElection(mainChannel)
      this.#elector.awaitLeadership().then(() => {
        this.#isLeader = true
        store.dispatch(`${this.#moduleName}/setLeader`)
      })
    }

    this.createChannelsForStoreModules(store)

    store.subscribe(mutation => {
      if (this.isMutationBroadcastable(mutation)) {
        const [namespace] = mutation.type.split('/')
        const m = {
          from: this.#uid,
          value: mutation
        }

        this.postMessage(namespace, m)
      }
    })
  }

  /**
   * @private
   *
   * Takes a mutation and checks if it does not come from this plugin.
   * This way we dont send duplicates of the same mutation when we apply it.
   * A mutation comes from this module if:
   *  - it is from the module registered by this plugin
   *  - has a Symbol in its payload (see addMetadataToPayload method for more details)
   * @param {Vuex.mutation} mutation -
   *
   * @returns {Boolean} - true when the mutation can be broadcasted in a channel
   */
  isMutationBroadcastable (mutation) {
    return (
      !isMutationFromBroadcastModule(mutation) &&
      !mutation.payload[Symbol.for(this.#symbolKey)]
    )
  }

  /**
   * @private
   *
   * Loop through all the store modules and creates a channel for this module if its has the `boradcast`key set to true in its definition
   * Setup listenets on messages received on this channel
   * @param {Vuex.Store} store -
   *
   * @returns {void}
   */
  createChannelsForStoreModules (store) {
    // rawModules contain the unprocessed module config
    const rawModules = store._modules.root._rawModule.modules

    for (const moduleName in rawModules) {
      if (rawModules[moduleName].broadcast === true) {
        const channel = this.createChannel(moduleName)

        channel.addEventListener('message', message => {
          this.onMessage(moduleName, message, store)
        })
      }
    }
  }

  /**
   * @private
   *
   * Create a new BroadcastChannel with the given name
   * @param {String} name - the name of the channel that will be created
   *
   * @returns {BroadcastChannel} - the created channel
   */
  createChannel (name) {
    if (this.#channels.has(name)) {
      const c = this.#channels.get(name)
      c.removeEventListener('message')
      c.close()
    }

    const channel = new BroadcastChannel(name, this.#channelsOptions)
    this.#channels.set(name, channel)

    // keep track of the channel the last message sent or received
    channel.lastMessage = null

    return channel
  }

  /**
   * @private
   *
   * Event listener for Vuex mutations received on a channel
   * Commits the mutation in the store if the message has not already been processed.
   * @param {String} channelName - the channel name the message is received from
   * @param {Object} message -
   * @property {Vuex.mutation} message.value - the Vuex mutation received from the channel
   * @param {Vuex.Store} store -
   *
   * @returns {void}
   */
  onMessage (channelName, message, store) {
    const { value } = message
    const channel = this.#channels.get(channelName)

    // keep track of the last message to avoid infinite loops
    const stringifiedMessage = JSON.stringify(value)
    if (channel.lastMessage !== stringifiedMessage) {
      store.commit(value.type, this.addMetadataToPayload(value.payload))
      channel.lastMessage = stringifiedMessage
    }
  }

  /**
   * @private
   *
   * Adds a Symbol to a mutation payload, a Symbol is a Javascript primitive type
   * When you add a Symbol as a property to an Object, it will not be accessible unless you know the Symbol key
   * We use it to add metadata stating that the mutation has been processed by the plugin.
   *
   * @param {Object} payload - the mutation payload
   *
   * @returns {Object} -
   */
  addMetadataToPayload (payload) {
    const result = { ...payload }
    // use a Symbol to add metadata to the mutation as it not considered as an object property,
    // thus will by ignored by JSON.stringify
    result[Symbol.for(this.#symbolKey)] = true
    return result
  }

  /**
   * @private
   *
   * Sends a message to a given channel and keep track of this message to avoid duplicates processing
   *
   * @param {String} channelName - the channel to post the message on
   * @param {Object} message - the message to send
   * @property {Object} message.value - the mutation to post
   *
   * @returns {void}
   */
  postMessage (channelName, message) {
    if (this.#channels.has(channelName)) {
      const channel = this.#channels.get(channelName)
      // keep track of the last message to avoid infinite loops
      channel.lastMessage = JSON.stringify(message.value)
      channel.postMessage(message)
    }
  }
}
