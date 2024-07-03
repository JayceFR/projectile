import * as THREE from 'three'

export default class Globe{
  constructor(vertexShader, fragmentShader, atmosVertexShader, atmosFragmentShader, mapURL, cloudsURL){
    this.globe = new THREE.Group();
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,32,32),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new THREE.TextureLoader().load(mapURL)
          }
        }
      })
    );
    this.globe.add(this.sphere);
    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5,32,32),
      new THREE.ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    )
    this.atmosphere.scale.set(1.2, 1.2, 1.2)
    this.globe.add(this.atmosphere);

    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(5, 32, 32),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(cloudsURL),
        blending: THREE.AdditiveBlending,
      })
    )

    this.clouds.scale.setScalar(1.03);

    this.globe.add(this.clouds);
  }

  display(){
    return this.globe;
  }

  animate(){
    this.sphere.rotation.y += 0.0005;
    this.clouds.rotation.y += 0.0015;  
  }
}