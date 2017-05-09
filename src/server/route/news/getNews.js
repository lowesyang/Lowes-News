let news=require("../../model").news;
let getNewsByRandom=require("../../helpers/utils").shuffle;
let moment=require("moment");

/**
 * 策略：从三个平台中分别选取pcount数量新闻，合并后按时间选取pcount个最近的新闻
 * @param type   ["news","tech","sports".....]
 * @param page   page number
 * @param pcount   number of items in per page
 * @return Promise instance
 */
function getNews(type,page,pcount){
    let numPerFind=pcount>2000?pcount:2000,
        realSkip=parseInt(((page-1)*pcount/numPerFind))*numPerFind;
    return new Promise((resolve,reject)=>{
        news.find({category:{$regex:type}}).sort({time:-1}).skip(realSkip).
        limit(numPerFind).exec((err,data)=>{
            if(err) reject("获取新闻列表失败");
            data.sort((a,b)=>{
                return moment(b.time).valueOf()-moment(a.time).valueOf()
            });
            let begin=(page-1)*pcount%numPerFind;
            data=data.slice(begin,begin+pcount);
            data.forEach((item) => {
                if(!item['img']) {
                    item['img']='/images/noimg'+Math.floor(Math.random()*18+1)+'.jpg';
                }
                //节省数据字节
                item.content="";
            });
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