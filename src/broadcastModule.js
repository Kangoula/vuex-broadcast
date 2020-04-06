const mutationsTypes = Object.freeze({
  SET_UID: 'SET_UID',
  SET_IS_LEADER: 'SET_IS_LEADER'
})

export const isMutationFromBroadcastModule = mutation => {
  const name = mutation.type.split('/')[1]
  return mutationsTypes.hasOwnProperty(name)
}

export default {
  namespaced: true,

  state: {
    uid: null,
    isLeader: false
  },

  mutations: {
    [mutationsTypes.SET_UID] (state, newUid) {
      state.uid = newUid
    },

    [mutationsTypes.SET_IS_LEADER] (state, newValue) {
      state.isLeader = newValue
    }
  },

  actions: {
    setLeader ({ commit }) {
      commit(mutationsTypes.SET_IS_LEADER, true)
    },

    setUid ({ commit }, uid) {
      commit(mutationsTypes.SET_UID, uid)
    }
  }
}
