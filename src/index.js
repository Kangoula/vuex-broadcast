import VuexBroadcast from './VuexBroadcast'

const install = options => store => {
  new VuexBroadcast(store, options)
}

export default install
