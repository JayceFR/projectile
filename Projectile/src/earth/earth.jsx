import { useEffect, useState } from "react"
import * as THREE from 'three'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import {convert_to_lat_long, createCycloid, plot_lat_long } from "./scripts/utils"
import mapURL from './assets/map2.jpg'
import cloudsURL from './assets/clouds.jpg'
import { radians } from "../model/utils"
import Init from "./scripts/init"
import Globe from "./scripts/globe"
import Input from "../components/input"
import { gen_3d_trajectory_points } from "../model/projectile"

function Earth(props){

  const [radius, setRadius] = useState(5)
  const [latitude, setLatitude] = useState(20.5937)
  const [longitude, setLongitude] = useState(78.9629)

  const [v0, setV0] = useState(0.1);
  const [angle, setAngle] = useState(45)

  const [path_geo, setPathGeo] = useState(null);

  const [lat_land, setLatLand] = useState(0);
  const [long_land, setLongLand] = useState(0);

  useEffect(()=>{

    const display = new Init('mycanvas', "econtroller");
    display.initialize()
    
    const globe = new Globe(vertexShader, fragmentShader, atmosVertexShader, atmosFragmentShader, mapURL, cloudsURL);
    // group.rotation.z = -23.4 * Math.PI / 180;
    display.scene.add(globe.display());

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({
        color:0xff0000,
      })
    )

    const points = new THREE.Group();
    globe.sphere.add(points)
    
    const launch_angle = radians(angle);
    const pointPosition = plot_lat_long(radius + 0.2, latitude, longitude)
    const vec_pos = new THREE.Vector3(pointPosition.x, pointPosition.y, pointPosition.z);
    mesh.position.copy(vec_pos);
    points.add(mesh);

    var [ppoints, end_pos] = gen_3d_trajectory_points(launch_angle, v0, latitude, vec_pos, pointPosition)
    var path = new THREE.CatmullRomCurve3(ppoints);
    const path_geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
    var mat = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 20,
    });
    var line = new THREE.Line(path_geometry, mat);
    globe.sphere.add(line);

    //Land Lat and Long
    const [llat, llong] = convert_to_lat_long(end_pos.x, end_pos.y, end_pos.z)
    setLatLand(llat);
    setLongLand(llong);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onMouseClick(event){
      pointer.x = (event.clientX/ window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, display.camera);
      const intersects = raycaster.intersectObject(globe.sphere);
      if (intersects.length > 0){
        const intersect = intersects[0]
        const point = intersect.point
        const [lat, lon] = convert_to_lat_long(point.x, point.y + 0.8, point.z);
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshBasicMaterial({
            color:0xff0000,
          })
        )
        const mark_pos = plot_lat_long(5.2, lat, lon);
        marker.position.copy(mark_pos);
        points.add(marker);
      }
    }

    window.addEventListener('contextmenu', onMouseClick, false)

    setPathGeo(path_geometry)


    const animate = (time) => {
      display.animate();
      globe.animate();
      window.requestAnimationFrame(animate);

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
    <div className="parent">
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={v0} change_method={setV0} type={'float'}/>
        <Input name={"latitude"} unit={"deg"} value={latitude} change_method={setLatitude} type={'float'}/>
        <Input name={"longitude"} value={longitude} unit={"deg"} change_method={setLongitude} type = {'float'}/>
      </div>
      <div id="econtroller">
        <canvas id="mycanvas"/>
        <div className="lalong">
          <p>Latitude of Landing Point : {lat_land.toPrecision(6)}</p>
          <p>Longitude of Landing Point : {long_land.toPrecision(6)}</p>
        </div>
      </div>
    </div>
    
      
    </>
  )
}

export default Earth