let mongoose=require("mongoose");
let db=require("../helpers/db");
let Schema=mongoose.Schema;

let userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    /**
     *  记录偏好
     *  @property count: 阅读新闻的总次数
     *  @property taste 特征
     *  {
     *      keywords: 特征词出现的次数
     *  }
     */
    favor:{
        count:{
            type:Number,
            default:0
        },
        taste:{}
    }
});

module.exports=db.model("user",userSchema);