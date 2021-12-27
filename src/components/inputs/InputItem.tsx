import React from "react";

import FAComponent from "../FAComponent";
import {formatSize} from "../../js/helpers"
import {OutputFile} from "../../js/convert"

interface props {
  file: File;
  onCloseClick: (name:string)=>void
}

const InputItem = ({file, onCloseClick}:props) => {
  return (
    <div className="inputItem item">
      <div className="inputLabel">
        <div className="text">{file.name}</div>
        <div className="footer">
          <div className="size">{formatSize(file.size)}</div>
          <div className="ext">{`.${file.name.split(".").pop()}`}</div>
        </div>
      </div>
      <FAComponent className="closeIcon icon" icon="fas fa-times" onClick={()=>onCloseClick(file.name)}/>
    </div>
  );
};

export default InputItem;
