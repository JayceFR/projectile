function ux(u, theta){
  return Math.cos(Math.PI * theta/180) * u
}

function uy(u, theta){
  return Math.sin(Math.PI * theta/180) * u
}

export {ux, uy}

