function ux(u, theta){
  return Math.cos(Math.PI * theta/180) * u
}

function uy(u, theta){
  return Math.sin(Math.PI * theta/180) * u
}

function radians(angle){
  return Math.PI * angle/180;
}

function convert_to_points(points){
  var datapoints = points.x.map((x, index)=> ({x, y: points.y[index]}))
  return datapoints
}

function gen_points(num_of_points, final_point, height, rangle, g, vel ){
  let ppoints = {x: [], y: []}
  for(let x = 0; x < num_of_points; x++){
    var curr_x = 0 + x * final_point.x/50;
    ppoints.x.push(curr_x);
    ppoints.y.push(height + curr_x * Math.tan(rangle) - g * (1 + Math.pow(Math.tan(rangle), 2)) * curr_x * curr_x * 1/(2*Math.pow(vel,2)));
  }
  ppoints.x.push(final_point.x);
  ppoints.y.push(final_point.y);
  return ppoints;
}

function discriminant(target_x, target_y, vel, g){
  const a = g * target_x * target_x / (2 * vel * vel)
  const b = target_x * -1
  const c = target_y - 0 + (g * target_x * target_x)/(2 * vel * vel)
  return [a, b, c]
}

export {ux, uy, radians, convert_to_points, gen_points, discriminant}

