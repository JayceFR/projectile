import { useState, useEffect } from "react"
import { convert_to_points, ux, uy } from "../model/utils";
import Graph from "../components/graph";
import Input from "../components/input";
import Popup from "../components/popup";

function Challenge1(props){
  const [angle, setAngle] = useState(45);
  const [vel, setVel] = useState(20);
  const [height, setHeight] = useState(2);
  const [g, setg] = useState(9.8);
  const [time_step, set_time_step] = useState(0.02);

  const [show, setShow] = useState(false);

  const [points, setPoints] = useState({});

  const code_string = '(num) => num + 1';

  const generate_points = () => {
    let time = 0;
    let y = height + uy(vel, angle) - 0.5 * g * time * time;
    let x = 0;
    let ppoints = {x:[], y:[]};
    while (y > -10){
      y = height + uy(vel, angle) * time - 0.5 * g * time * time;
      x = ux(vel, angle) * time;
      ppoints.x.push(x);
      ppoints.y.push(y);
      time += time_step;
    }
    setPoints(convert_to_points(ppoints))
  }

  const del_popup = () => {
    setShow(false);
  }

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g, time_step])

  return (
    <>
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel} type={'float'}/>
        <Input name={"launch height"} unit={"m"} value={height} change_method={setHeight} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setg} type = {'float'}/>
      </div>
      <div className="canvas">
        <button className="magnify" onClick={() => {setShow(true)}}>🔍</button>
        <div className="graph">
          <Graph 
            points = {points} 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {[
              {
                label: "No Air Resistance",
                data: points,
                borderColor: "rgb(75,192,192)",
                cubicInterpolationMode: 'monotone',
              },
            ]}
            />
        </div>
      </div>
      {show && <Popup del={del_popup}/>}
    </>
  )

}

export default Challenge1