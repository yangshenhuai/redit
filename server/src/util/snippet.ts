
export const  getTextSnippet = (text:string,length:number) => {
    var rx = new RegExp("^.{" + length + "}[^ ]*");
    const resultArr = rx.exec(text);
    if(!resultArr) {
        return text
    }
    return resultArr[0]

}