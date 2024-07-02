import { useEffect } from "react"
import * as THREE from 'three'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {convert_to_lat_long, createCycloid, plot_lat_long } from "./utils"
import mapURL from './assets/map2.jpg'
import cloudsURL from './assets/clouds.jpg'
import { radians } from "../model/utils"

console.log(atmosVertexShader, atmosFragmentShader)

function Earth(props){

  useEffect(()=>{
    const scene = new THREE.Scene();

    // const axes_helper = new THREE.AxesHelper(20);
    // scene.add(axes_helper);

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
            value: new THREE.TextureLoader().load(mapURL)
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
        map: new THREE.TextureLoader().load(cloudsURL),
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
    controls.enableDamping = true
    controls.dampingFactor = 0.1

    window.addEventListener('resize', () =>{
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight); 
    });

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({
        color:0xff0000,
      })
    )

    const points = new THREE.Group();
  
    const radius = 5;
    const latitude = 20.5937; 
    const longitude = 78.9629; 
    const pointPosition = plot_lat_long(radius + 0.2, latitude, longitude)
    console.log("long, lat", convert_to_lat_long(pointPosition.x, pointPosition.y, pointPosition.z))
    const vec_pos = new THREE.Vector3(pointPosition.x, pointPosition.y, pointPosition.z);
    mesh.position.copy(vec_pos);
    points.add(mesh);

    // const mesh2 = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.1, 16,15),
    //   new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //   })
    // )
    // mesh2.position.copy(pointPosition)
    // points.add(mesh2)


    const v0 = 0.1
    const launch_angle = -Math.PI / 6
    const launch_direction = new THREE.Vector3(Math.cos(launch_angle), Math.sin(launch_angle), Math.cos(launch_angle)) 
    const initial_vel = launch_direction.multiplyScalar(v0);

    //Taking angular speed of earth into account
    initial_vel.setX(initial_vel.x += Math.cos(radians(latitude)) * 0.01)
    initial_vel.setZ(initial_vel.z += Math.cos(radians(latitude)) * 0.01)

    console.log("initial_vel", initial_vel, Math.cos(radians(latitude)) * 0.1)

    sphere.add(points)

    const centre = new THREE.Vector3(0,0,0);
    let done = false
    const proj_pos = vec_pos.clone();
    const GM = 1
    const w = 0.0000729
    var projectiles = []

    for(let i=0; i<=40; i+=1){
      if (!done){
        console.log("vel", initial_vel)
        initial_vel.multiplyScalar(2)
        const r = Math.sqrt(Math.pow(proj_pos.x, 2) + Math.pow(proj_pos.y, 2) + Math.pow(proj_pos.z, 2))
        const a = new THREE.Vector3(proj_pos.x / Math.pow(r,3), proj_pos.y / Math.pow(r,3), proj_pos.z / Math.pow(r,3)).normalize()
        a.multiplyScalar(-GM);
        console.log("acc", a)
        initial_vel.add(a);
        proj_pos.add(initial_vel);
        const dist_from_centre = proj_pos.length();
        if (dist_from_centre <= 5){
          proj_pos.setLength(5.2)
          done = true
        }
        console.log("dist from centre ", dist_from_centre);
        projectiles.push(proj_pos)
      } 
    }

    console.log("projectiles", projectiles[projectiles.length - 1])
    const end_pos = projectiles[projectiles.length - 1].clone()
    const mid = new THREE.Vector3().addVectors(pointPosition, end_pos);
    const mid_r = Math.sqrt(Math.pow(mid.x, 2) + Math.pow(mid.y, 2) + Math.pow(mid.z, 2))
    if (mid_r <= 5){
      console.log("EROORORORO")
    }
    console.log(mid);
    var [geom, ppoints] = createCycloid(
      new THREE.Vector3(pointPosition.x, pointPosition.y, pointPosition.z),
      new THREE.Vector3(end_pos.x, end_pos.y, end_pos.z),
      mid_r/10, 
      100, 
      1);

    var path = new THREE.CatmullRomCurve3(ppoints);
    console.log("ppoints",ppoints)
    const path_geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
    var mat = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 20,
    });
    var line = new THREE.Line(path_geometry, mat);
    sphere.add(line);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onMouseClick(event){
      pointer.x = (event.clientX/ window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0){
        console.log("I am here")
        const intersect = intersects[0]
        const point = intersect.point
        const [lat, lon] = convert_to_lat_long(point.x, point.y + 0.8, point.z);
        console.log(lat, lon)
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshBasicMaterial({
            color:0xff0000,
          })
        )
        const mark_pos = plot_lat_long(5.2, lat, lon);
        marker.position.copy(mark_pos);
        // marker.position.copy(point.clone());
        points.add(marker);
      }
    }

    window.addEventListener('click', onMouseClick, false)


    const animate = (time) => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
      sphere.rotation.y += 0.0005;
      clouds.rotation.y += 0.0015;  

      const t = (time / 1000 % 6) / 6;
      try{
        const position = path.getPointAt(t);
        mesh.position.copy(position)
      }
      catch(err){
        console.log(err);
      }
    }
    animate();
    

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