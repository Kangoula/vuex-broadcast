import { BroadcastChannel } from 'broadcast-channel'

export default class StoreModuleChannel extends BroadcastChannel {
  /**
   * @private {String[]} the list of the store module mutations names
   * You can use this to avoid processing a mutation that is not from the given store module
   */
  #mutationsNames = []

  /**
   * @private {String} the stringified last message received or sent
   * You can use this to avoid processing the same message more than once
   */
  #lastMessage = null

  /**
   * Creates a new StoreModuleChannel,
   * this is a BoradcastChannel object with vuex module mutation awareness and last message tracking
   * @param {String} name - the vuex module name
   * @param {Object} [channelOptions=undefined] - some channel options see (https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional)
   * @param {Object} [moduleConfig=undefined] - the vuex store RAW config
   * @property {Object} moduleConfig.mutations - the vuex raw mutations list
   */
  constructor (name, channelOptions, moduleConfig) {
    super(name, channelOptions)

    if (moduleConfig && moduleConfig.mutations) {
      this.#mutationsNames = Object.keys(moduleConfig.mutations).map(
        mutation => `${name}/${mutation}`
      )
    }
  }

  /**
   * Checks if the given mutation is in the vuex module
   * @param {String} mutationName -
   *
   * @returns {Boolean} true when the mutation is from the module
   */
  hasMutation (mutationName) {
    return this.#mutationsNames.includes(mutationName)
  }

  /**
   * Checks if the given message is the same as the last one
   * @param {*} message - Stringifiable message
   *
   * @returns {Boolean} true when the message and the last one are the same
   */
  isMessageSameAsLast (message) {
    const stringifiedMessage = JSON.stringify(message)
    return this.#lastMessage === stringifiedMessage
  }

  /**
   * @returns {String} the stringified last message
   */
  get lastMessage () {
    return this.#lastMessage
  }

  /**
   * Sets the last message
   * @param {*} message - Stringifiable message
   */
  set lastMessage (message) {
    this.#lastMessage = JSON.stringify(message)
  }

  /**
   * @returns {String[]} the mutations names in a non editable array
   */
  get mutationNames () {
    // ensure the changes on this array are not applied
    return Object.freeze(this.#mutationsNames)
  }
}
