import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import plugins from './plugins'

const info = m => console.log(`%c ${m}`, 'color: cyan')
const warn = m => console.log(`%c ${m}`, 'color: orange')
const err = m => console.log(`%c ${m}`, 'color: red')

Vue.use(Vuex)

export default new Vuex.Store({
  // state: {
  //   instanceId: Date.now().toString(32),
  //   isLeader: false,
  //   elector: null,
  //   channels: {}
  // },

  // mutations: {
  //   setLeader (state, data) {
  //     state.isLeader = data
  //   },
  //   setElector (state, data) {
  //     state.elector = data
  //   },

  //   addChannel (state, data) {
  //     info(`channel '${data.name}' added`)
  //     Vue.set(state.channels, data.name, data.value)
  //   },
  //   removeChannel (state, data) {
  //     warn(`channel '${data.name}' removed`)
  //     Vue.delete(state.channels, data.name)
  //   }
  // },

  // actions: {
  //   setup ({ state, commit }) {
  //     console.clear()
  //     info('init store')

  //     const registerChannel = new BroadcastChannel('register')
  //     commit('addChannel', { name: 'register', value: registerChannel })
  //     const elector = createLeaderElection(registerChannel)
  //     commit('setElector', elector)

  //     elector.awaitLeadership().then(() => {
  //       commit('setLeader', true)
  //     })

  //     console.log(this._modules)

  //     this.dispatch('testSync/setup')
  //   },

  //   createChannel ({ state, commit }, name) {
  //     if (state.channels[name]) {
  //       return state.channels[name]
  //     }

  //     const channel = new BroadcastChannel(name)
  //     commit('addChannel', { name, value: channel })
  //     return channel
  //   },

  //   sendMessage ({ state }, { channel, value }) {
  //     if (state.channels[channel]) {
  //       state.channels[channel].postMessage(value)
  //     } else {
  //       err(`channel with name ${channel} not found`)
  //     }
  //   }
  // },

  // getters: {},

  modules,
  plugins
})
