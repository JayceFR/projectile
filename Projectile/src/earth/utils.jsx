import { radians } from "../model/utils";

function calculatePointOnSphere(radius, theta, phi) {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return {x:x, y:y, z:z};
}

function make_points(x,y,z){
  return {x:x, y:y, z:z};
}


function plot_lat_long(radius, latitude, longitude){

  let lat = latitude * (Math.PI/180)
  let lon = -longitude * (Math.PI/180)

  let x = Math.cos(lat) * Math.cos(lon) * radius;
  let y = Math.sin(lat) * radius;
  let z = Math.cos(lat) * Math.sin(lon) * radius;


  return make_points(x,y,z);

}


export {calculatePointOnSphere, plot_lat_long}