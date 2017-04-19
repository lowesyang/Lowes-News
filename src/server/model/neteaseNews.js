let mongoose=require("mongoose");
let db=require("../helpers/db");
let Schema=mongoose.Schema;

let newsItem=new Schema({
    title:String,
    stitle:{
        type:String,
        default:""
    },                  //副标题
    digest:String,      //导读，用于列表显示
    url:String,         //新闻url
    imgsrc:String,      //图片url
    ptime:String,       //绝对日期
    category:String,    //板块
    source:String,      //来源
    content:String,     //内容
});

module.exports=db.model('netease_news',newsItem);