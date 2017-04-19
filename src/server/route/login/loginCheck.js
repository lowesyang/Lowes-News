/**
 *  token验证
 */

let router=require("express").Router();
let jwt=require("jwt-simple");
let key=require("../../helpers/encrypt").key;
let userModel=require("../../model").users;
let moment=require("moment");

router.all("*",(req,res,next)=>{
    let token=req.headers['access-token']
        ||(req.body && req.body.token)
        || (req.query && req.query.token);
    if(!token) return res.status(401).send();
    let decode;
    try{
        decode=jwt.decode(token,key);
        let now=moment().valueOf();
        if(now>decode.exp) return res.status(401).send()
    }
    catch(err){
        next("token验证无效，请重新登录");
    }
    userModel.findOne({
        _id:decode.id
    }).exec((err,data)=>{
        if(err) return next(err);
        if(!data) return res.status(401).send();
        token=jwt.encode({
            id:data._id,
            exp:moment().add(3,"days").valueOf()
        },key);
        req.token=token;
        req.user=data;
        next();
    })

});

module.exports=router;