import React from "react";

const PresetOptionItem = ({defaultChecked, text}:any) => {
  return (
    <label className="option">
      <div className="text">{text}</div>
      <input type="radio" name="options" id="" defaultChecked={defaultChecked} />
    </label>
  );
};

export default PresetOptionItem;
