export class Group extends Node {
	constructor(props) {
		super()
		this.group = new THREE.Group()
		if(!props.parent || !props.parent.group) return
		props.parent.group.add(this.group)
	}
}