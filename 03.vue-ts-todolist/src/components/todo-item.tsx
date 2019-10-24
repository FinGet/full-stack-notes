import {Component, Vue, Prop, Emit} from 'vue-property-decorator';
// vue-property-decorator使用指南 https://juejin.im/post/5c173a84f265da610e7ffe44
interface Item {
	text: string;
	complete: boolean;
}

@Component({
	name: 'TodoItem',
})

export default class TodoItem extends Vue {
	@Prop(Object) public item!: Item; // !表示必填属性
	@Prop(Number) public index!: Number;
	@Prop(Number) public edittingIndex!: Number;

	public edittingContent = '';

	@Emit('on-save')
	public save() {
		return {
			index: this.index,
			content: this.edittingContent,
		};
	}
	@Emit('on-cancel')
	public cancel() {}

	@Emit('on-click')
	public click() {
		this.edittingContent = this.item.text;
		return this.index;
	}
	protected render() {
		return (
			<li>
				{
					this.edittingIndex === this.index ? (
						<div>
							<input type='text' v-model={this.edittingContent}/>
							<button on-click={this.save}>√</button>
							<button on-click={this.cancel}>×</button>
						</div>
					) : (
						<div>{this.item.text}
						<button on-click={this.click}>✐</button>
						</div>
					)
				}
			</li>
		);
	}
}
