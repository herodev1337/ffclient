import React, {forwardRef} from 'react'
import SwitchToggle from "../SwitchToggle"
import PresetOptionItem from "./PresetOptionItem"
import PresetEntry from "./PresetEntry"

const Presets = forwardRef(({videoPresets, switchRadioButton, presetOnChange}:any, ref:any) => {
    return (
        <div className="presetsField" ref={ref}>
                <div className="switchText" style={{ padding: "1% 2%" }}>
                  Apply to
                </div>
                <div className="presetsOptions" onChange={switchRadioButton}>
                  {["Uploaded", "Selected", "All"].map((v, i) => (
                    <PresetOptionItem key={i} defaultChecked={!i} text={v} />
                  ))}
                </div>
                <div className="switchText" style={{ padding: "1% 2%" }}>
                  Convert to
                </div>
                <div className="presetsHolder">
                  <div className="videoField presetField">
                    <div className="switchText">Videofiles</div>
                    {videoPresets.map((v:string, i: number) => (
                      <PresetEntry key={i} text={v} onChange={(e)=>{if(e) presetOnChange(e, v)}} />
                    ))}
                  </div>

                  <div className="imageField presetField">
                    <div className="switchText">Imagefiles</div>
                    <div className="imageEntry entry">
                      <div className="switchText">JPG</div>
                      <SwitchToggle
                        onChange={() => {
                          console.log("To JPG");
                        }}
                      />
                    </div>
                  </div>

                  <div className="audioField presetField">
                    <div className="switchText">Audiofiles</div>
                    <div className="audioEntry entry">
                      <div className="switchText">MP3</div>
                      <SwitchToggle
                        onChange={() =>
                          console.log("To MP3")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
    )
})

export default Presets
