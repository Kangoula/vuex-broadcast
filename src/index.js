import VuexBroadcast from './VuexBroadcast'

const install = store => {
  const vuexBoradcast = new VuexBroadcast({ webSocketSupport: false })
  vuexBoradcast.init(store, { enableLeaderElection: true })
}

export default install
