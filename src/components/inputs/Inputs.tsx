import React from "react";

import InputItem from "./InputItem";
import { useAppStates } from "../../js/states";
import { FFFile } from "../../types";

const Inputs = () => {
  const store = useAppStates();

  return (
    <div className="inputs">
      {store.files.map((file: FFFile, i: number) => {
        return (
          <InputItem
            key={i}
            file={file}
            isSelected={store.selected.includes(file.name)}
            onClick={(e) => {
              if (store.selected.includes(file.name)) {
                // store.setSelected(store.selected.filter((f)=>f!==file.name))
                store.setSelected((v) => v.filter((f) => f !== file.name));
              } else {
                store.setSelected((v) => [...v, file.name]);
              }
            }}
            onCloseClick={(n: string) => {
              const filtered = store.files.filter((out) => out.name !== n);
              const filteredSel = store.selected.filter(v=>v!==n)
            
              store.setFiles(filtered);
              store.setSelected(filteredSel)
            }}
          />
        );
      })}
    </div>
  );
};

export default Inputs;
