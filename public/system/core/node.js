/*

Node will "resolve" (create or update) a json graph into memory as hierarchy of objects based on js classes.

Graphs look like this:

	// a root node should anchor other nodes

	let root = new Node({name:"/root",path:"/root"})

	// a typical graph
	let scene =  {
		path: "/a/b/c/d",			// a path can be specified, in which case all nodes in between are built
		mylight: {					// a child node gets plucked out of the hash and stuffed in this.children{}
			base:"/display/light3"	// the base field may specify a javascript file based class to load and use
		},
		myclone: {
			base:"/mylight"			// base may specify a child can be a clone of a previous child
		},
		mystuff: {
			base:"somefile.js"		// can load nodes from a file path
		},
		children: [ {},{},{} ],		// a group of children can be set in this way also
		children: {					// this is not supported yet
			a:1234
			b:casdf
			c:adsf
		}
		color:"Red",				// simple literals are possible
	}

	root.resolve(scene)				// this inhales the data structure

Goals

	+ grants names to nodes if needed
	+ tries to make a direct mapping between json and obj as in mynode.mychildnode.myvariable
	+ query() support to find nodes by name
	+ resolve) for an inhale/exhale pattern for networking
	+ prototype based composition; base classes and base instances are treated in a similar way

Notes

	+ constructors() are passed the props, but the parent node may not be present

	- we probably want an onloaded
	- we kinda want parents built before children
	- should constructor be responsible for child props???

*/


export let nanoid=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;){let n=63&r[t];e+=n<36?n.toString(36):n<62?(n-26).toString(36).toUpperCase():n<63?"_":"-"}return e};

let cache = {}
let uuid = nanoid()
let localid = 0
let ALLOWNAMED = 1

export class Node {

	query() {}

	remove() {
	}

	///
	/// special helper for root node
	///
	/// The 'built in' collection of core capabilities can be produced from naked classes stored in '/system'
	/// And 'userland' or 'not built in' capabilities in this particular app are being stored in '/userland' for now
	///
	/// Here I produce a generic Node (from the core system collection) to act as an anchor for everything else
	/// Right now I set the path by hand; it could use some thought - perhaps a convention around naming.
	///
	/// Note that there are two separate graphs here:
	///
	///		An objects "base" is indicated by an url to a type, a resource or a capability
	///		An objects "path" is purely a convenience concept to distinguish between nodes in the graph
	///

	static root() {
		if(window.root) return window.root
		let node = window.root = new Node();
		node.name = "root"
		node.path = "/root"
		return node
	}

	///
	/// factory
	///

	static async factory(props) {

		let base = props.base

		// If there is a base type but it is actually a prototype instance then clone that instance and return
		if(false) {
			// TODO -> proto support -> should somehow? search the dag for an instance matching this and carefully clone
			// TODO -> carefully clone the proto? may have to clone dynamic functions on edge
			//inst = proto.clone();
			return
		}

		// Otherwise look for a base class constructor
		let c = (base && base.length) ? cache[base] : Node

	//console.log(base)

		// Otherwise attempt to manufacture artifact from some kind of description on disk
		if(!c) {
			let m = await import(base+".js")
			if(m) {
				for(const [k,v] of Object.entries(m)) {
					c = cache[base] = v
				}
				// TODO -> handle not just class declarations but also instances or ordinary js hashes
				//		-> in this case pre-populate with the contents here, and then overlay with props later
			}
		}

	//console.log(c)

		if(!c) {
			throw "Class constructor not found " + base
		}

		// as a convenience pass useful props to the child - although resolve() will explicitly set them all
		let inst = await new c(props)

		// TODO we may want to not always make this the base class but rather a ref to the previous instance
		inst.base = base

		return inst
	}

