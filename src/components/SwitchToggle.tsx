import React from "react";

interface props {
    className?: string;
    onChange?:(e?:React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}

const SwitchToggle = ({className, onChange, id}:props) => {
  return (
    <div className={`switchHolder ${className}`}>
      <label className="switch">
        <input
          type="checkbox"
          id={id}
          onChange={onChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default SwitchToggle;
