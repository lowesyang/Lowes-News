let Vue=require("vue");

let newsList=(newsList)=>{
    return new Vue({
        name:'news-list',
        template:"<div class='newsList'>" +
        "<a :href='\"/p/\"+item._id' target='_blank' v-for='item in newsList' :id='item._id'>"+
        "<div class='item'>" +
        "<div class='infoBox fl'>" +
        "<div class='title'>{{item.title}}</div>" +
        "<div class='intro'>{{item.intro || item.title}}</div>" +
        "<div class='bottomBox'>" +
        "<div class='source fl'>{{item.source}}</div>" +
        "<div class='time fl'>{{item.time}}</div>" +
        "</div>" +
        "</div>"+
        "<lazy-image class='image fr' :src='item.img'></lazy-image>"+
        "</div>" +
        "</a>" +
        "</div>",
        data(){
            return{
                newsList:newsList
            }
        },
        serverCacheKey:()=>{
            return 'news-list'
        }
    })
};

let newsDetail=(info)=>{
    return new Vue({
        name:'news-detail',
        template:"<div class='article'>" +
        "<div class='title'>{{info.title}}</div>" +
        "<div class='infoBox'>" +
        "<span class='source'>{{info.source}}</span>" +
        "<span class='time'>{{info.time}}</span>" +
        "</div>" +
        "<div class='content' v-html='info.content'>" +
        "</div>" +
        "<a :href='info.url' class='link' target='_blank'>原文链接</a>" +
        "</div>",
        data(){
            return {
                info:info
            }
        },
        serverCacheKey:()=>{
            return info._id
        }
    })
};

module.exports={
    newsList,
    newsDetail
};