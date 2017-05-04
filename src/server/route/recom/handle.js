let childProcess=require("child_process");
let path=require("path");

/** 已弃用！！！！
 * 多进程计算皮尔逊相关系数
 * @param {Object} payload  数据结构体
 * {
 *      newsList 新闻列表
 *      colForUser  用户特征数据集
 *      taste  用户特征对象
 * }
 * @param {Number} processNum  开启的进程数量，默认为1
 */
function multiCalculate(payload,processNum = 1){
    return new Promise((resolv,rej)=>{
        let total=payload.newsList.length;
        let numPerProcess=parseInt(total/processNum);
        let promise=[]; //Promise列表
        let resArr=[];  //结果列表

        // 创建子进程处理任务
        let news,begin,end;
        for(let i=0;i<processNum;i++){
            begin=i*numPerProcess;
            end=begin+numPerProcess;
            news=payload.newsList.slice(begin,end);

            promise.push(new Promise((resolve,reject)=>{
                let child=childProcess.fork(path.resolve(__dirname,'worker.js'));
                child.send({
                    newsList:news,
                    colForUser:payload.colForUser,
                    taste:payload.taste
                });
                child.on('error',()=>{
                    resolve();
                    child.kill();
                });
                child.on('message',(data)=>{
                    resArr=resArr.concat(data.newsList);
                    resolve();
                })
            }))
        }

        Promise.all(promise).then(()=>{
            resolv(resArr);
        }).catch(()=>{
            rej("多进程任务发生未知错误");
        })
    })
}

/**
 * 判断单词类型
 * @param word
 * {
 *      w:单词
 *      p:词性，可为空
 * }
 */
function checkTypeOfWord(word){
    // 词性判断，参考https://github.com/leizongmin/node-segment/blob/master/lib/POSTAG.js
    if(word.p==0x00100000           //名词
        || word.p==0x00000080       //人名
        || word.p==0x00000040       //地名
        || word.p==0x01000000       //成语
        || word.p==0x00000020       //机构团体
        || word.p==0x00000008       //其他专名
        || word.p==0x00000010       //外文字符
    ){
        return true;
    }
    else return false;
}

/**
 * 随机提取出指定数目的新闻
 * @param news  {Array}     新闻数组
 * @param count {Number}    指定数目
 */
function getNewsByRandom(news,count){
    if(count>news.length) count=news.length;
    let num=count,used=[];
    let res=[];
    let randomIndex;
    while(num--){
        randomIndex=Math.floor(Math.random()*count);
        while(used.indexOf(randomIndex)>=0){
            randomIndex=Math.floor(Math.random()*count);
        }
        used.push(randomIndex);
        res.push(news[randomIndex]);
    }
    return res;
}

/**
 * 皮尔逊相关系数
 * @param {Array} colX  Collection of data X
 * @param {Array} colY  Collection of data Y
 */
function pearsonCorrelation(colX,colY){
    // 分子部分
    let Ex=average(colX),Ey=average(colY);
    let Exy=average(colX.map((item,i)=>{
        return item*colY[i];
    }));
    // 分母部分
    let E2x=average(colX.map((item)=>{
        return item*item;
    }));
    let E2y=average(colY.map((item)=>{
        return item*item;
    }));

    let vx=E2x-Ex*Ex,vy=E2y-Ey*Ey;
    // 分母为0，代表标准差为0，其中一组分布为常数，则相关系数无意义
    if(!vx || !vy) return 0;
    return (Exy-Ex*Ey)/Math.pow(vx*vy,0.5);
}

/**
 * 求平均值
 * @param {Array} collection
 */
function average(collection){
    return collection.reduce((left,right)=>{
        return left+right;
    })/collection.length;
}

module.exports={
    multiCalculate,
    checkTypeOfWord,
    pearsonCorrelation,
    getNewsByRandom
};