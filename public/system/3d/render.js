
import {Mesh} from './mesh.js'

export class Render extends Node {

	constructor() {
		super()

// TODO rely on externally provided mesh

		// make canvas
		let canvas = this.canvas = document.body.appendChild(document.createElement("canvas"))
		canvas.width = document.body.clientWidth;
		canvas.height = 600;

		// make renderer
		let renderer = this.renderer = new THREE.WebGLRenderer({canvas})
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(canvas.width, canvas.height, false);

		// a resize helper
		function resizeRendererToDisplaySize(renderer) {
			const canvas = renderer.domElement;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			const needResize = canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}
			return needResize;
		}

		// a scene
		this.scene = this.group = new THREE.Scene();
		this.scene.background = new THREE.Color('blue');

		// a camera
		const fov = 45;
		const aspect = 2;
		const near = 0.1;
		const far = 500;
		const camera = this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0,1,-10)
		camera.lookAt(new THREE.Vector3(0,0,0))

		// add a light to camera
		//let pointLight = new THREE.PointLight( 0xffffff );
		//pointLight.position.set(0,0,2)
		//camera.add(pointLight)

		// a light for now
		{
			const skyColor = 0xB1E1FF;  // light blue
			const groundColor = 0xB97A20;  // brownish orange
			const intensity = 1;
			const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
			light.position.set(0,10,0)
			this.group.add(light)
		}


		// a light for now
		{
			const light = new THREE.DirectionalLight(0xffffff,1,100);
			light.position.set(0,3,-8)
			//light.target.position.set(0, 0, 0);
			light.castShadow = true
			this.group.add(light);

			//scene.add(light.target);
			//Set up shadow properties for the light
			light.shadow.mapSize.width = 4096; // default
			light.shadow.mapSize.height = 4096; // default
			light.shadow.camera.near = 0.1; // default
			light.shadow.camera.far = 2000; // default
			let d = 8.25
			//light.shadow.camera.left = d * -1;
			//light.shadow.camera.right = d;
			//light.shadow.camera.top = d;
			//light.shadow.camera.bottom = d * -1;
			this.scene.add(light)
		}

		// render helper
		let render = () => {

			// fiddle with camera
			if(camera.idealtarget) {

				let obj = camera.idealtarget
				let pos = obj.getWorldDirection(new THREE.Vector3())
				pos.x = obj.position.x - pos.x * 3
				pos.y = obj.position.y+1
				pos.z = obj.position.z - pos.z * 3
				camera.position.lerp(pos,0.2)

				let look = camera.idealtarget.position
				camera.lookAt(new THREE.Vector3(look.x,look.y+1,look.z))
			}

			// fiddle with display?
			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
				this.camera.updateProjectionMatrix();
			}

			for(let i = 0; i < this.scene.children.length;i++) {
				let obj = this.scene.children[i]
				if(obj.ontick) obj.ontick()
			}

			// paint
			renderer.render(this.scene, this.camera);
			requestAnimationFrame(render);
		}

		// go
		requestAnimationFrame(render)
	}

}