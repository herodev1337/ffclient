import { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import JSZip from "jszip";

import { AppStates, AppStatesProvider } from "./js/states";
import { ConvertEngine } from "./js/convert";
import { download, file2FFFile } from "./js/helpers";

import FAComponent from "./components/FAComponent";
import Inputs from "./components/inputs/Inputs";
import SwitchToggle from "./components/SwitchToggle";
import Presets from "./components/presets/Presets";
import PresetOptionItem from "./components/presets/PresetOptionItem";
import PresetEntry from "./components/presets/PresetEntry";

import "./App.scss";

const videoPresets = ["AVI", "MP4", "WEBM", "MPEG", "MOV", "FLV"];

const App = (): JSX.Element => {
  const fileinputRefStarter = useRef<HTMLInputElement>(null);
  const fileinputRef = useRef<HTMLInputElement>(null);
  const consoleInputRef = useRef<HTMLTextAreaElement>(null);
  const commandBtnRef = useRef<HTMLDivElement>(null);
  const presetsOptions = useRef<{ [index: string]: boolean }>({
    selected: false,
    uploaded: true,
    all: false,
  });
  const presetsNodeRef = useRef(null);
  const functionCardNodeRef = useRef<HTMLDivElement>(null);

  const convert = new ConvertEngine();
  const store = new AppStates(convert, consoleInputRef);

  useEffect(() => {
    convert.load(() => store.setLoaded(true));
  }, []);

  const runCommand = async () => {
    const value = consoleInputRef.current?.value;
    const commandBtn = commandBtnRef.current;
    if (value && commandBtn) {
      const cmd = convert.buildCmd(value);
      store.setExecuting(true);
      // console.log(cmd)
      // const cmd = ["-i", store.files[0].name, "out.avi"]
      commandBtn.classList.add("executing");
      const urls = await convert.convertFiles(cmd, store.files);
      commandBtn.classList.remove("executing");
      // if (urls) store.setOutputs(urls);
      if (urls) store.setFiles([...store.files, ...urls]);
      store.setExecuting(false);
    }
  };

  const getPresetsIterable = () => {
    const opts = presetsOptions.current;

    if (opts.selected) {
      return store.files.filter((v) => store.selected.includes(v.name));
    } else if (opts.uploaded) {
      return store.files.filter((v) => v.wasUploaded);
    } else {
      return store.files;
    }
  };

  const switchRadioButton = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cur = e.target.previousElementSibling?.innerHTML.toLowerCase();
    if (!cur) return;

    for (let key of Object.keys(presetsOptions.current)) {
      presetsOptions.current[key] = key === cur ? true : false;
    }

    // console.log(presetsOptions.current)
  };

  const uncheckSwitches = (ext: string) => {
    for (let preset of videoPresets) {
      if (preset !== ext) {
        const el = document.getElementById(
          `${preset}Switch`
        ) as HTMLInputElement;
        el.checked = false;
      }
    }
  };

  const presetOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ext: string
  ) => {
    uncheckSwitches(ext);
    const loopables = getPresetsIterable();
    // const ext = ".avi";
    ext = `.${ext.toLocaleLowerCase()}`;
    let cmd = "";

    if (loopables) {
      for (let i = 0; i < loopables.length; i++) {
        // for (let file of loopables){
        const file = loopables[i];
        const tmp = file.name.split(".");
        const name = tmp.slice(0, tmp.length - 1).join("");

        const escapeSpace = file.name.includes(" ");
        const filename = escapeSpace ? `"${file.name}"` : file.name;
        const outname = escapeSpace ? `"${name + ext}"` : name + ext;
        const insert = ` -map ${i} `;
        cmd =
          cmd +
          `-i ${filename}${loopables.length > 1 ? insert : " "}${outname} \n`;
      }
    }

    const newCmd = cmd ? cmd : `-i %filename% %outputname${ext}%`;
    const checked = e?.currentTarget?.checked;
    const actualCmd = checked ? newCmd : "";
    store.setCurrentCommand(actualCmd);
  };

  return store.loaded ? (
    <AppStatesProvider value={store}>
      <div className="App">
        {/* Spacer */}

        <div className="mainCardHolder">
          <div className="mainCard">
            {store.files.length ? (
              <>
                <Inputs />

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
                        store.addFiles(file2FFFile(e.target.files));
                      }
                    }}
                  />
                  <FAComponent className="uploadIcon icon" icon="fas fa-plus" />
                  <div className="uploadLabel">
                    <div className="upper">Add more files</div>
                    <div className="lower">{store.files.length} file(s)</div>
                  </div>
                </div>

                <div
                  className="downloadField field"
                  onClick={() => {
                    if (!store.files.length) return;

                    let zip = new JSZip();
                    if (store.selected.length) {
                      for (let f of store.files) {
                        if (store.selected.includes(f.name)) {
                          zip.file(f.name, f.srcFile);
                        }
                      }
                    } else {
                      for (let f of store.files) {
                        zip.file(f.name, f.srcFile);
                      }
                    }

                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                      download(URL.createObjectURL(blob), "outputs.zip", false);
                    });
                  }}
                  title={
                    store.selected.length
                      ? "Download all selected files, zipped up."
                      : "Download all available files, zipped up."
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
                            style={{ animationDelay: `${i}00ms` }}
                          />
                        );
                      })}
                    </div>
                    <div className="right">
                      Download
                      {store.selected.length
                        ? ` ${store.selected.length} file(s)`
                        : " All"}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="uploadField starter">
                  <div
                    onClick={() => fileinputRefStarter.current?.click()}
                    style={{
                      display: "flex",
                      gap: "1vh",
                      alignItems: "center",
                    }}
                  >
                    <FAComponent
                      className="uploadIcon icon"
                      icon="fas fa-plus"
                    />
                    <div className="textBlock">
                      <input
                        style={{ display: "none" }}
                        ref={fileinputRefStarter}
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            store.addFiles(file2FFFile(e.target.files));
                          }
                        }}
                      />
                      <div className="switchText">Upload Files</div>
                      <div className="switchText small">
                        Videos, Images and Audio
                      </div>
                    </div>
                  </div>
                </div>

                <div className="title">
                  <div className="switchText top">FFClient</div>
                  <div className="switchText body">A web-based ffmpeg converter/console.</div>
                  <div className="switchText">Powered by FFMPEG WASM.</div>
                </div>

                <div className="readmes">
                  <div className="switchText">
                    Read more about FFMPEG{" "}
                    <a
                      className="switchText"
                      href="https://www.ffmpeg.org/about.html"
                      target="_blank"
                    >
                      here.
                    </a>
                  </div>
                  <div className="switchText">
                    Read more about FFMPEG WASM{" "}
                    <a
                      className="switchText"
                      href="https://ffmpegwasm.netlify.app/"
                      target="_blank"
                    >
                      here.
                    </a>
                  </div>
                  <div className="switchText">
                    Getting started with FFMPEG{" "}
                    <a
                      className="switchText"
                      href="https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats"
                      target="_blank"
                    >
                      here.
                    </a>
                  </div>
                  <div className="switchText">
                    Getting started with FFMPEG WASM{" "}
                    <a
                      className="switchText"
                      href="https://github.com/ffmpegwasm/ffmpeg.wasm"
                      target="_blank"
                    >
                      here.
                    </a>
                  </div>
                  <div className="switchText">
                    Find source code{" "}
                    <a
                      className="switchText"
                      href="https://github.com/fsImageries/ffclient"
                      target="_blank"
                    >
                      here.
                    </a>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        <div
          className={`functionCardHolder ${store.files.length ? "active" : ""}`}
        >
          <div
            ref={functionCardNodeRef}
            className="functionCard"
            style={{ height: store.isPresets ? "80vh" : "30vh" }}
          >
            <textarea
              title="Hold shift and enter to execute current command."
              ref={consoleInputRef}
              id="consoleInput"
              spellCheck={false}
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
                    if (checked !== undefined) {
                      if (!checked) {
                        functionCardNodeRef.current?.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                      store.setPresets(checked);
                    }
                  }}
                />
              </div>

              <div
                className="command"
                ref={commandBtnRef}
                title={
                  store.isExecuting
                    ? "Executing current command..."
                    : "Execute the current command."
                }
                onClick={() => {
                  runCommand();
                }}
              >
                <div className="buttonText">Run Command</div>
                <div
                  className="buttonIcon"
                  style={{
                    transform: "rotate(90deg)",
                  }}
                >
                  {[...Array(3).keys()].map((_, i) => {
                    return (
                      <FAComponent
                        key={i}
                        className={`carrot left icon ${
                          store.isExecuting ? "active" : ""
                        }`}
                        icon="fas fa-angle-left"
                        style={{ animationDelay: `${i}00ms` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <CSSTransition
              nodeRef={presetsNodeRef}
              in={store.isPresets}
              unmountOnExit
              timeout={500}
              classNames={"presetsPrimary"}
            >
              <Presets
                ref={presetsNodeRef}
                videoPresets={videoPresets}
                switchRadioButton={switchRadioButton}
                presetOnChange={presetOnChange}
              />
            </CSSTransition>
          </div>

          {/* <button onClick={() => console.log(convert.readdir())}>
            Readdir
          </button> */}
        </div>

        {/* Spacer */}
      </div>
    </AppStatesProvider>
  ) : (
    <div className="loadingHolder">
      <div className="loadingCircle"></div>
    </div>
  );
};

export default App;
