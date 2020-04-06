import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'

Vue.config.productionTip = false

// const uid = Date.now().toString(32)

// // create a leader channel that counts the number of instances registered
// const registerChannel = new BroadcastChannel('register')
// const elector = createLeaderElection(registerChannel)

// Vue.prototype.$bc = {
//   channels: new Map(),
//   elector,
//   registred: 0
// }

// Vue.prototype.$bc.channels.set('register', registerChannel)

// elector.awaitLeadership().then(() => {
//   console.log('I\'m the leader !')
//   document.title = 'I\'m the leader !'
//   Vue.prototype.$bc.isLeader = true
// })
//

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
