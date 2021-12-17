const download = (data:any, fileName:string, raw=true, contentType = "text/plain") => {
    const createURL = ()=>{
      const f  = new Blob([data], { type: contentType })
      return URL.createObjectURL(f);
    }
    
    let a = document.createElement("a");
    const url = raw ? createURL() : data;
    a.href = url
    a.download = fileName;
    a.click();
  };

  export {}