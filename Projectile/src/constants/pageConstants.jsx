export const challenges = [
  {
    "explanation": "This is a basic implementation of a simple drag free projectile model. A conditional loop is used to generate the points while y is strictly greater than 10. A time step of 0.02 is used. There would be apporximately 500 points generated (truly inefficient). A simple utility function is used to structure the points which can be plotted by chartjs.",
    "code": `const generate_points = () => {
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

function convert_to_points(points){
  var datapoints = points.x.map((x, index)=> ({x, y: points.y[index]}))
  return datapoints
}
`
  }
]