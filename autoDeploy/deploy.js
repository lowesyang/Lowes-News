let http=require("http");
let createHandler=require("github-webhook-handler");
let handler=createHandler({path:'/',secret:'lowesyang'});

let runCmd=require("./runCmd");

handler.on('err',(err)=>{
    console.log('Error:',err.message);
});

handler.on('push',(ev)=>{
    console.log("Received a push event for %s",ev.payload.repository.name);
    runCmd('sh',['./autoDeploy.sh'],()=>{
        console.log('run sh completed!');
    })
});

http.createServer((req,res)=>{
    handler(req,res,(err)=>{
        res.statusCode=404;
        res.end('no such location');
    })
}).listen(18099);
