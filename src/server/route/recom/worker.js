// 该文件已弃用！！！
let handle=require("./handle");
let pearsonCorrelation=handle.pearsonCorrelation;

process.on('message',(data)=>{
    let news=data.newsList,
        colForUser=data.colForUser,
        taste=data.taste,
        pearson,
        resArr=[];
    news.forEach((item) => {
        let newsCharacter = {};       //存储新闻特征值的频率
        let colForNews = [];
        for(let word in item.feature){
            // 如果是合法的特征词且用户特征中有
            if (taste[word]) {
                newsCharacter[word] = newsCharacter[word] ? newsCharacter[word] + 1 : 1;
            }
        }
        // 组装用户特征和新闻特征的两个数据集
        for (let word in taste) {
            colForNews.push(newsCharacter[word] || 0);
        }

        // console.log(colForNews.length,colForUser.length)
        // 没有相同特征词
        if(colForUser.length === 0){
            pearson = 0;
        }else {
            pearson = pearsonCorrelation(colForUser, colForNews);
            console.log(pearson)
        }
        // 不传内容，节约网络流量
        item.content="";
        resArr.push({
            pearson,
            news: item
        })
    });
    process.send({
        newsList:resArr
    });
    process.exit();
});

process.on('disconnect',()=>{
    process.exit();
})
