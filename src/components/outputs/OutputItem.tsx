import React from "react";

import FAComponent from "../FAComponent";
import { formatSize } from "../../js/helpers";

const OutputItem = ({ file, onCloseClick }: any) => {
  return (
    <div className="inputItem item">
      <div className="inputLabel">
        <div className="text">{file.name}</div>
        <div className="footer">
          <div className="size">{formatSize(file.size)}</div>
          <div className="ext">{`.${file.name.split(".").pop()}`}</div>
        </div>
      </div>

      <a className="downIcon" download={file.name} href={file.url}>
        <FAComponent className="downIcon" icon="fas fa-caret-down" />
      </a>
      <FAComponent className="closeIcon icon" icon="fas fa-times" onClick={()=>onCloseClick(file.name)}/>
    </div>
  );
};

export default OutputItem;
