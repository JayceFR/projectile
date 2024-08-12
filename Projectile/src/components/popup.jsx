import { useState } from "react";
import Code from "./code";

function Popup(props){
    return(
      <>
        <div className="popup">
          <div className="popup-inner">
            <button className="close-btn" onClick={props.del}>✘</button>
            <h3>Explanation</h3>
            <p>Hello world</p>
            <Code/>
          </div>
        </div>
      </>
    )
  }

export default Popup;