import { useEffect } from "react"
import * as THREE from 'three'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { radians } from "../model/utils"
import { calculatePointOnSphere, plot_lat_long } from "./utils"
import { gen_points_3d } from "../model/projectile"

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
    
    const group = new THREE.Group();
    // group.rotation.z = -23.4 * Math.PI / 180;
    scene.add(group);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,32,32),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load("Projectile/src/assets/map2.jpg")
          }
        }
        // map: new THREE.TextureLoader().load('Projectile/src/assets/map.jpg')
      })
    );

    group.add(sphere)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,32,32),
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
      new THREE.SphereGeometry(5, 32, 32),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('Projectile/src/assets/clouds.jpg'),
        blending: THREE.AdditiveBlending,
        // side: THREE.FrontSide,
      })
    )

    clouds.scale.setScalar(1.03);

    group.add(clouds);

    const controls = new OrbitControls(camera, renderer.domElement);

    // controls.minDistance = 12;
    // controls.maxDistance = 30;
    controls.enablePan = false;
    controls.update();
    controls.saveState();

    window.addEventListener('resize', () => this.onWindowResize(), false);

    // const mesh = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.1, 16, 16),
    //   new THREE.MeshBasicMaterial({
    //     color:0xff0000,
    //   })
    // )

    const points = new THREE.Group();
  
    const radius = 5;
    const latitude = 6.8165; 
    const longitude = 39.2894; 
    const pointPosition = plot_lat_long(radius + 0.2, latitude, longitude)

    const ppoints = gen_points_3d(pointPosition, 30, 60, 20, 9.8, latitude);
    for (let index = 0; index<ppoints.length; index++){
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({
          color:0xff0000,
        })
      )

      const vec_pos = new THREE.Vector3(ppoints[index].x, ppoints[index].y, ppoints[index].z);
      mesh.position.copy(vec_pos);
      points.add(mesh);
    }

    sphere.add(points)

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