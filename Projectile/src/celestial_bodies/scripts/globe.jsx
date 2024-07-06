
import { Group, Mesh, ShaderMaterial, SphereGeometry, TextureLoader, AdditiveBlending, BackSide, MeshBasicMaterial} from "three";

export default class Globe{
  constructor(vertexShader, fragmentShader, atmosVertexShader, atmosFragmentShader, mapURL, cloudsURL, colour, strength){
    this.globe = new Group(); 
    this.sphere = new Mesh(
      new SphereGeometry(5,32,32),
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          globeTexture: {
            value: new TextureLoader().load(mapURL)
          },
          colour : {value: colour}
        },
        
      })
    );
    this.globe.add(this.sphere);
    this.atmosphere = new Mesh(
      new SphereGeometry(5,32,32),
      new ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        uniforms: {
          colour: {value: colour},
          strength: {value: strength}
        },
        blending: AdditiveBlending,
        side: BackSide
      })
    )
    this.atmosphere.scale.set(1.2, 1.2, 1.2)
    this.globe.add(this.atmosphere);
    
    this.isclouds = false;

    if (cloudsURL){
      this.isclouds = true;
      this.clouds = new Mesh(
        new SphereGeometry(5, 32, 32),
        new MeshBasicMaterial({
          map: new TextureLoader().load(cloudsURL),
          blending: AdditiveBlending,
        })
      )
      this.clouds.scale.setScalar(1.03);
      this.globe.add(this.clouds);
    }
  }

  display(){
    return this.globe;
  }

  animate(){
    this.sphere.rotation.y += 0.0005;
    if (this.isclouds){
      this.clouds.rotation.y += 0.0015;  
    }
  }
}