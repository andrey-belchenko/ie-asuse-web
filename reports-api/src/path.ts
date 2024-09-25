export function convertPath(path:string){
    return path.replace("/dist/","/src/").replace("\\dist\\","\\src\\")
}