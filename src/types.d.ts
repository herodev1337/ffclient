export interface FFFile{
    name: string;
    url: string;
    size:number;
    wasUploaded: boolean;
    srcFile: File | Blob;
}