import { useEffect, useState } from "react";
import { convert_to_points, gen_points, radians } from "../model/utils";
import Input from "../components/input";
import Graph from "../components/graph";

function Challenge7(){
  const [angles, setAngles] = useState([30, 45, 60, 70.5, 78, 85]);
  const [vel, setVel] = useState(10);
  const [g, setG] = useState(10);

  const [colors, setColors] = useState(["(63,72,204)", "(34, 177, 76)", "(237, 28, 36)", "(153, 217, 234)", "(163, 73, 164)", "(255, 201, 14)"])
  const [points, setPoints] = useState([]);

  const [dataset, setDataSet] = useState([]);

  const generate_points = () => {
    const max_min_t = (u, g, theta) => {
      const b = Math.pow(Math.sin(theta), 2) - 8/9 ;
      const return_points = []
      if (b >= 0){
        const max_t = 3 * u * (Math.sin(theta) + Math.pow(b, 0.5)) / (2 * g);
        const min_t = 3 * u * (Math.sin(theta) - Math.pow(b, 0.5)) / (2 * g);
        if (max_t <= 2.5 && max_t >= 0){
          return_points.push([max_t, "max"]);
        }
        if (min_t <= 2.5 && min_t >= 0){
          return_points.push([min_t, "min"]);
        }
      }
      return return_points;
    } 
    let gen_dataset = [];
    for (let index = 0; index < angles.length; index ++){
      const curr_rangle = radians(angles[index]);
      let ppoints = {x: [], y:[]}
      for (let t = 0; t < 50; t++){
        var curr_t = 0 + t * 2.5/50;
        ppoints.x.push(curr_t)
        ppoints.y.push(Math.sqrt(vel * vel * curr_t * curr_t - g * Math.pow(curr_t, 3) * vel * Math.sin(curr_rangle) + Math.pow(g,2) * Math.pow(curr_t, 4) / 4))
      }
      gen_dataset.push({
        label: "θ = " + angles[index].toString(),
        data: convert_to_points(ppoints),
        borderColor: "rgb"+colors[index],
        pointBackgroundColor: "rgb"+colors[index],  
        pointRadius: 0,
      });
      const max_min_time_vals = max_min_t(vel, g, curr_rangle);
      for (let pos = 0; pos < max_min_time_vals.length; pos ++){
        var curr_t = max_min_time_vals[pos][0];
        var pcolor = "rgb(0,0,0)"
        if (max_min_time_vals[pos][1] == "max"){
          pcolor = "rgb(255, 0, 0)"
        }
        gen_dataset.push({
          data: [{x: curr_t, y: Math.sqrt(vel * vel * curr_t * curr_t - g * Math.pow(curr_t, 3) * vel * Math.sin(curr_rangle) + Math.pow(g,2) * Math.pow(curr_t, 4) / 4) }],
          pointRadius: 10,
          pointBackgroundColor: pcolor,
          borderColor: pcolor,
          pointStyle: 'star'
        });
      }
    }
    setDataSet(gen_dataset);
    console.log(gen_dataset);
  }
  useEffect(() => {
    generate_points();
  }, [vel, g]);

  return (
    <>
      <div className="controls">
        <Input name={"launch speed"} unit={"ms^-1"} value={vel} change_method={setVel} type={'float'}/>
        <Input name={"g"} value={g} unit={"ms^-2"} change_method={setG} type = {'float'}/>
      </div>
      <div className="canvas">
        <div className="graph">
          <Graph 
            xtext = {"x/m"} 
            ytext = {"y/m"} 
            dataset = {dataset}
            />
        </div>
      </div>
    </>
  )
}

export default Challenge7