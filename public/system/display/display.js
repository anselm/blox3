
export class Display extends Node {

	constructor(props={}) {
		super()

		// defaults
		if(!props) props = {}
		if(!props.whd) props.whd = {x:1000,y:1000,z:0};
		if(!props.xyz) props.xyz = {x:10,y:10,z:10};

		// build display binding to browser
		this.canvas = document.createElement("canvas")
		document.body.appendChild(this.canvas)
		this.context = this.canvas.getContext('2d')
		this.canvas.style="border:1px solid green;position:absolute;"
		this.canvas.width=props.whd.x
		this.canvas.height=props.whd.y
		this.canvas.style.left=props.xyz.x+"px"
		this.canvas.style.top=props.xyz.y+"px"

		// build our own event system
		let handler = {
			handleEvent:(e) =>{
				console.log(e.type)
			}
		}

		this.canvas.addEventListener('click', handler);
		this.canvas.addEventListener('mouseover', handler);
		this.canvas.addEventListener('mouseout', handler);

	}


}