import React from "react";

import InputItem from "./InputItem";
import { useAppStates } from "../../js/states";

interface props {
  inputs: File[];
}

const Inputs = ({ inputs }: props) => {
  const store = useAppStates();

  return (
    <div className="inputs">
      {store.files.map((file: File, i: number) => {
        return (
          <InputItem
            key={i}
            file={file}
            onCloseClick={(n) => {
              const filtered = store.files.filter((out) => out.name !== n);
              store.setFiles(filtered);
            }}
          />
        );
      })}
    </div>
  );
};

export default Inputs;
