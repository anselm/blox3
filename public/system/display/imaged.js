export class Imaged extends Node {


	// TODO - at the moment this is catching basically initialization
	// it might be better to have this redraw done in an actual redraw method not on update
	// 

	constructor() {
		super()
		this.img = new Image();
		this.img.src = "../assets/delauney.jpg" // 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';
	//	this.img.onload = () => { console.log("done"); this.ontick(); }
	}

	ontick() {

		let props = this

		// TODO bad
		let c = this.parent.parent.context

//console.log(this.img.complete)

		c.drawImage(this.img,10,10)

	}
}