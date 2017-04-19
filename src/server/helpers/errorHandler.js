module.exports=(err,req,res,next)=>{
    console.log(err.stack);
    console.log(err.toString());
    res.json({
        code:-1,
        msg:err.toString()
    })
}