import { useState, useEffect } from "react";
import { convert_to_points, gen_animation, gen_points, radians, range, ux, uy } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";
import { no_drag_verlet } from "../model/projectile";
import Popup from "../components/popup";
//Borrowed code from challenge 2
function Challenge8(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);

  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  const [CofE,setCofE]= useState(0.5);
  const bounces= 5;

  const [points, setPoints] = useState([]);

  const [animation, setAnimation] = useState(gen_animation(points.length))

  const [show, setShow] = useState(false);
  const del_popup = () => {
    setShow(false);
  }

  function generate_points(){
    var vx = ux(vel, angle);
    var vy = uy(vel, angle);
    var px = 0;
    var py = height;
    var all_points = {x: [], y: []}
    for (let x = 0; x < bounces; x++){
      var dict = no_drag_verlet(px, py, vx, vy, 0, -g);
      //append to all points
      all_points.x = all_points.x.concat(dict.x);
      all_points.y = all_points.y.concat(dict.y);
      //update the values
      px = dict.x[dict.x.length - 2];
      py = dict.y[dict.y.length - 2];
      vx = dict.velocity[0];
      vy = dict.velocity[1] * - CofE;
    }
    var ppoints = convert_to_points(all_points)
    setAnimation(gen_animation(ppoints.length))
    setPoints(ppoints);
  }

  

  

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g])

  console.log("points",points)
  return (
    <>
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle2} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel2} type={'float'}/>
        <Input name={"launch height"} unit={"m"} value={height} change_method={setHeight2} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setg2} type = {'float'}/>
        
        {/* adding CofE as an input, need to figure out how to impliment a range of acceptable values */}
          
        <Input name={"Coefficient of Restitution"} unit={"ratio"} value={CofE} change_method={setCofE} type={"float"}/>

      </div>
      <div className="canvas">
      <button className="magnify" onClick={() => {setShow(true)}}>🔍</button>
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            animation = {animation}
            dataset = {[
              {
                label: "No Air Resistance",
                data: points,
                borderColor: "rgb(75,192,192)",
                pointBackgroundColor: "rgb(75,192,192)",  
              },
            ]}
            />
        </div>
      </div>
      
      {show && <Popup del={del_popup} index = {7}/>}
    </>
  )
}

export default Challenge8;
