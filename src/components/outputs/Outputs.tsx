import React from "react";

import OutputItem from "./OutputItem";
import { useAppStates } from "../../js/states";

const Outputs = ({ outputs }: any) => {
  const store = useAppStates();

  return (
    <div className="outputs">
      {store.outputs.map((file: any, i: number) => {
        return (
          <OutputItem
            key={i}
            file={file}
            onCloseClick={(n:string) => {
              const filtered = store.outputs.filter((out) => out.name !== n);
              store.setOutputs(filtered);
            }}
          />
        );
      })}
    </div>
  );
};

export default Outputs;