	///
	/// Insert new child from props
	/// Use a prototype philosophy that folds classes and instances together as prototypical instance
	/// The base: property can refer to an existing instance by path, or a url file path to load
	/// The loaded file can be a new class declaration, or an instance (a vanilla property hash)
	/// TODO this isn't fully complete yet - only class loading is supported for now
	/// TODO may need to deal with changing path for existing obj
	///

	async insert(props) {

		// this is a hack for now
		if(props.base && props.base.startsWith("/system/") == false) {
			// - todo arguably base and base could be the same; and detect if a class or an instance
			// - todo don't do this if this entity already exists and is just being updated; avoid hitting disk
			props = await import(props.base + ".js")
			props = props.thing
		}


		// prepare to receive children in general
		if(!this.children) this.children={}

		// grant a name if needed -> TODO check for naming collisions on immediate children
		if(!props.name) {
			localid++
			let num = (""+localid).padStart(8,0)
			props.name = uuid + "_" + num
			props.uuid = uuid + "_" + num
		}

		// always force the path
		props.path = this.path + "/" + props.name

		// child exists?
		let child = this.children[props.name]

		// manufacture if does not exist
		if(!child) {
			props.parent = this
			child = await Node.factory(props)
			child.name = props.name
			child.path = props.path
			child.base = props.base
			child.parent = this
			this.children[props.name] = child
			if(ALLOWNAMED)this[props.name]=child
		}

		// the constructor above did pass all the fields to the object on construction
		// but as well during a change to an existing object there is a chance to review new fields as well
		// this can be disabled by a child node by overriding resolve()

		if(child.resolve) {
			await child.resolve(props)
		}
		return child
	}

	///
	/// Resolve
	/// Set properties on an already existing object
	/// Specially supports manufacturing new children and inserting them
	///

	async resolve(props) {

		// convenience feature: treat an array as a series of separate calls to resolver
		if(props instanceof Array) {
			props.forEach( this.resolve )
			return
		}

		// child path resolver feature: if a path is supplied then help find the right scope recursively
		// TODO test - may need some thought around naming
		if(props.path && this.path && props.path != this.path) {
			if(!props.path.startsWith(this.path)) {
				throw 'Illegal path';
			}
			let segment = props.path.substring(this.path.length)
			let fragments = segment.split("/")
			if(!fragments.length) {
				throw 'Path should not have ended here'
			}
			let name = fragments[0]
			props.name = name
			await this.insert(props)
			return
		}

		// deal with properties to apply to this
		for(const [k,v] of Object.entries(props)) {

			let isAbstract = v.protobase && v.protobase.constructor ? true : false
			let isArray = v instanceof Array
			let isObject = v instanceof Object
			let isNode = v instanceof Node

//console.log("prop " + k)

			if(k == "base" && v!=this.base) {
				console.log(this)
				console.log(k)
				throw "Changing base is not supported " + this.path
			}
			else if(k=="children") {
				throw "Setting children array is not supported yet"
				// if 'children' is an array then treat as children
				// v.forEach( this.insert ) // <- we need to name these TODO
			}
			else if(k=="parent") {
				continue // throw "Changing parent is not supported yet"
			}
			else if(isNode) {
				throw "Setting a node child property is not supported yet on field="+k
			}
			else if(isNode || isAbstract || isArray || !isObject || !v.base || !v.base.length) {
				// update a simple field
				this[k]=v
			}
			else if(!isObject) {
				throw "Unknown property type on field=" + k
			}
			else {
				// update a child

//console.log("adding child " + name)

				v.name = k
				await this.insert(v)
			}

		}

		// TODO support delete
		// TODO support move path or change type
		// TODO support update prototypes descendants
		return this
	}

	///
	/// test code - on tick
	/// TODO move to events
	///

	ontick() {
		if(!this.children || !Object.keys(this.children).length ) {
			return
		}
		// rename this TODO it should just be the event handler in general; like a resolve() or something
		for(const [k,v] of Object.entries(this.children)) {
			v.ontick()
		}
	}


}

window.Node = Node

cache.node = Node 

