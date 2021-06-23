
import {Group} from './group.js'

// - TODO - do i really want to bother extending group?
// 

export class Mesh extends Group {

	constructor(props) {
		super()
		this.onchange(props)
	}

	onchange(props) {

		// TODO later support changes
		if(this.built) return
		this.built = 1

		let color = props.color || 0xff00ff

		let material = new THREE.MeshPhongMaterial({
			color,
			shininess:0,
			//opacity: 0.6,
			//transparent: true,
		});

		// TEST
		let stacy_mtl = 0
		let stacy_txt = 0
		if(props.shape == "./meshes/stacy.glb") {
			stacy_txt = new THREE.TextureLoader().load('./meshes/stacy.jpg');
			stacy_txt.flipY = false; // we flip the texture so that its the right way up
			material = stacy_mtl = new THREE.MeshPhongMaterial({
				map: stacy_txt,
				color: 0xffffff,
				skinning: true
			});
		}

		let geometry = 0
		let mesh = 0

		switch(props.shape) {
			case "plane":
				geometry = new THREE.PlaneGeometry(50,50,1,1)
				mesh = this.group = new THREE.Mesh(geometry,material)
				mesh.rotation.x = -Math.PI/2
				mesh.receiveShadow = true
				mesh.blox = this
				mesh.name = props.name
				break;
			case "box":
				geometry = new THREE.BoxGeometry(2,2,2);
				mesh = this.group = new THREE.Mesh(geometry,material)
				mesh.castShadow = true
				mesh.blox = this
				mesh.name = props.name
				break
			case "sphere":
				geometry = new THREE.SphereGeometry( 1, 32, 32 );
				mesh = this.group = new THREE.Mesh(geometry,material)
				mesh.castShadow = true
				mesh.blox = this
				mesh.name = props.name
				break

			default:

				if(!this.loader) this.loader = new THREE.GLTFLoader();

				// build before the async call below so that the mesh gets stuffed into scene - could use a temporary loading obj also TODO
				this.group = new THREE.Group()
				this.group.blox = this
				this.group.name = props.name

				this.loader.load(props.shape, glb => {
					console.log("mesh: loaded " + props.shape)

					glb.scene.traverse(o=>{
						if(o.isMesh) o.castShadow = true
						if(stacy_mtl) o.material = stacy_mtl
					})

					this.group.add(glb.scene)

					let mixer = new THREE.AnimationMixer(glb.scene)
					if(glb.animations && glb.animations.length) {
						console.log("found some animations")
						console.log(glb.animations)
						let idleAnim = THREE.AnimationClip.findByName(glb.animations, 'idle')
						let idle = mixer.clipAction(idleAnim)
						if(idle) {
							idle.play();
							let clock = new THREE.Clock()
							this.group.ontick = () => {
							  mixer.update(clock.getDelta());
							}
						}
					}

				})
		}
	}

	// onprops() on the base class basically will call these...

	set xyz(val) {
		this.group.position.set(val.x,val.y,val.z)
	}

	set ypr(val) {
		this.group.rotation.set(val.x,val.y,val.z)		
	}

	set size(val) {
		this.group.scale.set(val.x,val.y,val.z)
	}

	///
	/// for now send everything -> and is sent only to other parties
	/// TODO later refine
	///

	toJSON() {
		return {
			name:this.name,
			path:this.path,
			blox:this.blox,
			color:this.color,
			shape:this.shape,
			xyz:this.group.position,
			ypr:{x:this.group.rotation.x,y:this.group.rotation.y,z:this.group.rotation.z},
			event:"update",
		}
	}

}

/*
		// test idea on getter/setter event listeners
		// register event handlers used by this system architecture
		this.handlers={
			xyz:[(v) => {mesh.position.set(v.x,v.y,v.z)}],
			size:[(v) => {mesh.scale.set(v.x,v.y,v.z)}],
			touch:[],
		}
	}

}

// a getter setter pair for on_xyz - manually built as a test - todo maybe automate this entire builder
Object.defineProperty(Mesh.prototype, "xyz", {
	get:function() { return this.mesh.position },
	set:function(v) { this.handlers.xyz.forEach(h=>{h(v)})}
})

// a getter setter pair for on_xyz - manually built as a test
Object.defineProperty(Mesh.prototype, "size", {
	get:function() { return this.mesh.scale },
	set:function(v) { this.handlers.size.forEach(h=>{h(v)})}
})

// a getter setter pair for on_touch also - manually built as a test
Object.defineProperty(Mesh.prototype, "touch", {
	get:function() { return 0 },
	set:function(v) {this.handlers.touch.forEach(h=>{h(v)})}
})
*/

