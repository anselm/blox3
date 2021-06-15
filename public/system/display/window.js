export class Window extends Node {
	constructor(props) {
		super()
		this.canvas = document.createElement("canvas")
		document.body.appendChild(this.canvas)
		this.context = this.canvas.getContext('2d')
		this.canvas.style="border:1px solid red;position:absolute;"
		this.canvas.width=props.size.x
		this.canvas.height=props.size.y
		this.canvas.style.left=props.position.x+"px"
		this.canvas.style.top=props.position.y+"px"
	}
}