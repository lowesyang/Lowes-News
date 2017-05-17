// 将英文类型转为中文名
function cateToName(category){
    switch(category){
        case 'finance':category='财经';break;
        case 'tech':category='科技';break;
        case 'sports':category='体育';break;
        case 'entertainment':category='娱乐';break;
        case 'game':category='游戏';break;
        case 'phone':category='手机';break;
        case 'army':category='军事';break;
        default:category='头条';
    }
    return category;
};

/**
 * 随机提取特定数目的数组元素
 * @param arr  {Array}     数组
 * @param count {Number}   指定数目(可选)
 */
function shuffle(arr,count = 0){
    if(count>arr.length || !count) count=arr.length;
    let rand;
    for(let i=arr.length-1;i>=0;i--){
        rand=Math.floor(Math.random()*i);
        [arr[i],arr[rand]]=[arr[rand],arr[i]];
    }
    return arr.slice(0,count);
}

/**
 * 性能测试，打印时间点
 * @param descrip
 */
const timeLog=(()=>{
    let time=null;
    return {
        begin(){
            time=Date.now();
        },
        log(msg){
            if(time==null) {
                return console.error("Please invoke timeLog.begin() first");
            }
            console.log(msg,(Date.now()-time)/1000,'s');
            time=Date.now();
        },
        end(){
            time=null;
        }
    }
})();

module.exports={
    cateToName,
    shuffle,
    timeLog
}