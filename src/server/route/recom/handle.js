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
    if(!vx || !vx) return 0;
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
    checkTypeOfWord,
    pearsonCorrelation,
    getNewsByRandom
};