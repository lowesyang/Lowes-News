let express=require("express");
let path=require("path");
let fs=require("fs");
let bodyParser=require("body-parser");

let isDev=process.env.NODE_ENV === "dev";
let app=express();
let port=3000;

const ROUTEPATH="src/server/route";

let news=require(path.resolve(__dirname,ROUTEPATH,"news"));
let login=require(path.resolve(__dirname,ROUTEPATH,"login"));
let recom=require(path.resolve(__dirname,ROUTEPATH,"recom"));
let push=require(path.resolve(__dirname,ROUTEPATH,"push"));

// let sinaNews=require("./src/server/model/sinaNews");
// let type="tec"
// sinaNews.findOne({category:{$regex:type}}).then((data)=>{
//     console.log(data)
// })

// let jwt=require("jwt-simple");
// let payload={foo:"bar"};
// let token=jwt.encode(payload,"lowesyang");
// console.log(jwt.decode(token,"lowesyang")); //若失败则抛出错误
// let moment=require("moment")
// console.log(moment().add(3,"days").valueOf())
//
// let Segment=require("segment")
// let segment=new Segment();
// segment.useDefault();
// let testStr="Facebook即将在华启动";
// let result=segment.doSegment(testStr,{
//     stripPuncutation:true,
//     stripStopword:true,
// })
// console.log(result)



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("src"));


if(isDev) {
    let webpack = require("webpack");
    let webpackDevConfig = require(path.resolve(__dirname, "config/webpack.dev.config.js"));
    let webpackDevMiddleware = require("webpack-dev-middleware");
    let compiler=webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler,{
        publicPath:webpackDevConfig.output.publicPath,
        noInfo:true,
        stats:{
            colors:true,
            progress:true
        }
    }));

    let hotMiddleware=require("webpack-hot-middleware")(compiler);
    app.use(hotMiddleware);

    let reload=require("reload");
    let http=require("http");

    let server=http.createServer(app);
    reload(server,app);

    server.listen(port,()=>{
        console.log("App(dev) is now running on port 3000!");
    });
}
else{
    app.listen(port,(err)=>{
        if(err){
            return console.log(err);
        }
    })

}
app.get("/sw",(req,res)=>{
    res.setHeader('content-type','application/javascript');
    res.send(fs.readFileSync("src/client/serviceWorker/worker.js"));
});

app.use("/",[news,login.login,login.register]);
!isDev && app.use(express.static("dist"));      //必须放在服务端渲染之后，否则在Nginx下会加载到dist中的index.html
app.use("/push",push);
app.use(login.loginCheck);
app.use("/recom",recom);

