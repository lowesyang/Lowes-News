let news=require("../../model").news;
let getNewsByRandom=require("../../helpers/utils").shuffle;

/**
 * 策略：从三个平台中分别选取pcount数量新闻，合并后按时间选取pcount个最近的新闻
 * @param type   ["news","tech","sports".....]
 * @param page   page number
 * @param pcount   number of items in per page
 * @param {Boolean} isGetContent 是否包括新闻内容返回
 * @return Promise instance
 */
function getNews(type,page,pcount,isGetContent){
    return new Promise((resolve,reject)=>{
        news.find({category:{$regex:type}}).sort({time:-1}).skip((page-1)*pcount).
        limit(pcount).exec((err,data)=>{
            if(err) reject("获取新闻列表失败");
            data=getNewsByRandom(data);
            if(!isGetContent) {
                data.forEach((item) => {
                    if(!item['img']) {
                        item['img']='/images/noimg'+Math.floor(Math.random()*18+1)+'.jpg';
                    }
                    //节省数据字节
                    item.content="";
                })
            }
            resolve(data);
        });
    });
}

/**
 * 获取单条新闻内容
 * @param {String} docId
 * @return {Promise} Promise instance
 */
function getNewsDetail(docId){
    return new Promise((resolve,reject)=>{
        news.findOne({_id:docId}).exec((err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

module.exports={
    getNews,
    getNewsDetail
};