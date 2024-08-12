export const challenges = [
  {
    "explanation": "This is a basic implementation of a simple drag free projectile model. A conditional loop is used to generate the points while y is strictly greater than 10. A time step of 0.02 is used. There would be apporximately 500 points generated (truly inefficient). A simple utility function is used to structure the points which can be plotted by chartjs.",
    "code": [`const generate_points = () => {
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
}`,
`
function convert_to_points(points){
  var datapoints = points.x.map((x, index)=> ({x, y: points.y[index]}))
  return datapoints
}
`]
  },
  {
    "explanation" : "This is a far more efficient model which is made to use only a fix number of points. The range of the projectile is calculated and a count controlled loop is used to generate an equally spaced list of 50 points which are then stored in the object called ppoints. The function is written in the utility module to facilitate reusability.",
    "code" : [`const generate_points = () => {
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
}`,
`function gen_points(num_of_points, final_point, height, rangle, g, vel ){
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
    `]
  }, 

  {
    "explanation": "This challenge consisted of 3 different graphs. The main function calls 3 different functions which generate the respective points. Each of these individual functions calculate their respective trajectory angles and call the gen_points function which was declared in the utility module before.",
    "code": [`const generate_points = () => {
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
}`, `function minu(g, target_y, target_x, num_of_points, finish){
  const minvel = Math.pow(g, 0.5) * Math.pow(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), 0.5);
  const points_angle = Math.atan2(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), target_x);
  if (finish.x == null){
    finish.x = range(minvel, g, points_angle, 0);
  }
  const points = convert_to_points(gen_points(num_of_points, {x:finish.x, y:finish.y}, 0, points_angle, g, minvel))
  return [minvel, points_angle, points];
}`, `function low_ball(target_x, target_y, vel, g, finish){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const low_theta = Math.atan2(-b - Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  if (finish.x == null){
    finish.x = range(vel, g, low_theta, 0);
  }
  const points = convert_to_points(gen_points(50, {x:finish.x, y:finish.y}, 0, low_theta, g, vel))
  return [low_theta, points];
}`, `function high_ball(target_x, target_y, vel, g, finish){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const high_theta = Math.atan2(-b + Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  if (finish.x == null){
    finish.x = range(vel, g, high_theta, 0);
  }
  const points = convert_to_points(gen_points(50, {x:finish.x, y:finish.y}, 0, high_theta, g, vel))
  return [high_theta, points];
}`]
  }, 
  {
    "explanation": "This was quite a straightforward challenge, The first graph can be generated the same way as in challenge 2. The second graph used the same ideology but computed a different range and angle for the projectile's trajectory",
    "code" : [`const generate_points = () => {
  const rangle = radians(angle)
  let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
  setPoints(convert_to_points(gen_points(50, {x:prange, y:0}, height, rangle, g, vel)))
  const [ , mangle, points] = max_r(g, height, vel);
  setThetaMax(mangle);
  setMaxRange(points);
}`, `function max_r(g, height, vel){
  const mprange = vel * vel * 1/g * Math.pow(1 + (2 * g* height)/(vel * vel), 0.5);
  const mangle = Math.asin(1/Math.pow(2 + (2 * g * height)/(vel * vel), 0.5));
  const ppoints = gen_points(50, {x:mprange, y:0}, height, mangle, g, vel)
  const points = convert_to_points(ppoints)
  return [mprange, mangle, points, ppoints];
}`]
  }

]