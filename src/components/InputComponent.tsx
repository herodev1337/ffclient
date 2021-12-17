import React from "react";

type props = {
  type:string,
  base:string,
  text:string,
  multiple?:boolean,
  onChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void,
  onKeyPress?:(e: React.KeyboardEvent)=>void
}

const InputComponent = ({type, base, text, multiple, onChange, onKeyPress}:props):JSX.Element => {
  return (
    <div className={`${base}Field field`}>
      <label id={`${base}Label`} htmlFor={`${base}Input`} className="fieldLabel">
        {text}
      </label>
      <input type={type} id={`${base}Input`} multiple={multiple} className="fieldInput" onChange={onChange} onKeyPress={onKeyPress}/>
    </div>
  );
};

export default InputComponent;
