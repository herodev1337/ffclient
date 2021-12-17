import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import AppStates from "./js/states";
import { ConvertEngine } from "./js/convert";

import InputComponent from "./components/InputComponent";
import "./App.scss";

function App(): JSX.Element {
  const store = new AppStates();
  const convert = new ConvertEngine();

  useEffect(() => {
    convert.load(store.setLoaded);
  }, []);

  return store.loaded ? (
    <div className="App">
      <InputComponent
        text="Upload a file to process:"
        type="file"
        base="upload"
        multiple={true}
        onChange={(e) => {
          if (e.target.files) store.setFiles(e.target.files);
        }}
      />
      <InputComponent
        text="Enter ffmpeg command:"
        type="text"
        base="cmd"
        onKeyPress={async (e) => {
          if (e.key === "Enter" && store.files) {
            const urls = await ConvertEngine.files(store.files);
            if (urls) store.setOutputs(urls);
          }
        }}
      />

      <table className="contentTable">
        <thead>
          <tr>
            <th>Uploaded</th>
            <th>Converted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {store.files &&
                Object.values(store.files).map((f) => {
                  return <div key={uuidv4()}>{f.name}</div>;
                })}
            </td>
            <td className="outsTd">
              {store.outputs &&
                store.outputs.map((out) => {
                  return (
                    <a key={uuidv4()} download={out.name} href={out.url}>
                      {out.name}
                    </a>
                  );
                })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
