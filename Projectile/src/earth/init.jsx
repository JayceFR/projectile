import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Init {
  constructor (canvasID){
    this.scene = undefined
    this.camera = undefined
    this.renderer = undefined

    this.fov = 75
    this.nearPlane = 1
    this.farPlane = 1000
    this.canvasID = canvasID

    this.clock = undefined
    this.controls = undefined

    this.ambientLight = undefined
    this.directionalLight = undefined
  }

  initialize(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 15
    const canvas = document.getElementById(this.canvasID);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement)

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.minDistance = 12;
    this.controls.maxDistance = 30;
    this.controls.enablePan = false;
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1
    this.controls.update();
    this.controls.saveState();

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}