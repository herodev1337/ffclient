import React from "react";

import FAComponent from "../FAComponent";
import { formatSize } from "../../js/helpers";
import { FFFile } from "../../types";

interface props {
  file: FFFile;
  isSelected:boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  onCloseClick: (n: string) => void;
}

const InputItem = ({ file, isSelected, onClick, onCloseClick }: props) => {
  return (
    <div className={`inputItem item ${isSelected ? "selected": ""}`}>
      <div className="inputLabel" onClick={onClick}>
        <div className="text" title={file.name}>
          {file.name}
        </div>
        <div className="footer">
          <div className="size">{formatSize(file.size)}</div>
          <div className="ext">{`.${file.name.split(".").pop()}`}</div>
        </div>
      </div>

      <a className="downIcon" title={`Download ${file.name}`} download={file.name} href={file.url}>
        <FAComponent className="downIcon" icon="fas fa-caret-down" />
      </a>
      <FAComponent
        className="closeIcon icon"
        icon="fas fa-times"
        onClick={() => onCloseClick(file.name)}
      />
    </div>
  );
};

export default InputItem;
