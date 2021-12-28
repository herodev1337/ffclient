const download = (
  data: any,
  fileName: string,
  raw = true,
  contentType = "text/plain"
) => {
  const createURL = () => {
    const f = new Blob([data], { type: contentType });
    return URL.createObjectURL(f);
  };

  let a = document.createElement("a");
  const url = raw ? createURL() : data;
  a.href = url;
  a.download = fileName;
  a.click();
};

const arrayEquals = <T>(a: T[], b: T[]) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

const getSafeName = (n: string) => n.replace(" ", "_");

const formatSize = (byteSize: number) => {
  // const toKB = 1000
  // const toMB = 1e+6
  // const toGB = 1e+9

  const fConsts: [number, string][] = [
    [1000, "KB"],
    [1e6, "MB"],
    [1e9, "GB"],
  ]; // [toKB, toMB, toGB]

  for (let fConst of fConsts) {
    const [num, size] = fConst;
    const res = byteSize / num;

    // console.log(res, size)
    if (Math.ceil(Math.log10(res + 1)) < 2) {
      return `${Math.round((res + Number.EPSILON) * 100) / 100}${size}`;
    }
  }
};

const file2FFFile = (files: File[] | FileList) => {
  return [...files].map((f) => {
    return {
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size, 
      wasUploaded: true,
      srcFile: f
    }
  });
};

export { download, arrayEquals, formatSize, getSafeName, file2FFFile };
