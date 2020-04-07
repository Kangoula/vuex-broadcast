import { createLeaderElection } from 'broadcast-channel'
import StoreModuleChannel from './StoreModuleChannel'
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
   * Registers the vuex module, if `enableLeaderElection` option is set to true, creates a main brodcast channel to handle leader election.
   * Creates a channel for each eligible store module, subscribes to store mutations and broadcasts the mutations to the appropriate channels.
   * @param {Object} options -
   * @property {String} [options.type] - a channel creation option, see (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   * @property {Boolean} [options.webWorkerSupport=false] - a channel creation option, see (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   * @property {String} [options.mainChannelName="vuexBroadcast"] - the broadcast channel name, mainly used to elect a leader between all the app instances, defaults to "vuexBroadcast"
   * @property {String} [options.moduleName="vuexBroadcast"] - the vuex module name that will be registered, defaults to "vuexBroadcast"
   * @property {Boolean} [options.enableLeaderElection=false] -
   *
   * @returns {Function} a Vuex store plugin
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
   * @private
   *
   * Initialize the plugin by:
   * - registering a Vuex module
   * - enabling (or not) leader election
   * - creating a channel for each elligible namespaced store module
   * - setting up mutation broadcast
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
      if (!isMutationFromBroadcastModule(mutation)) {
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
      const m = rawModules[moduleName]
      if (m.broadcast === true) {
        const channel = this.createChannel(moduleName, m)
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
   * @param {Object} [config=undefined] - the store module we are creating a channel for
   *
   * @returns {BroadcastChannel} - the created channel
   */
  createChannel (name, config) {
    if (this.#channels.has(name)) {
      const c = this.#channels.get(name)
      c.removeEventListener('message')
      c.close()
    }

    const channel = new StoreModuleChannel(name, this.#channelsOptions, config)

    this.#channels.set(name, channel)

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

    if (
      channel.hasMutation(message.value.type) &&
      !channel.isMessageSameAsLast(message.value)
    ) {
      store.commit(value.type, value.payload)
      channel.lastMessage = message.value
    }
  }

  /**
   * @private
   *
   * Sends a message to a given channel and keep track of this message to avoid duplicates processing
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
      channel.lastMessage = message.value
      channel.postMessage(message)
    }
  }

  /**
   * @public
   *
   * Gets the current instance leader status
   *
   * @returns {Boolean} true when the instance is the leader
   */
  get isLeader () {
    return this.#isLeader
  }
}
