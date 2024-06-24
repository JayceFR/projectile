import { nav } from "../constants/navConstants";
import { NavLink } from "react-router-dom";
function Nav(){
  const MenuItem = ({curr_route}) => {
    return(
        <li><NavLink to = {curr_route.path}>{curr_route.name}</NavLink></li>
    )
  }
  return (
    <>
      <nav>
        <ul className="navbar">
          {
            nav.map((curr_route, index) => {
              return(<MenuItem key={index} curr_route={curr_route}/>)
            })
          }
        </ul>
      </nav>
    </>
  )
}

export default Nav