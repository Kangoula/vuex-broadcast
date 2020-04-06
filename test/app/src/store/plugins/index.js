import vuexBroadcast from '../../../../../src/index'

const vb = new vuexBroadcast({
  webSocketSupport: false,
  enableLeaderElection: true
})

export default [vb]
