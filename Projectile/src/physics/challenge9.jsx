import { useState, useEffect } from "react";
import { convert_to_points, gen_points, radians } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";

//const [colors, setColors] = useState(["(63,72,204)", "(34, 177, 76)", "(237, 28, 36)"])
//const [Model, setModel] = useState(["Air Resistance Model","No-air Resistance Model"]);

function Challenge9(props){
  const [angle, setAngle2] = useState(45);
  const [vel, setVel2] = useState(20);
  const [height, setHeight2] = useState(2);
  const [g, setg2] = useState(9.8);
  //extra inputs
  const [Dc,setDc2]=useState(0.47);
  const [Ad,setAd2]=useState(1);
  const[mass,setMass2]=useState(1);
  const[crossSecA,setCrossSecA2]=useState(1);
  
  const [time_step, set_time_step] = useState(0.02);
// generating value for K (with inputs) with associated acceleration equations
  const k= (0.5*Ad*Dc*crossSecA)/mass;
  const [Ay,setAy2]= useState((uy(vel,angle)/vel)*k*vel*vel);
  const [Ax,setAx2]= useState((ux(vel,angle)/vel)*k*vel*vel);


	const [points, setPoints] = useState([]);
// use of a the model without air resistance as comparison
  const generate_points = () => {
   let time = 0;
    let y = height + uy(vel, angle) - 0.5 * g * time * time;
    let x = 0;
    let ppoints = {x:[], y:[]};
    while (y > -10){
      y = height + uy(vel, angle) * time - 0.5 * g * time * time;
      x = ux(vel, angle) * time;
			setAy2((uy(vel,angle)/vel)*k*vel*vel) //updating Ay
			setAx2((ux(vel,angle)/vel)*k*vel*vel) //updating Ax
      ppoints.x.push(x); 
      ppoints.y.push(y);
      time += time_step;
    }

  const [points, setPoints] = useState({});}

  const generate_points_Res = () => {
    let time = 0;
    let y = height + uy(vel, angle) - 0.5 * g * time * time;
    let x = 0;
    let ppoints = {x:[], y:[]};
    while (y > -10){
      y = height + uy(vel, angle) * time - 0.5 * (g + Ay) * time * time; //including Ay
      x = ux(vel, angle) * time - 0.5 * Ax * time * time ; // including Ax
			
      ppoints.x.push(x);
      ppoints.y.push(y);
      time += time_step;
    }
    setPoints(convert_to_points(ppoints))
  }

  useEffect(() => {
    // console.log(typeof(height));
    generate_points();
  }, [angle, vel, height, g])
//gen_dataset.push({
//        label: "θ = " + angles[index].toString(),
//        data: convert_to_points(ppoints),
//       borderColor: "rgb"+colors[index],
//       pointBackgroundColor: "rgb"+colors[index],  
//       pointRadius: 0,
  console.log("points",points)
  return (
    <>
      <div className="controls">
        <Input name={"launch angle"} unit={"deg"} value={angle} change_method={setAngle2} type={'float'}/>
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel2} type={'float'}/>
        <Input name={"launch height"} unit={"m"} value={height} change_method={setHeight2} type={'float'}/>
				
        <Input name={"Weight"} unit={"kg"} value={mass} change_method={setMass2} type={'float'}/>
        <Input name={"Drag Coefficient"} value={Dc} change_method={setDc2} type={'float'}/>
        <Input name={"Air Density"} value={Ad} change_method={setAd2} tpye={'float'}/>
        <Input name={"Cross Sectional Area"} value={crossSecA} change_method={setCrossSecA2} type={'float'}/>
				
      </div>
      <div className="canvas">
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {[
            
              {
                label: "Comparing models with/without Air Resistance",
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

export default Challenge9;
