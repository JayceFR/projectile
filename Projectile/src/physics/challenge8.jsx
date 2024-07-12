import { useState, useEffect } from "react";
import { convert_to_points, gen_points, radians, ux, uy } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";
import { Vector2 } from "three";
//Borrowed code from challenge 2
function Challenge8(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);

  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  const [CofE,setCofE]= useState(0.5);
  const bounces= 5;

  const [points, setPoints] = useState([]);

  // function generate_points() {
  //   let rangle = radians(angle);
  //   var all_points = {x: [], y: []}
  //   for (let x = 0; x < bounces; x++){
  //     let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
  //     var ppoints = gen_points(50, {x:prange, y:0}, height, rangle, g, vel);
  //     all_points.x.concat(ppoints.x)
  //     all_points.y.concat(ppoints.y)
      
  //   }
  //   setTimeOfFlight(prange/(vel * Math.cos(rangle)));
  //   setPoints(convert_to_points(ppoints));
  // }

  function generate_points(){
    var vx = ux(vel, angle);
    var vy = uy(vel, angle);
    var px = 0;
    var py = height;
    var all_points = {x: [], y: []}
    for (let x = 0; x < bounces; x++){
      var dict = verlet(px, py, vx, vy);
      console.log("Inside gen_points for loop", dict)
      //append to all points
      all_points.x = all_points.x.concat(dict.x);
      all_points.y = all_points.y.concat(dict.y);
      //update the values
      px = dict.x[dict.x.length - 1];
      py = dict.y[dict.y.length - 1];
      vx = dict.velocity[0];
      vy = dict.velocity[1] * - CofE;
    }
    console.log(all_points);
    setPoints(convert_to_points(all_points));
  }

  function verlet(px, py, vx, vy){
    var return_points = {x :[], y: [], time: [], velocity: []}
    var acceleration = [0, -g];
    var position = [px, py];
    var veloctiy = [vx, vy]
    var t = 0;
    var dt = 0.1;
    while (position[1] >= 0){
      //add the point to the graph
      console.log("inside the while loop")
      return_points.x.push(position[0])
      return_points.y.push(position[1])  
      return_points.time.push(t)
      //update postion
      position[0] += veloctiy[0] * dt + 0.5 * acceleration[0] * dt * dt;
      position[1] += veloctiy[1] * dt + 0.5 * acceleration[1] * dt * dt;
      //update velocity
      veloctiy[0] += acceleration[0] * dt;
      veloctiy[1] += acceleration[1] * dt;
      //update time
      t = t + dt;
    } 
    return_points.x.push(position[0])
    return_points.y.push(0)
    return_points.velocity.push(veloctiy[0], veloctiy[1]);
    return return_points;
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
            ]}
            />
        </div>
      </div>
    </>
  )
}

export default Challenge8;
