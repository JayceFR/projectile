import { useState, useEffect } from "react";
import { convert_to_points, radians } from "./utils";
import Input from "../components/input";
import Graph from "../components/graph";

function Challenge2(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);
  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  const [range, setRange] = useState(0);
  const [xa, setXa] = useState(0);
  const [ya, setYa] = useState(0);
  const [time_of_flight, setTimeOfFlight] = useState(0);

  const [points, setPoints] = useState([]);

  const generate_points = () => {
    console.log(typeof(vel))
    let rangle = radians(angle);
    const curr_xa = vel * vel * Math.sin(rangle)* Math.cos(rangle) * 1/g;
    const curr_ya = height + (vel * vel * Math.pow(Math.sin(rangle), 2) / (2 * g));
    let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
    console.log("range", prange);
    let ppoints = {x: [], y: []}
    for(let x = 0; x < 50; x++){
      var curr_x = 0 + x * prange/50;
      ppoints.x.push(curr_x);
      ppoints.y.push(height + curr_x * Math.tan(rangle) - g * (1 + Math.pow(Math.tan(rangle), 2)) * curr_x * curr_x * 1/(2*Math.pow(vel,2)));
    }
    //Add the final x intercept
    ppoints.x.push(prange);
    ppoints.y.push(0);

    setPoints(convert_to_points(ppoints));
    setXa(curr_xa);
    setYa(curr_ya);
    setRange(prange);
  }

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g])

  console.log("oints",points)
  return (
    <>
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle2} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel2} type={'float'}/>
        <Input name={"launch height"} unit={"m"} value={height} change_method={setHeight2} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setg2} type = {'float'}/>
      </div>
      <div className="canvas">
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {[
              {
                label: "Apogee",
                data: [{x:xa, y:ya}],
                pointRadius: 7,
                borderColor: "rgb(255,0,0)",
                pointBackgroundColor: "rgb(255,0,0)",
                pointStyle: 'rectRot'
              },
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

export default Challenge2;