import { convert_to_points, discriminant, gen_points } from "../physics/utils";


function minu(g, target_y, target_x, num_of_points){
  const minvel = Math.pow(g, 0.5) * Math.pow(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), 0.5);
  const points_angle = Math.atan2(target_y + Math.pow(target_x * target_x + target_y * target_y, 0.5), target_x);
  const points = convert_to_points(gen_points(num_of_points, {x:target_x, y:target_y}, 0, points_angle, g, minvel))
  return [minvel, points_angle, points];
}

function low_ball(target_x, target_y, vel, g){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const low_theta = Math.atan2(-b - Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  const points = convert_to_points(gen_points(50, {x:target_x, y:target_y}, 0, low_theta, g, vel))
  return [low_theta, points];
}

function high_ball(target_x, target_y, vel, g){
  const [a, b, c] = discriminant(target_x, target_y, vel, g);
  const high_theta = Math.atan2(-b + Math.pow(b * b - 4 * a * c, 0.5), 2 * a);
  const points = convert_to_points(gen_points(50, {x:target_x, y:target_y}, 0, high_theta, g, vel))
  return [high_theta, points];
}

export {minu, low_ball, high_ball}

