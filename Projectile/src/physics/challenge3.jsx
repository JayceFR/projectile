import { useEffect, useState } from "react";
import Input from "../components/input";
import Graph from "../components/graph";
import { minu, low_ball, high_ball } from "../model/projectile";
import Popup from "../components/popup";

function Challenge3(props){
  //inputs
  const [target_x, setTargetx] = useState(1000);
  const [target_y, setTargety] = useState(300);
  const [g, setG] = useState(9.8);
  const [vel, setVel] = useState(150);

  //outputs
  const [minlauncvel, setMinLaunchVel] = useState(0);
  const [lowangle, setLowAngle] = useState(0);
  const [highangle, sethighangle] = useState(0);
  const [minvelangle, setMinVelAngle] = useState(0);

  //graphs
  const [high_ball_points, setHighBallPoints] = useState([]);
  const [low_ball_points, setLowBallPoints] = useState([]);
  const [points, setPoints] = useState([]);

  const [show, setShow] = useState(false);
  const del_popup = () => {
    setShow(false);
  }

const generate_points = () => {
  //min u 
  const [minvel, points_angle, ppoints] = minu(g, target_y, target_x, 50, {x:target_x, y:target_y});
  setPoints(ppoints);
  setMinLaunchVel(minvel);
  //low ball
  const [low_theta, pplowpoints] = low_ball(target_x, target_y, vel, g, {x:target_x, y:target_y});
  //high ball
  const [high_theta, pphighpoints] = high_ball(target_x, target_y, vel, g, {x: target_x, y: target_y});
  setHighBallPoints(pphighpoints);
  setLowBallPoints(pplowpoints);
  setLowAngle(low_theta);
  sethighangle(high_theta);
  setMinVelAngle(points_angle);
}

  useEffect(() => {
    generate_points();
  }, [target_x, target_y, g, vel])

  return (
    <>
      <div className="controls">
        <Input name={"Target X"} unit={"m"} value={target_x} change_method={setTargetx} type={'float'}/>
        <Input name={"Target Y"} unit={"m"} value={target_y} change_method={setTargety} type={'float'}/>
        <Input name={"vel"} unit={"ms^-1"} value={vel} change_method={setVel} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setG} type = {'float'}/>
      </div>
      <div className="canvas">
      <button className="magnify" onClick={() => {setShow(true)}}>🔍</button>
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {[
              {
                label: "target", 
                data: [{x:target_x, y:target_y}],
                pointRadius: 10,
                pointBackgroundColor: "rgb(255,0,0)",
                borderColor: "rgb(255,0,0)",
                pointStyle: 'rectRot'
              },
              {
                label: "min u",
                data: points,
                borderColor: "rgb(228,110,231)",
              },
              {
                label: "high ball",
                data: high_ball_points,
                borderColor: "rgb(20,20,120)"
              },
              {
                label: "low ball",
                data: low_ball_points,
                borderColor: "rgb(20,120,20)"
              }
            ]}
            />
            <div className="output">
              <p>Minimum Launch Speed : {minlauncvel.toPrecision(3)} ms^-1</p>
              <p>Minimum Launce Angle : {minvelangle.toPrecision(3)} rad</p>
              <p>High Ball Angle : {highangle.toPrecision(3)} rad</p>
              <p>Low Ball Angle  : {lowangle.toPrecision(3)} rad</p>

              <p></p>
            </div>
        </div>
      </div>
      {show && <Popup del={del_popup} index = {2}/>}
    </>
  )
}

export default Challenge3