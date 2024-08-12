import { useState } from "react";
import Code from "./code";
import { challenges } from "../constants/pageConstants";

function Popup(props){
    return(
      <>
        <div className="popup">
          <div className="popup-inner">
            <button className="close-btn" onClick={props.del}>✘</button>
            <h3>Explanation</h3>
            <p>{challenges[props.index].explanation}</p>
            {challenges[props.index].code.map((curr_code, index) => {
              return <Code code={curr_code}/>
            })}
          </div>
        </div>
      </>
    )
  }

export default Popup;