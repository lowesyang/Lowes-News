let router=require("express").Router();
let userModel=require("../../model").users;
let jwt=require("jwt-simple");
let encrypt=require("../../helpers/encrypt");
let moment=require("moment");

router.post("/login",(req,res)=>{
    let info={
        username:req.body.username,
        password:encrypt.encrypt(req.body.password)
    }
    userModel.findOne(info).exec((err,data)=>{
        if(err) {
            return res.json({
                code:-1,
                msg:"数据库发生未知错误"
            });
        }

        if(!data){
            return res.json({
                code:-1,
                msg:"用户名或密码不匹配"
            })
        }
        else{
            let token=jwt.encode({
                id:data._id,
                exp:moment().add(3,"days").valueOf()
            },encrypt.key);
            res.json({
                code:0,
                msg:"登录成功",
                token:token,
                body:{
                    userId:data._id,
                    username:data.username
                }
            })
        }
    })
});

module.exports=router;