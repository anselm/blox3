export class Text extends Node {


	// TODO - at the moment this is catching basically initialization
	// it might be better to have this redraw done in an actual redraw method not on update
	// 

	ontick() {

		let props = this

		// TODO bad
		let c = this.parent.parent.context

		c.font = '48px serif'
		c.fillStyle="black"
		c.fillText(props.text,10,10);


	}
}

// - somehow i need to remember and pass down some kind of cursor or pointer
// - maybe best to keep text in a div