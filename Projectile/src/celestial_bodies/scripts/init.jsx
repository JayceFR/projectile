
import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Init {
  constructor (canvasID, canvasContainterID){
    this.scene = undefined
    this.camera = undefined
    this.renderer = undefined

    this.fov = 75
    this.nearPlane = 1
    this.farPlane = 1000
    this.canvasID = canvasID
    this.canvasContainterID = canvasContainterID

    this.clock = undefined
    this.controls = undefined

    this.ambientLight = undefined
    this.directionalLight = undefined
  }

  initialize(){
    this.scene = new Scene();
    const canvas_container = document.getElementById(this.canvasContainterID)
    this.camera = new PerspectiveCamera(
      this.fov,
      (window.innerWidth * 0.75) / (window.innerHeight ),
      0.1,
      1000
    )
    this.camera.position.z = 15
    const canvas = document.getElementById(this.canvasID);
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true
    });

    this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight );
    document.body.appendChild(this.renderer.domElement)

    this.clock = new Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minDistance = 9;
    this.controls.maxDistance = 19;
    this.controls.enablePan = false;
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1
    this.controls.update();
    this.controls.saveState();

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    this.camera.aspect = (window.innerWidth * 0.75) / (window.innerHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
  }

  animate() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}