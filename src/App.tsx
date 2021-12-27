import { useEffect, useRef } from "react";
import JSZip from "jszip";

import { AppStates, AppStatesProvider } from "./js/states";
import { ConvertEngine } from "./js/convert";
import { download } from "./js/helpers";

import FAComponent from "./components/FAComponent";
import Inputs from "./components/inputs/Inputs";
import Outputs from "./components/outputs/Outputs";
import SwitchToggle from "./components/SwitchToggle";

import "./App.scss";

import bg_img from "./static/bg_layered.svg";

const App = (): JSX.Element => {
  const fileinputRef = useRef<HTMLInputElement>(null);
  const consoleInputRef = useRef<HTMLTextAreaElement>(null);
  const commandBtnRef = useRef<HTMLDivElement>(null);

  const convert = new ConvertEngine();
  const store = new AppStates(convert, consoleInputRef);

  useEffect(() => {
    // document.documentElement.style.setProperty('--bg-img', `url('${bg_img}')`);
    convert.load(() => store.setLoaded(true));
  }, []);

  const runCommand = async () => {
    const value = consoleInputRef.current?.value;
    const commandBtn = commandBtnRef.current
    if (value && commandBtn) {
      const cmd = convert.buildCmd(value);
      store.setExecuting(true)
      // console.log(cmd)
      // const cmd = ["-i", store.files[0].name, "out.avi"]
      commandBtn.classList.add("executing")
      const urls = await convert.convertFiles(cmd, store.files);
      commandBtn.classList.remove("executing")
      if (urls) store.setOutputs(urls);
    }
  };

  return store.loaded ? (
    <AppStatesProvider value={store}>
      <div className="App">
        {/* Spacer */}

        <div className="mainCardHolder">
          <div className="mainCard">
            <Inputs inputs={store.files} />

            <div
              className="uploadField field"
              onClick={() => {
                fileinputRef.current?.click();
              }}
              title="Upload video or image files."
            >
              <input
                style={{ display: "none" }}
                ref={fileinputRef}
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    console.log(e.target.files)
                    store.addFiles([...e.target.files]);
                  }
                }}
              />
              <FAComponent className="uploadIcon icon" icon="fas fa-plus" />
              <div className="uploadLabel">
                <div className="upper">Add more files</div>
                <div className="lower">{store.files.length} file(s)</div>
              </div>
            </div>

            <Outputs outputs={store.outputs} />

            <div
              className="downloadField field"
              onClick={() => {
                if (!store.outputs.length) return;
                let zip = new JSZip();
                for (let i = 0; i < store.outputs.length; i++) {
                  const output = store.outputs[i];
                  zip.file(output.name, output.blob);
                }

                zip.generateAsync({ type: "blob" }).then(function (blob) {
                  download(URL.createObjectURL(blob), "outputs.zip", false);
                });
              }}
              title={
                store.outputs.length
                  ? "Download all outputed files, zipped up."
                  : "No files to download."
              }
            >
              <div className="downloadLabel">
                <div className="buttonIcon">
                  {[...Array(3).keys()].map((_, i) => {
                    return (
                      <FAComponent
                        key={i}
                        className="carrot left icon"
                        icon="fas fa-caret-down"
                        // style={{animationDelay: `${(3-1)-i}00ms`}}
                        style={{ animationDelay: `${i}00ms` }}
                      />
                    );
                  })}
                </div>
                <div className="right">Download All</div>
              </div>
            </div>
          </div>
        </div>

        <div className="functionCardHolder">
          <div
            className="functionCard"
            style={{ height: store.isPresets ? "80vh" : "30vh" }}
          >
            <textarea
              title="Hold shift and enter to execute current command."
              ref={consoleInputRef}
              id="consoleInput"
              spellCheck={false}
              // type="text"
              // value={store.currentCommand}
              onKeyUp={async (e) => {
                store.setCurrentCommand(e.currentTarget.value);
                if (e.key === "Enter" && e.shiftKey && store.files) {
                  e.currentTarget.blur();
                  runCommand();
                }
              }}
            />

            <div className="footer">
            
              <div className="fieldOptions">
                <div className="switchText">Presets</div>
                <SwitchToggle
                  id="PresetToggle"
                  onChange={(e) => {
                    const checked = e?.currentTarget.checked;
                    if (checked !== undefined) store.setPresets(checked);
                  }}
                />
              </div>

              <div
                className="command"
                ref={commandBtnRef}
                title="Execute the current command."
                onClick={() => {
                  runCommand();
                }}
              >
                <div className="buttonText">Run Command</div>
                <div
                  className="buttonIcon"
                  style={{ transform: store.isExecuting ? "" : "rotate(90deg)" }}
                >
                  
                  {store.isExecuting ? 
                  // <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  <div className="ringLoader"></div>
                  :
                  [...Array(3).keys()].map((_, i) => {
                    return (
                      <FAComponent
                        key={i}
                        className="carrot left icon"
                        icon="fas fa-angle-left"
                        style={{ animationDelay: `${i}00ms` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {store.isPresets && (
              <div className="presetsField">
                <div className="presetsHolder">
                  <div className="videoField">
                    <div className="switchText">Videofiles</div>
                    <div className="videoEntry entry">
                      <div className="switchText">AVI</div>
                      <SwitchToggle
                        // id="PresetToggle"
                        onChange={(e) => {
                          const ext = ".avi"
                          let cmd = "";
                          if (store.files){
                            for (let i = 0; i < store.files.length; i++){
                            // for (let file of store.files){
                              const file = store.files[i]
                              const tmp = file.name.split(".")
                              const name = tmp.slice(0, tmp.length-1).join("")
                              
                              const escapeSpace = file.name.includes(" ")
                              const filename = escapeSpace ? `"${file.name}"` : file.name
                              const outname = escapeSpace ? `"${name + ext}"` : name + ext
                              const insert = ` -map ${i} `
                              cmd = cmd + `-i ${filename}${store.files.length > 1 ? insert : " "}${outname} \n`
                            }
                          }

                          const newCmd = cmd ? cmd : `-i %filename% %outputname${ext}%`
                          const checked = e?.currentTarget?.checked;
                          const actualCmd = checked ? newCmd : "";
                          store.setCurrentCommand(actualCmd);
                        }}
                      />
                    </div>
                  </div>

                  <div className="imageField">
                    <div className="switchText">Imagefiles</div>
                    <div className="imageEntry entry">
                      <div className="switchText">JPG</div>
                      <SwitchToggle
                        // id="PresetToggle"
                        onChange={() => {
                          // store.setPresets(!store.isPresets)
                          console.log("To JPG");
                        }}
                      />
                    </div>
                  </div>

                  <div className="audioField">
                    <div className="switchText">Audiofiles</div>
                    <div className="audioEntry entry">
                      <div className="switchText">MP3</div>
                      <SwitchToggle
                        // id="PresetToggle"
                        onChange={() =>
                          // store.setPresets(!store.isPresets)
                          console.log("To MP3")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
      </div>
    </AppStatesProvider>
  ) : (
    <p>Loading...</p>
  );
};

export default App;
