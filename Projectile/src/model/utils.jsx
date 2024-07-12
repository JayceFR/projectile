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

function range(vel, g, rangle, height){
  let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
  return prange
}

function delta(x){
  var pos = 0
  var rdx = []
  while (pos < x.length - 1){
    rdx.push(x[pos+1] - x[pos])
    pos += 1
  }
  return rdx;
}

function calcK(cd, rho, area, m){
  return 0.5 * cd * rho * area / m;
}

export {ux, uy, radians, convert_to_points, gen_points, discriminant, range, delta, calcK}

