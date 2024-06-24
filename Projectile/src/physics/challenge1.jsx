import { useState, useEffect } from "react"
import { ux, uy } from "./utils";
import Graph from "../components/graph";
import Input from "../components/input";

function Challenge1(props){
  const [angle, setAngle] = useState(45);
  const [vel, setVel] = useState(20);
  const [height, setHeight] = useState(2);
  const [g, setg] = useState(9.8);
  const [time_step, set_time_step] = useState(0.02);

  const [points, setPoints] = useState({x: [], y: []});

  const generate_points = () => {
    let time = 0;
    let y = height + uy(vel, angle) - 0.5 * g * time * time;
    let x = 0;
    setPoints({x: [], y: []});
    let ppoints = {x:[], y:[]};
    while (y > -10){
      y = height + uy(vel, angle) * time - 0.5 * g * time * time;
      x = Math.floor(ux(vel, angle) * time);
      ppoints.x.push(x);
      ppoints.y.push(y);
      time += time_step;
    }
    setPoints(ppoints);
  }

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g, time_step])

  return (
    <>
      <div className="controls">
        <Input name={"launch angle /deg"} value={angle} change_method={setAngle}/>
        <Input name={"launch speed /ms^-1"} value={vel} change_method={setVel}/>
        <Input name={"launch height /m"} value={height} change_method={setHeight}/>
        <Input name={"g /ms^-2"} value={g} change_method={setg}/>
      </div>
      <div className="canvas">
        <div className="graph">
          <Graph points = {points} xtext = {"x/m"} ytext = {"y/m"} label={"No Air Resistance"}/>
        </div>
      </div>

    </>
  )

}

export default Challenge1