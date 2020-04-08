# Vuex Broadcast

> ## Use with [my fork of Vuex](https://github.com/Kangoula/vuex)

Broadcast and share Vuex modules mutations between mupltiple instances of the same Vue application (like brower tabs) to keep them in sync.

## Install

```
npm install --save vuex-broadcast
```

## Usage

- add a `broadcast` key to the namespaced modules you want to broadcast the mutations

```javascript
// myModule.js

{
  broadcast: true,
  namespaced: true,

  state: {},
  mutations: {},
  actions: {}
}
```

- register the Vuex plugin

```javascript
import VuexBroadcast from "vuex-broadcast"

new Vuex.Store({
  modules: {}
  plugins: [new VuexBroadcast()]
})
```

From now on, each mutatons of the modules with the `broadcast` key set to `true` will be boradcasted to other app instances and applied in each of their Vuex stores.

## Options

You can pass an `options` argument to the contructor with the following properties:

- **moduleName** [String] defaults to `"vuexBroadcast"`: the vuex module name that will be registered, defaults to "vuexBroadcast"
- **enableLeaderElection** [Boolean], defaults to `false`: enable leader election
- **mainChannelName** [String] defaults to `"vuexBroadcast"`: the broadcast channel name, mainly used to elect a leader between all the app instances
- you can pass any option of the `broadcast-channel` library: https://github.com/pubkey/broadcast-channel/#set-options-when-creating-a-channel-optional

## Leader Election

As stated in https://github.com/pubkey/broadcast-channel/#using-the-leaderelection
You can also elect a leader between all of the instances of you app.

This plugin registers a vuex module, with its name set by the `moduleName` option.
This module exposes a state named `isLeader` which is set to true if the current instance is elected as leader.

You can access it like any regular vuex module:

```javascript
// in components via
this.$store.state[moduleName].isLeader
// or
mapState([moduleName], ['isLeader'])

// in your vuex store in:
// actions
myAction ({state, commit, rootState}, myActionArgument) {
  const isLeader = rootState[moduleName].isLeader
}

// getters
myGetter: (state, getters, rootState) => {
  const isLeader = rootState[moduleName].isLeader
}
```
