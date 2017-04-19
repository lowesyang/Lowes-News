<template>
    <div class="header">
        <div class="container">
            <div class="logoBox fl">
                <div class="logo fl">Lowes-News</div>
                <!--<div class="category fl">{{category}}</div>-->
            </div>
            <div class="navbar fr">
                <a :href="item.link"
                   target="_blank"
                   v-for="item in linkList"
                   v-tooltip.bottom-center="item.tooltip">
                    <i class="iconfont" :class="item.icon" :style="item.style||{}"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .header{
        position: fixed;
        background-color: #464c5b;
        width:100%;
        height:50px;
        z-index:10;
        top:0;
    }
    .logoBox{
        color:#f5f7f9;
        font-size:28px;
        margin:10px;
    }
    .logoBox .category{
        font-size:14px;
        margin-left:10px;
        border:1px solid #f5f7f9;
        border-radius:5px;
        padding:2px 6px;
        margin-top:5px;
    }
    .navbar{
        margin-top:10px;
    }
    .navbar a{
        display: inline-block;
        color:#f5f7f9;
        margin-right:25px;
    }
    .navbar i{
        font-size:24px;
        cursor: pointer;
    }
</style>

<script>
    import Vue from "vue";
    import {cateToName} from "../../utils";
    import VTooltip from "v-tooltip";
    Vue.use(VTooltip);

    export default{
        data(){
            let category=cateToName(location.pathname.split('/')[2]);
            return {
                category:category,
                linkList:[
                    {
                        icon:'icon-icon05',
                        link:'/',
                        tooltip:'国内外新闻'
                    },
                    {
                        icon:'icon-caijing',
                        link:'/news/finance',
                        tooltip:'财经'
                    },
                    {
                        icon:'icon-yunxiangmugongdanweixintubiao-',
                        link:'/news/tech',
                        tooltip:'科技'
                    },
                    {
                        icon:'icon-sheshi_tiyuguan',
                        link:'/news/sports',
                        tooltip:'体育'
                    },
                    {
                        icon:'icon-yule',
                        link:'/news/entertainment',
                        style:{
                            fontSize:'26px'
                        },
                        tooltip:'娱乐'
                    },
                    {
                        icon:'icon-94',
                        link:'/news/game',
                        style:{
                            fontSize:'28px',
                        },
                        tooltip:'游戏'
                    },
                    {
                        icon:'icon-shouji2',
                        link:'/news/phone',
                        style:{
                            fontSize:'26px',
                            marginLeft:'-2px'
                        },
                        tooltip:'手机'
                    },
                    {
                        icon:'icon-junshi',
                        link:'/news/army',
                        tooltip:'军事',
                        style:{
                            marginLeft:'-2px'
                        }
                    }
                ]
            }
        }
    }
</script>