import Earth from "../celestial_bodies/earth";
import Mars from "../celestial_bodies/marjs";
import Moon from "../celestial_bodies/moon";
import Challenge1 from "../physics/challenge1";
import Challenge2 from "../physics/challenge2";
import Challenge3 from "../physics/challenge3";
import Challenge4 from "../physics/challenge4";
import Challenge5 from "../physics/challenge5";
import Challenge6 from "../physics/challenge6";
import Challenge7 from "../physics/challenge7";

export const nav = [
  {path: "/", name:"Challenge1", element:<Challenge1/>},
  {path: "/2", name:"Challenge2", element:<Challenge2/>},
  {path: "/3", name:"Challenge3", element:<Challenge3/>},
  {path: "/4", name:"Challenge4", element:<Challenge4/>},
  {path: "/5", name:"Challenge5", element:<Challenge5/>},
  {path: "/6", name:"Challenge6", element:<Challenge6/>},
  {path: "/7", name:"Challenge7", element:<Challenge7/>},
  {path: "/earth", name: "Earth", element:<Earth/>},
  {path: "/mars", name: "Mars", element:<Mars/>},
  {path: "/moon", name: "Moon", element:<Moon/>},
]