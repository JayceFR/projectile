import { useState, useEffect } from "react";
import { calcK, convert_to_points, gen_points, radians, ux, uy } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";
import { Vector2 } from "three";
import { drag_verlet, no_drag_verlet } from "../model/projectile";
import Popup from "../components/popup";
//Borrowed code from challenge 2
function Challenge9(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);

  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  const [drag, setDrag] = useState(0.1);
  const [area, setArea] = useState(0.007854);
  const [density, setDensity] = useState(1);
  const [mass, setMass] = useState(0.1);

  const [k, setK] = useState(calcK(drag, density, area, mass))

  const [points, setPoints] = useState([]);
  const [drag_points, setDragPoints] = useState([]);

  const [show, setShow] = useState(false);
  const del_popup = () => {
    setShow(false);
  }

  
  function generate_points(){
    var vx = ux(vel, angle);
    var vy = uy(vel, angle);
    var px = 0;
    var py = height;
    //no drag curve
    var no_drag_points = {x: [], y: []}
    var dict = no_drag_verlet(px, py, vx, vy, 0, -g);
    no_drag_points.x = no_drag_points.x.concat(dict.x);
    no_drag_points.y = no_drag_points.y.concat(dict.y);
    setPoints(convert_to_points(no_drag_points));
    //drag curve
    const curr_k = calcK(drag, density, area, mass);
    var drag_dict = drag_verlet(px, py, vx, vy, curr_k, g);
    setDragPoints(convert_to_points(drag_dict));
    setK(curr_k);
  }

  

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g, drag, area, density, mass])

  console.log("points",points)
  return (
    <>
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle2} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel2} type={'float'}/>
        <Input name={"launch height"} unit={"m"} value={height} change_method={setHeight2} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setg2} type = {'float'}/>
        <br></br>

        <Input name={"drag coefficient"} unit={""} value={drag} change_method={setDrag} type={'float'}/>
        <Input name={"cross sectional area"} unit={"m^2"} value={area} change_method={setArea} type={'float'}/>
        <Input name={"air density"} unit={"kgm^-3"} value={density} change_method={setDensity} type={'float'}/>
        <Input name={"object mass"} unit={"kg"} value={mass} change_method={setMass} type={'float'}/>
        

      </div>
      <div className="canvas">
      <button className="magnify" onClick={() => {setShow(true)}}>🔍</button>
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {[
              {
                label: "No Air Resistance",
                data: points,
                borderColor: "rgb(75,192,192)",
                pointBackgroundColor: "rgb(75,192,192)",  
              },
              {
                label: "Air Resistance",
                data: drag_points,
                borderColor: "rgb(225,20,20)",
                pointBackgroundColor: "rgb(225,20,20)",  
              },
            ]}
            />
        </div>
      </div>
      {show && <Popup del={del_popup} index = {8}/>}
    </>
  )
}

export default Challenge9;
