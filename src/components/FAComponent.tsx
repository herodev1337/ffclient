import React from "react";

interface props {
  className: string;
  icon: string;
  onClick?: (e:React.MouseEvent<HTMLElement>) => void;
  style?:{};
}

const FAComponent = ({ className, icon, onClick , style}:props) => {
  return (
    <div className={`${className} faicon`} onClick={onClick} style={style}>
      <i className={icon}></i>
    </div>
  );
};

export default FAComponent;
