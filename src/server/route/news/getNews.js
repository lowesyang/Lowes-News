let neteaseNews=require("../../model").neteaseNews;
let sinaNews=require("../../model").sinaNews;
let sohuNews=require("../../model").sohuNews;
let moment=require("moment");

/**
 * 策略：从三个平台中分别选取pcount数量新闻，合并后按时间选取pcount个最近的新闻
 * @param type   ["news","tech","sports".....]
 * @param page   page number
 * @param pcount   number of items in per page
 * @param {Boolean} isGetContent 是否包括新闻内容返回
 * @return Promise instance
 */
function getNews(type,page,pcount,isGetContent){
    return new Promise((resolv,rej)=>{
        let res=[];
        // netease
        let getNetease=new Promise((resolve,reject)=>{
            neteaseNews.find({category:{$regex:type}}).skip((page-1)*pcount).
            limit(pcount).exec((err,data)=>{
                if(err) reject(new Error("Fail to get news from [netease]"));
                res=res.concat(data);
                resolve();
            });
        });

        // sina
        let getSina=new Promise((resolve,reject)=>{
            sinaNews.find({category:{$regex:type}}).skip((page-1)*pcount).
            limit(pcount).exec((err,data)=>{
                if(err) reject(new Error("Fail to get news from [sina]"));
                res=res.concat(data);
                resolve();
            });
        });

        // sohu
        let getSohu=new Promise((resolve,reject)=>{
            sohuNews.find({category:{$regex:type}}).skip((page-1)*pcount).
            limit(pcount).exec((err,data)=>{
                if(err) reject(new Error("Fail to get news from [sohu]"));
                res=res.concat(data);
                resolve();
            });
        });

        Promise.all([getNetease,getSina,getSohu]).then(()=>{
            res.sort((a,b)=>{
                let atime=moment(a.ptime || a.cdateTime || a.time).valueOf();
                let btime=moment(b.ptime || b.cdateTime || b.time).valueOf();
                return btime-atime;
            });
            if(!isGetContent) {
                res.forEach((item) => {
                    item.content="";
                })
            }
            resolv(res);
        }).catch((err)=>{
            rej(err);
        })

    })
}

/**
 * 获取单条新闻内容
 * @param {String} docId
 * @return {Promise} Promise instance
 */
function getNewsDetail(docId){
    return new Promise((resolv,rej)=>{
        let getNetease = new Promise((resolve,reject)=>{
            neteaseNews.findOne({_id:docId}).exec((err,data)=>{
                if(err || !data) resolve();
                else reject(data);
            })
        });
        let getSina = new Promise((resolve,reject)=>{
            sinaNews.findOne({_id:docId}).exec((err,data)=>{
                if(err || !data) resolve();
                else reject(data);
            })
        });
        let getSohu = new Promise((resolve,reject)=>{
            sohuNews.findOne({_id:docId}).exec((err,data)=>{
                if(err || !data) resolve();
                else reject(data);
            })
        });

        // 这里逆用Promise.all:当某一个Promise找到相应值后即返回reject;
        // 若没找到,则等待其他promise,直到所有Promise都没找到,返回resolve
        Promise.all([getNetease,getSina,getSohu]).then(()=>{
            // 没有找到对应新闻
            rej();
        }).catch((data)=>{
            // 找到对应新闻
            resolv(data);
        })
    })
}

module.exports={
    getNews,
    getNewsDetail
};