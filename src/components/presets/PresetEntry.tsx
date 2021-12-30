import React, {useEffect} from "react";
import SwitchToggle from "../SwitchToggle";

interface props {
  text:string;
  onChange: (e?:React.ChangeEvent<HTMLInputElement>)=>void;
}

const PresetEntry = ({text, onChange}:props) => {
  return (
    <div className="videoEntry entry">
      <div className="switchText">{text}</div>
      <SwitchToggle
        id={`${text}Switch`}
        onChange={onChange}
      />
    </div>
  );
};

export default PresetEntry;
