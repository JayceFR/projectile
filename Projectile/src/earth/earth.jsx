import { useEffect, useState } from "react"
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import {convert_to_lat_long, plot_lat_long } from "./scripts/utils"
import mapURL from './assets/map2.jpg'
import cloudsURL from './assets/clouds.jpg'
import Init from "./scripts/init"
import Globe from "./scripts/globe"
import Input from "../components/input"
import { Trajectory } from "./scripts/trajectory"
import { MeshBasicMaterial, Raycaster, SphereGeometry, Vector2 } from "three"

function Earth(props){

  const [radius, setRadius] = useState(5)
  const [latitude, setLatitude] = useState(20.5937)
  const [longitude, setLongitude] = useState(78.9629)

  const [v0, setV0] = useState(0.1);
  const [angle, setAngle] = useState(45)

  const [globe, setGlobe] = useState(new Globe(vertexShader, fragmentShader, atmosVertexShader, atmosFragmentShader, mapURL, cloudsURL));
  const [trajectory, setTrajectory] = useState(new Trajectory());

  const [lat_land, setLatLand] = useState(0);
  const [long_land, setLongLand] = useState(0);

  useEffect(()=>{

    const display = new Init('mycanvas', "econtroller");
    display.initialize()

    // group.rotation.z = -23.4 * Math.PI / 180;
    display.scene.add(globe.display());

    const [lat, long] = trajectory.update(angle, radius , latitude, longitude, v0);
    setLatLand(lat)
    setLongLand(long)

    globe.sphere.add(trajectory.point)

    const raycaster = new Raycaster();
    const pointer = new Vector2();

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
          new SphereGeometry(0.1, 16, 16),
          new MeshBasicMaterial({
            color:0xff0000,
          })
        )
        const mark_pos = plot_lat_long(5.2, lat, lon);
        marker.position.copy(mark_pos);
        points.add(marker);
      }
    }

    window.addEventListener('contextmenu', onMouseClick, false)

    const animate = (time) => {
      display.animate();
      globe.animate();
      trajectory.animate(time);
      window.requestAnimationFrame(animate);

    }
    animate();
    

  }, [])

  useEffect(() => {
    globe.sphere.remove(trajectory.line)
    const [lat, long] = trajectory.update(angle, radius , latitude, longitude, v0);
    globe.sphere.add(trajectory.line)
    setLatLand(lat)
    setLongLand(long)
    return () => {
      globe.sphere.remove(trajectory.line);
    }
  }, [angle, latitude, longitude, v0])



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