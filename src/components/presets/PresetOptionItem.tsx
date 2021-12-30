import React from "react";

interface props {
  defaultChecked: boolean;
  text:string;
}

const PresetOptionItem = ({defaultChecked, text}:props) => {
  return (
    <label className="option">
      <div className="text">{text}</div>
      <input type="radio" name="options" id="" defaultChecked={defaultChecked} />
    </label>
  );
};

export default PresetOptionItem;
