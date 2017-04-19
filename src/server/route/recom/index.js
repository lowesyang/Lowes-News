/*
 *  推荐系统后端
 */
let router=require("express").Router();
let userModel=require("../../model").users;
let getNewsDetail=require("../news/getNews").getNewsDetail;
let getNews=require("../news/getNews").getNews;
let handle=require("./handle");
let checkTypeOfWord=handle.checkTypeOfWord;
let pearsonCorrelation=handle.pearsonCorrelation;
let getNewsByRandom=handle.getNewsByRandom;
let Segment=require("segment");
let segment=new Segment();
segment.useDefault();

let LRU=require("lru-cache");
let cache=LRU({
    max:1000,
    maxAge:1000*60
});

/**
 * 推荐系统
 * @params type 板块
 * @query num   推荐新闻数目
 */
router.get("/list/:type?",(req,res)=>{
    let type=req.params.type || "";
    let recomNum=req.query.num || 20;
    let userInfo=req.user;
    let taste=userInfo.favor.taste;
    let resArr=cache.get(req.user._id);
    // console.log(resArr)
    if(!resArr) {
        // 用户特征分布集合
        let colForUser=[];
        for(let word in taste){
            colForUser.push(taste[word]);
        }

        getNews(type, 1, 50,true).then((news) => {
            let resArr = [],pearson;
            // 计算每个新闻与用户的皮尔斯相似度
            news.forEach((item) => {
                let words = segment.doSegment(item.content, {
                    stripPuncutation: true,
                    stripStopword: true
                });
                let newsCharacter = {};       //存储新闻特征值的频率
                let colForNews = [];
                words.forEach((obj) => {
                    // 如果是合法的特征词且用户特征中有
                    if (checkTypeOfWord(obj) && taste[obj.w]) {
                        newsCharacter[obj.w] = newsCharacter[obj.w] ? newsCharacter[obj.w] + 1 : 1;
                    }
                });
                // 组装用户特征和新闻特征的两个数据集
                for (let word in taste) {
                    colForNews.push(newsCharacter[word] || 0);
                }
                // 没有相同特征词
                if(colForUser.length==0){
                    pearson=0;
                }else {
                    pearson = pearsonCorrelation(colForUser, colForNews);
                    // console.log(pearson)
                }
                // 不传内容，节约网络流量
                item.content="";
                resArr.push({
                    pearson,
                    news: item
                })
            });
            resArr.sort((a,b)=>{
                return b.pearson - a.pearson;
            }).slice(0,100);
            // 将筛选出来的推荐新闻数组缓存
            cache.set(req.user._id, resArr);

            return res.json({
                code: 0,
                msg: `向您推荐了${recomNum}条新闻`,
                body: {
                    data: getNewsByRandom(resArr, recomNum)
                }
            })
        }).catch((err)=>{
            console.log(err);
            return res.json({
                code:-1,
                msg:"获取推荐列表失败"
            })
        })
    }
    else{
        return res.json({
            code: 0,
            msg: `向您推荐了${recomNum}条新闻`,
            body: {
                data: getNewsByRandom(resArr, recomNum)
            }
        })
    }
});

/**
 *  提取新闻特征值
 */
router.post("/save/:docId",(req,res)=>{
    let userInfo=req.user;
    let favor=userInfo.favor;
    getNewsDetail(req.params.docId)
        .then((data)=>{
            favor.count++;
            // 提取特征词
            let character=segment.doSegment(data.title,{
                stripPuncutation:true,
                stripStopword:true
            });
            let tmpFavor={};
            character.forEach((item)=>{
                // 词性判断，参考https://github.com/leizongmin/node-segment/blob/master/lib/POSTAG.js
                if(checkTypeOfWord(item)){
                    tmpFavor[item.w]=tmpFavor[item.w]?tmpFavor[item.w]+1:1;
                }
            });
            if(!favor.taste) favor.taste={};
            for(let word in tmpFavor){
                favor.taste[word]=favor.taste[word]?favor.taste[word]+1:1;
            }
            userModel.update({_id:userInfo.id},{$set:{favor:favor}}).exec();
        });
    res.send("");
});

module.exports=router;