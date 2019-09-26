<template>
  <div>
    <input :type="type" :value="value" @input="onInput" />
  </div>
</template>

<script>
export default {
  name: "myInput",
  props: {
    value: {
      required: false
    },
    type : {
      required: false,
      default: 'text'
    }
  },
  // inject: ['rules'],
  methods: {
    // 输入事件
    onInput(e) {
      let value = e.target.value;
      this.$emit("input", value);
      this.$parent.$emit('validate',value)
    }
  }
};
</script>

<style lang="less" scoped>
input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>