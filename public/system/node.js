
/*

Promote raw json to javascript classes with a DAG style scene graph. Generally I want these capabilities:

	- grant names to nodes but also allow human naming
	- expose things as simply as possible directly to javascript; so allow mynode.mychildnode.somevariable=3
	- query() support to find nodes by name
	- update() method that is suitable for networking of state (CRUD operations)
	- serialization/deserialiation
	- fetch base classes off disk

	- allow support for prototypical base objects that can be sub-instanced on demand easily
	- think through some kind of formal permissions / capabilities / limits at some point

*/

export let nanoid=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){let n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36).toUpperCase():n<63?"_":"-"}return e};

let cache = {}
let uuid = nanoid()
let localid = 0
let ALLOWNAMED = 1

async function factory(props={}) {
	let type = props.type
	let c = type && type.length ? cache[type] : Node;
	if(!c) {
		let m = await import("/system"+type+".js")
		if(m) {
			for(const [k,v] of Object.entries(m)) {
				c = cache[type] = v
				break
			}
		}
	}
	if(!c) c = Node
	let inst = await new c(props)
	return inst
}

export class Node {
	query() {
	}
	create(props={}) {} // TODO tbd
	remove(props) {} // TODO tbd
	delete(props) {} // TODO tbd

	///
	/// create and insert as child from properties
	/// 	- TODO detect if props is an instance
	///

	async insert(props={}) {
		if(!this.children) this.children={}
		localid++
		props.uuid = (""+localid).padStart(8,'0') + uuid
		if(!props.name) props.name = props.type+localid
		props.path = this.path + "/" + props.name
		let child = this.children[props.name]
		if(!child) {
			props.parent = this
			child = await factory(props)
			if(!child) return 0
			child.name = props.name
			child.path = props.path
			child.type = props.type
			child.parent = this
			this.children[props.name]=child
			if(ALLOWNAMED)this[props.name]=child
		}
		if(child.update) await child.update(props)
		return child
	}

	///
	/// update this object
	/// 	- this effectively is a message handler; it can create, update, delete objects
	/// 	- it can be used for networking state also
	/// 	- TODO detect if props is an instance
	///

	async update(props={}) {

		// as a feature, allow the caller to supply an array of children to insert
		if(props instanceof Array) {
			props.forEach( this.insert )
			return
		}

		// set both trivial properties and also pull out children crumpled into the hash
		for(const [k,v] of Object.entries(props)) {

			let isAbstract = v.prototype && v.prototype.constructor ? true : false
			let isArray = v instanceof Array
			let isObject = v instanceof Object
			let isNode = v instanceof Node

			if(isArray && k=="children") {
				// the array property 'children' is reserved for children entities; deal with this in a special way
				v.forEach( this.insert )
			}

			else if(isNode || isAbstract || isArray || !isObject || !v.type || !v.type.length) {
				// update a simple field
				this[k]=v
			}

			else if(k=="parent" || k=="children") {
				console.error("should not get here key=" + k + " abstr=" + isAbstract + " obj=" + isObject)				
			}

			else {
				// update a child
				v.name = k
				let created = await this.insert(v)
				if(ALLOWNAMED)this[k]=created
			}
		}

		// TODO later support updating candidates by a fancy query

		// TODO later support changing the path?

		// TODO if this was a prototype then change all the dependents; may need special prototype support

		// TODO support delete

		return this
	}
}

window.Node = Node
