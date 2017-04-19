let mongoose=require("mongoose");
let db=require("../helpers/db");
let Schema=mongoose.Schema;

let newsItem=new Schema({
    title:String,
    stitle:{
        type:String,
        default:""
    },                      //副标题
    url:String,             //新闻url
    time:String,            //绝对日期
    category:String,        //板块
    source:String,          //来源
    content:String,         //内容
});

module.exports=db.model('sohu_news',newsItem);
