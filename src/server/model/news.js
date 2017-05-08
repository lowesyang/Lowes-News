let mongoose=require("mongoose");
let db=require("../helpers/db");
let Schema=mongoose.Schema;

let news=new Schema({
    title:String,
    intro:{
        type:String,
        default:""
    },                  //导读
    url:String,         //新闻url
    img:String,      //图片url
    time:String,       //绝对日期
    category:String,    //板块
    source:String,      //来源
    content:String,     //内容
    feature:Object      //新闻特征，在之后添加
});

module.exports=db.model('news',news);