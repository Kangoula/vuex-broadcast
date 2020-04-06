import Vue from 'vue'

export default {
  broadcast: true,
  namespaced: true,

  state: {
    list: {}
  },

  mutations: {
    pushTodo (state, data) {
      Vue.set(state.list, data._id, data)
    },

    removeTodo (state, data) {
      Vue.delete(state.list, data._id)
    }
  },

  actions: {
    remove ({ commit }, todo) {
      commit('removeTodo', todo)
    },

    create ({ commit }, todoText) {
      commit('pushTodo', { _id: Date.now().toString(32), value: todoText })
    }
  },

  getters: {
    todoIds: state => Object.keys(state.list),
    todoItems: state => Object.values(state.list)
  }
}
