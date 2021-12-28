import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { arrayEquals } from "./helpers";
import {FFFile} from "../types"


const mapNumber =  (value:number, in_min:number, in_max:number, out_min:number, out_max:number) => {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export type OutputFile = {
  name: string;
  url: string;
  size: number;
  blob: Blob;
};

const ffmpeg = createFFmpeg({
  log: false,
  // logger: (msg) => {
  //   // if (msg.type === "fferr") console.log(msg.message);
  //   if (msg.message.toLowerCase().includes("stream")) console.log(msg.message);
  // },
});

ffmpeg.setProgress(({ ratio }) => {
  const curRatio = ratio < 1 ? ratio * 100 : ratio/10;
  // console.log("Progress: ", curRatio);
  console.log("Progress: ", mapNumber(ratio, 0, ratio > 1 ? 1000 : 1, 0, 100));
  document.documentElement.style.setProperty('--cmdBtnProgress', `${curRatio}%`);
})

const dirDefaults = [".", "..", "tmp", "home", "dev", "proc"];

class ConvertEngine {
  load(checkLoaded: () => void) {
    const ffmpeg_load = async () => {
      await ffmpeg.load();
      checkLoaded();
    };
    ffmpeg_load();
  }

  readdir() {
    return ffmpeg
      .FS("readdir", "/")
      .filter((e: string) => !dirDefaults.includes(e));
  }

  buildCmd(cmdStr: string) {
    // const re = /\s+/
    const re = /('.*?'|".*?"|\S+)/;
    cmdStr = cmdStr.replaceAll("\n", "")
    const split = `${cmdStr}`
      .split(re)
      .filter((v) => {
        if (!v) return false;
        if (v === " ") return false;
        return true;
      })
      .map((v) => v.replaceAll(`\"`, ""));
    console.log("STR: ", cmdStr)
    console.log("SPLIT: ", split)

    return split;
  }

  evalFS(files: string[]) {
    //  for (let i = 0; i < this.readdir().length; i){
    for (let entry of this.readdir()) {
      if (!files.includes(entry)) {
        ffmpeg.FS("unlink", entry);
      }
    }
  }

  async importFiles(files: FFFile[]) {
    for (let f of files) {
      ffmpeg.FS("writeFile", f.name, await fetchFile(f.srcFile));
    }
  }

  async convertFiles(
    cmd: string[],
    inputs: FFFile[]
  ): Promise<FFFile[] | undefined> {
    if (!this.readdir().length) return;

    const infiles = inputs.map((f) => f.name);

    await ffmpeg.run(...cmd);

    const outs = ffmpeg.FS("readdir", "/").filter((entry: string) => {
      return !dirDefaults.includes(entry) && !infiles.includes(entry);
    });

    console.log(outs)

    return this._buildUrls(outs);
  }

  _isEmpty() {
    return arrayEquals(ffmpeg.FS("readdir", "/"), dirDefaults);
  }

  _buildUrls(files: string[]) {
    return files.map((file) => {
      const data = ffmpeg.FS("readFile", file);
      const blob = new Blob([data.buffer]);
      const url = URL.createObjectURL(blob);
      return { name: file, url: url, size: blob.size, srcFile: blob, wasUploaded: false };
    });
  }
}

export { ConvertEngine };
