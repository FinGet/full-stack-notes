<template>
  <div>
    <form-box :model="user" :rules="rules">
      <form-item label="账号:" prop="name">
        <f-input type="text" v-model="user.name"></f-input>
      </form-item>
      <form-item label="密码:" prop="password">
        <f-input type="password" v-model="user.password"></f-input>
      </form-item>
    </form-box>
    
    <!-- <f-input type="text" :value="value" @input="value = arguments[0]"></f-input> -->
  </div>
</template>

<script>
  import FInput from '../components/Form/input'
  import FormItem from '../components/Form/formItem'
  import FormBox from '../components/Form/form'

  export default {
    data() {
      return {
        user: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            {required: true, message: '请填写账号!', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码!', trigger: 'blur'},
            {min: 1, max: 6, message: '请输入六位密码', trigger: 'change'}
          ]
        }
      }
    },
    components: {
      FInput,
      FormItem,
      FormBox
    }
  }
</script>

<style lang="less" scoped>

</style>