import { useEffect } from "react"
import * as THREE from 'three'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

console.log(atmosVertexShader, atmosFragmentShader)

function Earth(props){

  useEffect(()=>{
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    const canvas = document.getElementById('mycanvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 2)
    
    const group = new THREE.Group();
    group.rotation.z = -23.4 * Math.PI / 180;
    scene.add(group);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,50,50),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load("Projectile/src/assets/map.jpg")
          }
        }
        // map: new THREE.TextureLoader().load('Projectile/src/assets/map.jpg')
      })
    );

    group.add(sphere)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,50,50),
      new THREE.ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    )
    atmosphere.scale.set(1.1, 1.1, 1.1);
    group.add(atmosphere);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('Projectile/src/assets/clouds.jpg'),
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
      })
    )

    clouds.scale.setScalar(1.03);

    group.add(clouds);

    const controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize(), false);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
      sphere.rotation.y += 0.0005;
      clouds.rotation.y += 0.0015;
    }
    animate()

  }, [])

  return (
    <>
      <div>
        <canvas id="mycanvas"/>
      </div>
    </>
  )
}

export default Earth