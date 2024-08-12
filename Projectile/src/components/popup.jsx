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
            <Code code={challenges[props.index].code}/>
          </div>
        </div>
      </>
    )
  }

export default Popup;