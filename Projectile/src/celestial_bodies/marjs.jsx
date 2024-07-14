import { useEffect, useState } from "react"
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosVertexShader from './shaders/atmosVertex.glsl'
import atmosFragmentShader from './shaders/atmosFragment.glsl'
import mapURL from './assets/mars_map.jpg'
import cloudsURL from './assets/mars_cloud.png'
import Init from "./scripts/init"
import Globe from "./scripts/globe"
import Input from "../components/input"
import { Trajectory } from "./scripts/trajectory"
import { Vector3 } from "three"

function Mars(props){

  const [radius, setRadius] = useState(4)
  const [latitude, setLatitude] = useState(20.5937)
  const [longitude, setLongitude] = useState(78.9629)

  const [v0, setV0] = useState(0.1);
  const [angle, setAngle] = useState(45)

  const [globe, setGlobe] = useState(new Globe(vertexShader, fragmentShader, atmosVertexShader, atmosFragmentShader, mapURL, null, new Vector3(0.9, 0.5, 0.4), 0.5, radius));
  const [trajectory, setTrajectory] = useState(new Trajectory());

  const [lat_land, setLatLand] = useState(0);
  const [long_land, setLongLand] = useState(0);

  const [GM, setGM] = useState(0.377);

  useEffect(()=>{

    const display = new Init('mycanvas', "econtroller");
    display.initialize()

    // group.rotation.z = -23.4 * Math.PI / 180;
    display.scene.add(globe.display());

    const [lat, long] = trajectory.update(angle, radius , latitude, longitude, v0, GM);
    setLatLand(lat)
    setLongLand(long)

    globe.sphere.add(trajectory.point)

    const animate = (time) => {
      display.animate();
      globe.animate();
      trajectory.animate(time);
      window.requestAnimationFrame(animate);

    }
    animate();

    return () => {
      display.dispose();
      display.scene.remove(globe.globe);
      display.scene.remove(trajectory.point);
      globe.sphere.remove(trajectory.line);
    }

  }, [])

  useEffect(() => {
    globe.sphere.remove(trajectory.line)
    const [lat, long] = trajectory.update(angle, radius , latitude, longitude, v0, GM);
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

export default Mars