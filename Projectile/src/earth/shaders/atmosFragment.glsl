varying vec3 normals;

void main(){
  float intensity = pow(0.6 - dot(normals, vec3(0.0,0.0,1.0)), 2.0);
  gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity ;
}