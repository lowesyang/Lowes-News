function runCmd(cmd,args,callback){
    let spawn=require("child_process").spawn;
    let child=spawn(cmd,args);
    let resp="";

    child.stdout.on('data',(buffer)=>{
        resp+=buffer.toString();
    })
    child.stdout.on('end',()=>{
        callback(resp);
    })
}

module.exports=runCmd