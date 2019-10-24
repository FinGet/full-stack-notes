<template>
  <transition name="fade">
    <div class="toast"
      v-show="visible"
    >
      <span class="content">{{content}}</span>
      <a class="btn" @click="handleClose">关闭</a>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MToast',
  props: {
    // 显示的消息
    content: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      visible: true,
      autoClose: 3000
    }
  },
  methods: {
    handleClose (e) {
      e.preventDefault()
      this.$emit('close') // 派发一个关闭事件
    },
    afterLeave () {
      // this.$emit('closed')
    },
    afterEnter () {},
    createTimer () {},
    clearTimer () {}
  }
}

</script>

<style>
.toast{
  display: inline-flex;
  background-color:#303030;
  color: rgba(255, 255, 255, 1);
  align-items: center;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  flex-wrap: wrap;
  transition: all .3s;
}
.content{
  padding: 0;
}
.btn{
  color: #ff4081;
  padding-left: 24px;
  margin-left: auto;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
  
</style>
