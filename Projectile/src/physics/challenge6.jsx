import { useEffect, useState } from "react";
import { convert_to_points, delta, gen_points, radians } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";
import { distance_travelled_i, max_r } from "../model/projectile";
import Popup from "../components/popup";

function Challenge6(props){
  const [angle, setAngle2] = useState(36);
  const [vel, setVel2] = useState(39);
  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);

  //outputs
  const [theta_max, setThetaMax] = useState(0);
  const [s, setS] = useState(0);
  const [max_s, setMaxS] = useState(0);

  const [points, setPoints] = useState([]);
  const [max_range, setMaxRange] = useState([]);

  const [show, setShow] = useState(false);
  const del_popup = () => {
    setShow(false);
  }

  const generate_points = () => {
    const rangle = radians(angle)
    let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
    const ppoints = gen_points(50, {x:prange, y:0}, height, rangle, g, vel)
    setS(distance_travelled_i(delta(ppoints.x), delta(ppoints.y)))
    setPoints(convert_to_points(ppoints))
    const [ , mangle, points, ppoints2] = max_r(g, height, vel);
    setMaxS(distance_travelled_i(delta(ppoints2.x), delta(ppoints2.y)))
    setThetaMax(mangle);
    setMaxRange(points);
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
      <button className="magnify" onClick={() => {setShow(true)}}>🔍</button>
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
            <div className="output">
              <p>S : {s.toPrecision(3)} m</p>
              <p>S Max : {max_s.toPrecision(4)} m</p>
            </div>
        </div>
      </div>
      {show && <Popup del={del_popup} index = {5}/>}
    </>
  )

}

export default Challenge6;