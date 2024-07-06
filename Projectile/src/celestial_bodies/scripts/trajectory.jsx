import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three"
import { gen_3d_trajectory_points } from "../../model/projectile";
import { convert_to_lat_long, plot_lat_long } from "./utils";
import { radians } from "../../model/utils";

export class Trajectory{
  constructor(){
    //line
    this.line = undefined;
    this.lgeometry = undefined;
    this.lmat = new LineBasicMaterial({
      color: 0xff0000,
      linewidth: 20
    });
    //point
    this.point = new Mesh(
      new SphereGeometry(0.1, 16, 16),
      new MeshBasicMaterial({
        color:0xff0000,
      })
    )
    //trajectory
    this.path = undefined
  }

  update(angle, radius, latitude, longitude, v0, GM){
    //point 
    const launch_angle = radians(angle);
    const pointPosition = plot_lat_long(radius + 0.2, latitude, longitude)
    const vec_pos = new Vector3(pointPosition.x, pointPosition.y, pointPosition.z);
    this.point.position.copy(vec_pos);
    //line
    var [ppoints, end_pos] = gen_3d_trajectory_points(launch_angle, v0, latitude, vec_pos, pointPosition, GM)
    this.path = new CatmullRomCurve3(ppoints);
    this.lgeometry = new BufferGeometry().setFromPoints(this.path.getPoints(50));
    this.line = new Line(this.lgeometry, this.lmat);
    //Land Lat and Long
    const [llat, llong] = convert_to_lat_long(end_pos.x, end_pos.y, end_pos.z)
    return [llat, llong]
  }

  animate(time){
    const t = (time / 1000 % 6) / 6;
    try{
      const position = this.path.getPointAt(t);
      this.point.position.copy(position)
    }
    catch (err){
      console.log(err);
    }
  }

  get_point(){
    return this.point;
  }

  get_line(){
    return this.line;
  }

}