<template>
  <div>
    <todo-item v-for="todo in value" :key="todo._id" :value="todo.value" @remove="$emit('remove', todo)" />
  </div>
</template>

<script>
import TodoItem from './TodoItem'
export default {
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
</style>
