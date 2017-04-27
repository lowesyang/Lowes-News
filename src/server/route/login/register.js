let router=require("express").Router();
let userModel=require("../../model").users;
let jwt=require("jwt-simple");
let encrypt=require("../../helpers/encrypt");
let moment=require("moment");

router.post("/register",(req,res,next)=>{
    if(req.body.password!=req.body.confirm) {
        return res.json({
            code:-1,
            msg:"两次密码输入不一致!"
        })
    }
    let info={
        username:req.body.username,
        email:req.body.email,
        password:encrypt.encrypt(req.body.password)
    };
    if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-])+/.test(info.email)){
        return res.json({
            code:-1,
            msg:'电子邮箱格式不正确!'
        })
    }
    let user=new userModel(info);
    userModel.findOne({username:info.username}).exec((err,data)=>{
        if(err) return next(err);

        if(data) return res.json({
            code:-1,
            msg:"该用户已存在"
        });
        user.save((errr)=>{
            if(errr) next(errr);
            let token=jwt.encode({
                id:user._id,
                exp:moment().add(3,"days").valueOf()
            },encrypt.key);
            return res.json({
                code:0,
                msg:"欢迎加入LowesNews!",
                token:token,
                body:{
                    userId:user._id,
                    username:user.username,
                }
            })
        })
    })
});

module.exports=router;