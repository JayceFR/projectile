varying vec2 uvs;
varying vec3 normals;
void main(){
  normals = normalize(normalMatrix * normal);
  uvs = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}