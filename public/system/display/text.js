export class Text extends Node {
	update(props) {
		super.update(props)
		this.parent.context.font = '48px serif'
		this.parent.context.fillStyle = props.color
		this.parent.context.fillText(props.text,this.position.x,this.position.y)
	}
}