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
  },
  {
    "explanation": "This challenge builds up on the fundamentals of the previous challenges. The min_u, low_ball, high_ball and max_r functions defined before are called. A new function is defined to plot the bounding parabola. This function is quite similar to that of challenge 2 but the max range computed in the max_r function is used instead.",
    "code": [`const generate_points = () => {
  //min u 
  const [minvel, points_angle, ppoints] = minu(g, target_y, target_x, 50, {x:null, y:0});
  setPoints(ppoints);
  setMinLaunchVel(minvel);
  setMinVelAngle(points_angle);
  //low ball
  const [low_theta, pplowpoints] = low_ball(target_x, target_y, vel, g, {x:null, y:0});
  setLowBallPoints(pplowpoints);
  setLowAngle(low_theta);
  //high ball
  const [high_theta, pphighpoints] = high_ball(target_x, target_y, vel, g, {x:null, y:0});
  setHighBallPoints(pphighpoints);
  sethighangle(high_theta);
  //range
  const [mprange,,max_r_point] = max_r(g, 0, vel)
  setMaxRPoints(max_r_point) 
  //bounding parabola
  const bpoints = convert_to_points(bounding_parabola(50, {x:mprange, y:0}, g, vel))
  setBoundingPoints(bpoints);
  console.log("bounding points", bpoints)
}`, `function bounding_parabola(num_of_points, final_point,g, vel ){
  let ppoints = {x: [], y: []}
  for(let x = 0; x < num_of_points; x++){
    var curr_x = 0 + x * final_point.x/50;
    ppoints.x.push(curr_x);
    ppoints.y.push((vel * vel)/(2*g) - (g*curr_x*curr_x)/(2 * vel * vel));
  }
  ppoints.x.push(final_point.x);
  ppoints.y.push(final_point.y);
  return ppoints;
}`]
  },
  {
    "explanation": "This is quite an interesting challenge which mainly involved in developing our own implementation of the diff function available in matlab. The graphs were plotted using the gen points and the max_r functions defined before. For computing the distance travelled a new list was created to hold the difference of consecutive values in the original list. Finally the sum of the product is computed and displayed on the screen.",
    "code" : [`const generate_points = () => {
  const rangle = radians(angle)
  let prange = vel * vel * 1/g * (Math.sin(rangle) * Math.cos(rangle) + Math.cos(rangle) * Math.pow(Math.pow(Math.sin(rangle), 2) + (2*g*height/Math.pow(vel, 2)), 0.5));
  const ppoints = gen_points(50, {x:prange, y:0}, height, rangle, g, vel)
  setS(distance_travelled_i(delta(ppoints.x), delta(ppoints.y)))
  setPoints(convert_to_points(ppoints))
  const [ , mangle, points, ppoints2] = max_r(g, height, vel);
  setMaxS(distance_travelled_i(delta(ppoints2.x), delta(ppoints2.y)))
  setThetaMax(mangle);
  setMaxRange(points);
}`, `function delta(x){
  var pos = 0
  var rdx = []
  while (pos < x.length - 1){
    rdx.push(x[pos+1] - x[pos])
    pos += 1
  }
  return rdx;
}`, `function distance_travelled_i(dx, dy){
  let s = 0;
  for (let x = 0; x < dx.length; x++){
    s += Math.sqrt(dx[x] * dx[x] + dy[x] * dy[x]);
  }
  return s
}`]
  }

]