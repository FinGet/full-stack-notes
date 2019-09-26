<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'myForm',
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: {
        type: Object
      }
    },
    provide() {
      return {
        // rules: this.rules
        formBox: this
      }
    }
  }
</script>

<style lang="less" scoped>

</style>