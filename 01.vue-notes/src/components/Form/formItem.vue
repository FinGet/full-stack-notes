<template>
  <div class="form-item">
    <label for="">{{label}}</label>
    <div>
      <slot></slot>
      <p class="err-msg" v-show="errStatus">{{errMessage}}</p>
    </div>
  </div>
</template>

<script>
  import Schema from 'async-validator';
  export default {
    name: 'FormItem',
    props: {
      label: {
        default: ''
      },
      prop: {
        default: ''
      }
    },
    data() {
      return {
        errMessage: '',
        errStatus: false
      }
    },
    inject: ['formBox'],
    mounted() {
      this.$on('validate', this.validator)
    },
    methods: {
      validator() {
        const rules = this.formBox.rules[this.prop];
        const value = this.formBox.model[this.prop];
        const descriptor = {[this.prop]: rules};
        const schema = new Schema(descriptor);

        schema.validate({[this.prop]: value}, errors => {
          if(errors) {
            this.errMessage = errors[0].message;
            this.errStatus = true;
          } else {
            this.errMessage = '';
            this.errStatus = false;
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.form-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: 20px;
  label{
    width: 80px;
  }
  .err-msg{
    position: absolute;
    margin: 0;
    color: red;
    font-size: 14px;
  }
}
</style>