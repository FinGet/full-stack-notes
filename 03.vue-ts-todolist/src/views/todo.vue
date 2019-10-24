<template>
  <div class="todo-page">
    <input type="text" v-model="text">
    <button @click="addItem">+</button>
    <ul>
      <todo-item v-for="(item, index) in list" 
        :key="index"
        :item="item"
        :index="index"
        :editting-index="edittingIndex"
        @on-click="handleClick"
        @on-save="handleSave"
        @on-cancel="handleCancel"
      ></todo-item>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TodoItem from '../components/todo-item'

@Component({
  name: 'Todo',
  components: {
    TodoItem,
  },
})
export default class Todo extends Vue {
  public edittingIndex = -1;
  public text = '';
  public list = [
    {
      text: '学习typescript全面解读',
      complete: false
    },
    {
      text: '学习vue全面解读',
      complete: false
    }
  ]
  // 生命周期
  created() {
    console.log('created')
  }
  // 计算属性
  get listCount() {
    return this.list.length;
  }
  public addItem() {
    this.list.push({
      text: this.text,
      complete: false
    })
    this.text = '';
  }
  public handleClick(index) {
    this.edittingIndex = index;
  }
  public handleSave({index, content}) {
    this.edittingIndex = -1;
    this.list[index].text = content;
  }
  public handleCancel() {
    this.edittingIndex = -1;
  }
}
</script>
