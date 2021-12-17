import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

export type OutputFile = {
  name: string;
  url: string;
};

class ConvertEngine {
  constructor() {}

  load(checkLoaded: (v: boolean) => void) {
    const ffmpeg_load = async () => {
      await ffmpeg.load();
      checkLoaded(true);
    };

    ffmpeg_load();
  }

  static async files(
    // ffmpeg: FFmpeg,
    files: FileList
  ): Promise<OutputFile[] | undefined> {
    // ffmpeg -i input.mp4 output.avi
    if (!files) return;

    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      console.log("gelaufen");
      ffmpeg.FS("writeFile", f.name, await fetchFile(f));

      const ext = f.name.split(".").pop();
      const fname = f.name.replace(`.${ext}`, "");
      const outname = `output_${fname}.avi`;
      await ffmpeg.run("-i", f.name, outname);

      const data = ffmpeg.FS("readFile", f.name);

      const url = URL.createObjectURL(new Blob([data.buffer]));

      urls[i] = { name: outname, url: url };
    }

    return urls;
    // setOutputs(urls);
  }
}

export { ConvertEngine };
