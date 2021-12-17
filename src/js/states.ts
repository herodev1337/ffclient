import React, { useState } from "react";
import {OutputFile} from "./convert"

class AppStates {
    loaded:boolean
    setLoaded:(v:boolean) => void

    files:FileList | undefined
    setFiles:(v:FileList) => void

    outputs:OutputFile[] | undefined
    setOutputs:(v:OutputFile[]) => void

  constructor() {
    [this.loaded, this.setLoaded] = useState<boolean>(false);
    [this.files, this.setFiles] = useState<FileList>();
    [this.outputs, this.setOutputs] = useState<OutputFile[]>();
  }
}

export default AppStates
