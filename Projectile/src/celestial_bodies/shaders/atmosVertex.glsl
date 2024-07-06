
varying vec3 normals;
void main(){
  normals = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}