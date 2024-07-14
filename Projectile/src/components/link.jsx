import React from 'react';
import { useLocation } from 'react-router-dom';

const CustomNavLink = ({ to, exact, activeClassName, children, ...props }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === "Projectile/"+to : "Projectile/"+location.pathname.startsWith(to);

  const handleClick = (event) => {
    event.preventDefault();
    window.location.href = to;
  };

  const className = isActive ? [props.className, activeClassName].filter(Boolean).join(' ') : props.className;

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default CustomNavLink;
