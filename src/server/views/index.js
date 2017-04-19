let fs=require("fs");
let path=require("path");
let isDev = process.env.NODE_ENV !== "production";

// add reload.js in template for auto-reloading
function devHtmlFilter(html){
    if(isDev) {
        let index = html.indexOf("</body>");
        return html.substring(0, index) + "<script src='/reload/reload.js'></script>" + html.substring(index, html.length);
    }
    return html;
}

let indexPath=isDev?"src/client/index/index.html":"dist/index.html";
let articlePath=isDev?"src/client/article/article.html":"dist/article.html";

let indexHtml=devHtmlFilter(
    fs.readFileSync(path.resolve(__dirname,"../../../",indexPath),"utf8")
);
let articleHtml=devHtmlFilter(
    fs.readFileSync(path.resolve(__dirname,"../../../",articlePath),"utf8")
);

module.exports={
    indexHtml,
    articleHtml
}
