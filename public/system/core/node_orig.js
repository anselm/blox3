
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


///
/// Factory for a collection of bases that provide class interfaces
///		- TODO debate the difference between classes as bases and ordinary json hashes as base?
///

async function factory(props={}) {
	let base = props.base
	let c = base && base.length ? cache[base] : Node;
	if(!c) {
		let m = await import(base+".js")
		if(m) {
			for(const [k,v] of Object.entries(m)) {
				c = cache[base] = v
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

	ontick() {
		console.log("processing " + this.name + " " + Object.keys(this.children).length )
		console.log(this.children)
		// rename this TODO it should just be the event handler in general; like a resolve() or something
		if(!this.children) {
			console.log('no kids for ' + this.name)
		}
		for(const [k,v] of Object.entries(this.children)) {
			console.log(k)
			console.log(v)
			v.ontick()
		}
	}

	///
	/// create and insert as child from properties
	/// 	- TODO detect if props is an instance
	///		- TODO do not reload if built already; especially if protobase

	async insert(props={}) {

		if(!this.children) this.children={}

		// this is basically create - may want to move there...

		// todo maybe separate out create from insert from update ... be more picky about what is permitted?
		// then it is easier to fold together the constructors

		if(props.base && props.base.startsWith("/system/") == false) {
			// - todo arguably base and base could be the same; and detect if a class or an instance
			// - todo don't do this if this entity already exists and is just being updated; avoid hitting disk
			props = await import(props.base + ".js")
			props = props.thing
		}

		// may have to grant a name?
		localid++
		props.uuid = (""+localid).padStart(8,'0') + uuid
		if(!props.name) props.name = props.base+localid
		props.path = this.path + "/" + props.name

		// exists?
		let child = this.children[props.name]
		if(!child) {
			props.parent = this
			child = await factory(props)
			if(!child) return 0
			child.name = props.name
			child.path = props.path
			child.base = props.base
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
			// TODO error not async
			props.forEach( this.insert )
			return
		}

		// set both trivial properties and also pull out children crumpled into the hash
		for(const [k,v] of Object.entries(props)) {

			let isAbstract = v.protobase && v.protobase.constructor ? true : false
			let isArray = v instanceof Array
			let isObject = v instanceof Object
			let isNode = v instanceof Node

			if(isArray && k=="children") {
				// TODO error not async
				// the array property 'children' is reserved for children entities; deal with this in a special way
				v.forEach( this.insert )
			}

			else if(isNode || isAbstract || isArray || !isObject || !v.base || !v.base.length) {
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

		// TODO if this was a protobase then change all the dependents; may need special protobase support

		// TODO support delete

		return this
	}
}

window.Node = Node
