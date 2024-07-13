import { Vector3 } from "three";
import { convert_to_points, discriminant, gen_points, radians, range, ux, uy } from "./utils";
import { createCycloid } from "../celestial_bodies/scripts/utils";

//function to generate points upto a given y value
function gen_points_upto(final_y, vel, angle, time_step, height, g){
  let time = 0;
  let y = height + uy(vel, angle) - 0.5 * g * time * time;
  let x = 0;
  let ppoints = {x:[], y:[]};
  while (y > final_y){
    y = height + uy(vel, angle) * time - 0.5 * g * time * time;
    x = ux(vel, angle) * time;
    ppoints.x.push(x);
    ppoints.y.push(y);
    time += time_step;
  }
  return ppoints;
}

function minu(g, target_y, target_x, num_of_points, finish){
  const minvel = Math.pow(g, 0.5) * Math.pow(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), 0.5);
  const points_angle = Math.atan2(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), target_x);
  if (finish.x == null){
    finish.x = range(minvel, g, points_angle, 0);
  }
  const points = convert_to_points(gen_points(num_of_points, {x:finish.x, y:finish.y}, 0, points_angle, g, minvel))
  return [minvel, points_angle, points];
}

function low_ball(target_x, target_y, vel, g, finish){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const low_theta = Math.atan2(-b - Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  if (finish.x == null){
    finish.x = range(vel, g, low_theta, 0);
  }
  const points = convert_to_points(gen_points(50, {x:finish.x, y:finish.y}, 0, low_theta, g, vel))
  return [low_theta, points];
}

function high_ball(target_x, target_y, vel, g, finish){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const high_theta = Math.atan2(-b + Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  if (finish.x == null){
    finish.x = range(vel, g, high_theta, 0);
  }
  const points = convert_to_points(gen_points(50, {x:finish.x, y:finish.y}, 0, high_theta, g, vel))
  return [high_theta, points];
}

function max_r(g, height, vel){
  const mprange = vel * vel * 1/g * Math.pow(1 + (2 * g* height)/(vel * vel), 0.5);
  const mangle = Math.asin(1/Math.pow(2 + (2 * g * height)/(vel * vel), 0.5));
  const ppoints = gen_points(50, {x:mprange, y:0}, height, mangle, g, vel)
  const points = convert_to_points(ppoints)
  return [mprange, mangle, points, ppoints];
}

function bounding_parabola(num_of_points, final_point,g, vel ){
  let ppoints = {x: [], y: []}
  for(let x = 0; x < num_of_points; x++){
    var curr_x = 0 + x * final_point.x/50;
    ppoints.x.push(curr_x);
    ppoints.y.push((vel * vel)/(2*g) - (g*curr_x*curr_x)/(2 * vel * vel));
  }
  ppoints.x.push(final_point.x);
  ppoints.y.push(final_point.y);
  return ppoints;
}

function distance_travelled_i(dx, dy){
  let s = 0;
  for (let x = 0; x < dx.length; x++){
    s += Math.sqrt(dx[x] * dx[x] + dy[x] * dy[x]);
  }
  return s
}

function distance_travelled(vel, g, rangle, prange){
  const z_func = (z) => {
    return 0.5 * Math.log(Math.abs(Math.sqrt(1 + z*z) + z)) + 0.5 * z * Math.sqrt(1+z*z);
  }
  a = (vel * vel) / (g * (1 + Math.pow(Math.tan(rangle), 2)));
  b = Math.tan(rangle);
  c = Math.tan(rangle) - g * prange * (1 + Math.pow(Math.tan(rangle), 2) / (vel * vel))
  return a * (z_func(b) - z_func(c));
}

function gen_points_3d(start_loc, launch_angle, azimuth_angle, v0, g, lat){
  const theta = radians(launch_angle);
  const phi = radians(azimuth_angle);
  const omega = 7.2921e-5
  const R = 6371000
  var velocity = {
    x: v0 * Math.cos(theta) * Math.cos(phi),
    y: v0 * Math.sin(theta),
    z: v0 * Math.cos(theta) * Math.sin(phi)
  }
  const acceleration = {
    x: 0,
    y: -g,
    z: 0, 
  }
  //verlet method
  function verlet(loc, velocity, acceleration, dt){
    let return_vel = {
      x: (velocity.x + acceleration.x * dt),
      y: (velocity.y + acceleration.y * dt),
      z: (velocity.z + acceleration.z * dt)
    }
    console.log(velocity.y)
    let return_loc = {
      x: (loc.x + return_vel.x * dt) * 0.01 ,
      y: (loc.y + return_vel.y * dt ) * 0.01,
      z: (loc.z + return_vel.z * dt) * 0.01,
    }
    return [return_loc, return_vel]
  }
  const time_step = 0.001
  var loc = start_loc
  let locs = [start_loc]
  for (let x = 0; x<= 500; x++){
    [loc, velocity] = verlet(loc, velocity, acceleration, time_step)
    locs.push(loc);
  }    
  console.log(locs)
  return locs
}

const gen_3d_trajectory_points = (launch_angle, v0, latitude, vec_pos, pointPosition, GM, radius ) => {
  const launch_direction = new Vector3(Math.cos(launch_angle), Math.sin(launch_angle), Math.cos(launch_angle)) 
  const initial_vel = launch_direction.multiplyScalar(v0);

  //Taking angular speed of earth into account
  initial_vel.setX(initial_vel.x += Math.cos(radians(latitude)) * 0.01)
  initial_vel.setZ(initial_vel.z += Math.cos(radians(latitude)) * 0.01)

  // console.log("initial_vel", initial_vel, Math.cos(radians(latitude)) * 0.1)

  let done = false
  const proj_pos = vec_pos.clone();
  const w = 0.0000729
  var projectiles = []

  for(let i=0; i<=40; i+=1){
    if (!done){
      initial_vel.multiplyScalar(2)
      const r = Math.sqrt(Math.pow(proj_pos.x, 2) + Math.pow(proj_pos.y, 2) + Math.pow(proj_pos.z, 2))
      const a = new Vector3(proj_pos.x / Math.pow(r,3), proj_pos.y / Math.pow(r,3), proj_pos.z / Math.pow(r,3)).normalize();
      a.multiplyScalar(-GM);
      initial_vel.add(a);
      proj_pos.add(initial_vel);
      const dist_from_centre = proj_pos.length();
      if (dist_from_centre <= radius){
        proj_pos.setLength(radius + 0.2)
        done = true
      }
      projectiles.push(proj_pos)
    } 
  }
  const end_pos = projectiles[projectiles.length - 1].clone()
  const mid = new Vector3().addVectors(pointPosition, end_pos);
  const mid_r = Math.sqrt(Math.pow(mid.x, 2) + Math.pow(mid.y, 2) + Math.pow(mid.z, 2))
  var ppoints = createCycloid(
    new Vector3(pointPosition.x, pointPosition.y, pointPosition.z),
    new Vector3(end_pos.x, end_pos.y, end_pos.z),
    mid_r/10, 
    100, 
    1
  );
  return [ppoints, end_pos];
}

function no_drag_verlet(px, py, vx, vy, ax, ay){
  var return_points = {x :[], y: [], time: [], velocity: []}
  var acceleration = [ax, ay];
  var position = [px, py];
  var veloctiy = [vx, vy]
  var t = 0;
  var dt = 0.01;
  while (position[1] >= 0){
    //add the point to the graph
    console.log("inside the while loop")
    return_points.x.push(position[0])
    return_points.y.push(position[1])  
    return_points.time.push(t)
    //update postion
    position[0] += veloctiy[0] * dt + 0.5 * acceleration[0] * dt * dt;
    position[1] += veloctiy[1] * dt + 0.5 * acceleration[1] * dt * dt;
    //update velocity
    veloctiy[0] += acceleration[0] * dt;
    veloctiy[1] += acceleration[1] * dt;
    //update time
    t = t + dt;
  } 
  return_points.x.push(position[0])
  return_points.y.push(position[1])
  return_points.velocity.push(veloctiy[0], veloctiy[1]);
  return return_points;
}

function drag_verlet(px, py, vx, vy, k, g){
  var return_points = {x :[], y: []}
  var acceleration = [0,0]
  var position = [px, py];
  var veloctiy = [vx, vy]
  var v = Math.sqrt(vx * vx + vy * vy)
  var t = 0;
  var dt = 0.05;
  while (position[1] >= 0){
    //add the point to the graph
    return_points.x.push(position[0])
    return_points.y.push(position[1])  
    //update acceleration
    acceleration[0] = -veloctiy[0] * k * v;
    acceleration[1] = -g - veloctiy[1] * k * v;
    //update postion
    position[0] += veloctiy[0] * dt + 0.5 * acceleration[0] * dt * dt;
    position[1] += veloctiy[1] * dt + 0.5 * acceleration[1] * dt * dt;
    //update velocity
    veloctiy[0] += acceleration[0] * dt;
    veloctiy[1] += acceleration[1] * dt;
    v = Math.sqrt(veloctiy[0] * veloctiy[0] + veloctiy[1] * veloctiy[1]);
    //update time
    t = t + dt;
  } 
  return_points.x.push(position[0]);
  return_points.y.push(position[1]);
  return return_points;
}

export {
  minu, 
  low_ball, 
  high_ball, 
  max_r, 
  bounding_parabola, 
  distance_travelled_i, 
  distance_travelled, 
  gen_points_3d, 
  gen_3d_trajectory_points, 
  no_drag_verlet, 
  drag_verlet, 
  gen_points_upto
}

