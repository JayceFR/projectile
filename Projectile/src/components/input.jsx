function Input(props){
  return (
    <>
      <p>{props.name}</p>
      <input value = {props.value} onChange={e => {props.change_method(parseInt(e.target.value))}} type="number"/>
    </>
  )
}

export default Input