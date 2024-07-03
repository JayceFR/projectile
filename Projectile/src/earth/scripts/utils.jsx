import { radians } from "../../model/utils";

import * as THREE from 'three'

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

function convert_to_lat_long(x, y, z){
  const R = 5
  const lat = Math.asin(y/R) * (180 / Math.PI)
  const long = -1 * Math.atan2(z,x) * (180 / Math.PI)
  return [lat, long]
}

function createCycloid(startPoint, endPoint, peak, divisions, cycles) {

  let division = divisions || 100;
  let cycle = cycles || 1;

  let points = [];

  let radius = startPoint.length();
  let angle = startPoint.angleTo(endPoint);

  let arcLength = radius * angle;
  let diameterMinor = arcLength / Math.PI;
  let radiusMinor = (diameterMinor * 0.5) / cycle;

  let peakRatio = peak / diameterMinor;

  let radiusMajor = startPoint.length() + radiusMinor;
  let basisMajor = new THREE.Vector3().copy(startPoint).setLength(radiusMajor);

  let basisMinor = new THREE.Vector3().copy(startPoint).negate().setLength(radiusMinor);


  // triangle (start, end, center)
  let tri = new THREE.Triangle(startPoint, endPoint, new THREE.Vector3());
  let nrm = new THREE.Vector3(); // normal
  tri.getNormal(nrm);

  // rotate startPoint around normal
  let angleStep = angle / division;
  let v3Major = new THREE.Vector3();
  let v3Minor = new THREE.Vector3();
  let v3Inter = new THREE.Vector3();
  for (let i = 0; i <= division; i++) {
    let divisionRatio = i / division;
    let angleValue = angle * divisionRatio;
    v3Major.copy(basisMajor).applyAxisAngle(nrm, angleValue);
    v3Minor.copy(basisMinor).applyAxisAngle(nrm, angleValue + Math.PI * 2 * divisionRatio * cycle);

    v3Inter.addVectors(v3Major, v3Minor);
    let newLength = ((v3Inter.length() - radius) * peakRatio) + radius;

    points.push(new THREE.Vector3().copy(v3Inter).setLength(newLength));
  }

  return points;

}


export {calculatePointOnSphere, plot_lat_long, createCycloid, convert_to_lat_long}