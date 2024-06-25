import { useEffect, useState } from "react";
import { convert_to_points, gen_points, radians } from "./utils";
import Input from "../components/input";
import Graph from "../components/graph";

function Challenge4(props){
  const [angle, setAngle2] = useState(36);
  const [vel, setVel2] = useState(39);
  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  //outputs
  const [theta_max, setThetaMax] = useState(0);

  const [points, setPoints] = useState([]);
  const [max_range, setMaxRange] = useState([]);

  const generate_points = () => {
    const rangle = radians(angle)
    let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
    setPoints(convert_to_points(gen_points(50, {x:prange, y:0}, height, rangle, g, vel)))
    const mprange = vel * vel * 1/g * Math.pow(1 + (2 * g* height)/(vel * vel), 0.5);
    const mangle = Math.asin(1/Math.pow(2 + (2 * g * height)/(vel * vel), 0.5));
    setThetaMax(mangle);
    setMaxRange(convert_to_points(gen_points(50, {x:mprange, y:0}, height, mangle, g, vel)));
  }

  useEffect(() => {
    generate_points();
  }, [angle, vel, height, g])

  return(
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
                label: "θ = " + angle.toPrecision(3).toString(),
                data: points,
                borderColor: "rgb(75,192,192)",
                pointBackgroundColor: "rgb(75,192,192)",
              },
              {
                label: "θ max = " + theta_max.toPrecision(3).toString(),
                data: max_range,
                borderColor: "rgb(255,20,20)",
                pointBackgroundColor: "rgb(255,20,20)",  
              },
            ]}
            />
        </div>
      </div>
    </>
  )

}

export default Challenge4;