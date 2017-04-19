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
        default:category='新闻';
    }
    return category;
};


module.exports={
    cateToName
}