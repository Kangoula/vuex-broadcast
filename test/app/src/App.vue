<template>
  <div id="app">
    <h4 v-show="$store.state['vuexBroadcast'].isLeader" style="color:red">
      Leader
    </h4>
    <todo-form />
    <hr>
    <h4>Todos:</h4>
    <todo-list :value="todoItems" @remove="remove" />
  </div>
</template>

<script>
import TodoList from '@/components/TodoList'
import TodoForm from '@/components/TodoForm'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: { TodoList, TodoForm },

  computed: {
    ...mapGetters('todos', ['todoItems'])
  },

  methods: {
    ...mapActions('todos', ['remove'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app .content {
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 20% 40% 40%;
}
</style>
