varying vec3 normals;

uniform vec3 colour;
uniform float strength; 

void main(){
  float intensity = pow(strength - dot(normals, vec3(0.0,0.0,1.0)), 2.0);
  gl_FragColor = vec4(colour, 1.0) * intensity ;
}