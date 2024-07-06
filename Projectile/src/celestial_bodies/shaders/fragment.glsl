uniform sampler2D globeTexture;

uniform vec3 colour;

varying vec2 uvs;
varying vec3 normals;

void main() {
  float intensity = 1.05 - dot(normals, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = colour * pow(intensity, 1.5);
  gl_FragColor = vec4( atmosphere + texture2D(globeTexture, uvs).xyz, 1.0);

}