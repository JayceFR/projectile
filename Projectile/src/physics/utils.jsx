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

export {ux, uy, radians, convert_to_points}

