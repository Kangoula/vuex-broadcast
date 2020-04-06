<template>
  <div style="display:flex">
    <div style="padding: 4px">
      {{ value }}
    </div>
    <button @click="$emit('remove')">
      remove
    </button>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    value: {
      type: null,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
