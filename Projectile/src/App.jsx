import Challenge1 from "./physics/challenge1"
import { Route, Routes } from 'react-router-dom'
import { nav } from "./constants/navConstants"


const App = () =>{
  return (
    <Routes>
      {
        nav.map((curr_route, index) => {
          return <Route key={index} path={curr_route.path} element={curr_route.element}/>
        })
      }
    </Routes>
  )
}
export default App