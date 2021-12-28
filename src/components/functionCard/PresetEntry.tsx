import React from "react";
import SwitchToggle from "../SwitchToggle";

const PresetEntry = ({text, onChange}:any) => {
  return (
    <div className="videoEntry entry">
      <div className="switchText">{text}</div>
      <SwitchToggle
        id={`${text}Switch`}
        onChange={(e)=>onChange(e, text)}
      />
    </div>
  );
};

export default PresetEntry;
