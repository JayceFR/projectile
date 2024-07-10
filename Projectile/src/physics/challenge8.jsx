import { useState, useEffect } from "react";
import { convert_to_points, gen_points, radians } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";
//Borrowed code from challenge 2
function Challenge8(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);
  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);
  //defining CofE
  const[CofE,setCofE2]= useState(0.5);
  //defining number of bounces
  const bounces= 5;

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
    var ppoints = gen_points(50, {x:prange, y:0}, height, rangle, g, vel);
    setTimeOfFlight(prange/(vel * Math.cos(rangle)));
    setPoints(convert_to_points(ppoints));
    setXa(curr_xa);
    setYa(curr_ya);
    setRange(prange);
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
        
        <!-- adding CofE as an input, need to figure out how to impliment a range of acceptable values-->
          
        <Input name={"Coefficient of Restitution"} unit={"ratio"} change_method={setCofE2} type={"float"}/>

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
          <div className="output">
            <p>Range  : {range.toPrecision(4)}m</p>
            <p>Apogee : ({xa.toPrecision(3)}, {ya.toPrecision(3)})</p>
            <p>Time of Flight: {time_of_flight.toPrecision(3)}s</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Challenge8;
