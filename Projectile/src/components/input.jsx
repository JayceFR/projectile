function Input(props){
  if(props.type == "float"){
    return (
      <>
        <p>{props.name} : {props.value} {props.unit}</p> <input className="text" value={props.value} onChange={e => {props.change_method(parseFloat(e.target.value))}} type="number"></input>
        <input className="slider"  value = {props.value} onChange={e => {props.change_method(parseFloat(e.target.value))}} type="range"/>
      </>
    )
  }
  else if (props.type == "int"){
    return (
      <>
        <p>{props.name}</p>
        <input value = {props.value} onChange={e => {props.change_method(parseInt(e.target.value))}} type="number"/>
      </>
    )
  }
  else{
    return (
      <>
        <p>{props.name}</p>
        <input value = {props.value} onChange={e => {props.change_method(e.target.value)}} type="number"/>
      </>
    )
  }
  
}

export default Input