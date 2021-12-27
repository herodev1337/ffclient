import React, { useState, useContext } from "react";
import { OutputFile, ConvertEngine } from "./convert";
import {getSafeName} from "./helpers"

// * Application states

class AppStates {
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  files: File[];
  _setFiles: (v: File[]) => void;

  outputs: OutputFile[];
  _setOutputs: (v: OutputFile[]) => void;

  isPresets: boolean;
  setPresets: (v: boolean) => void;

  currentCommand: string;
  _setCurrentCommand: (v: string| ((v:string)=>string)) => void;

  isExecuting: boolean;
  setExecuting: (v: boolean) => void;  

  engine: ConvertEngine;
  consoleRef:React.RefObject<HTMLTextAreaElement>;

  constructor(engine: ConvertEngine, consoleRef:React.RefObject<HTMLTextAreaElement>) {
    [this.loaded, this.setLoaded] = useState<boolean>(false);
    [this.files, this._setFiles] = useState<File[]>([]);
    [this.outputs, this._setOutputs] = useState<OutputFile[]>([]);

    [this.isPresets, this.setPresets] = useState<boolean>(false);
    [this.currentCommand, this._setCurrentCommand] = useState("");
    [this.isExecuting, this.setExecuting] = useState<boolean>(false);

    this.engine = engine;
    this.consoleRef = consoleRef
  }

  setFiles(files: File[]) {
    const noDups = this._cleanCmd(files);
    this._setFiles(noDups);
    this.engine.evalFS([...noDups, ...this.outputs].map((f)=>f.name));
  }

  setOutputs(files: OutputFile[]) {
    this._setOutputs(files);
    this.engine.evalFS([...this.files, ...files].map((f)=>f.name))
    this.setExecuting(false)
  }

  addFiles(f: File[]) {
    this.setFiles([...this.files, ...f]);
    this.engine.importFiles(f);
  }

  setCurrentCommand(cmd:string){
    if (this.consoleRef.current){
      this._setCurrentCommand(cmd)
      this.consoleRef.current.value = cmd
    }
  }

  _cleanCmd(files: File[]) {
    const out: File[] = [];
    const seen: any = {};

    // Look for and remove duplicates
    // Go from back to get the newest upload, assuming you're finished with the older one
    for (let i = files.length - 1; i >= 0; i--) {
      const file = files[i];
      if (!seen[file.name]) {
        seen[file.name] = true;
        out.push(file);
        
        // file.name = file.name.replace(" ", "_")
      }
    }
    return out.reverse();
  }
}

// * States Context Setup

interface props {
  value: AppStates;
  children: any;
}

// const AppStatesContext = React.createContext<AppStates | typeof init>(init);
const AppStatesContext = React.createContext<AppStates>({} as AppStates);

const AppStatesProvider = ({ value, children }: props) => {
  return (
    <AppStatesContext.Provider value={value}>
      {children}
    </AppStatesContext.Provider>
  );
};

const useAppStates = () => {
  return useContext(AppStatesContext);
};

export { AppStates, AppStatesProvider, useAppStates };
