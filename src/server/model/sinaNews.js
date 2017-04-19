let mongoose=require("mongoose");
let db=require("../helpers/db");
let Schema=mongoose.Schema;

let newsItem=new Schema({
    title:String,
    wap_title:{
        type:String,
        default:""
    },                      //副标题
    intro:String,           //导读，用于列表显示
    img:String,             //图片url
    cdateTime:String,       //绝对日期
    category:String,        //板块
    source:String,          //来源
    link:String,            //新闻url
    content:String,         //内容
});

module.exports=db.model('sina_news',newsItem);

