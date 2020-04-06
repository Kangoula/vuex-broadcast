<template>
  <div>
    <label>new todo:</label>
    <input v-model="text" name="todo" type="text">
    <button @click="submit">
      submit
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TodoForm',

  data: () => ({
    text: ''
  }),

  methods: {
    ...mapActions('todos', ['create']),
    submit () {
      this.create(this.text)
    }
  }
}
</script>

<style scoped>
</style>
