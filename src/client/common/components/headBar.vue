<template>
    <div class="header">
        <div class="container">
            <div class="logoBox">
                <div class="logo">Lowes-News</div>
                <!--<div class="category fl">{{category}}</div>-->
            </div>
            <div class="navbar">
                <a :href="item.link"
                   target="_blank"
                   v-for="item in linkList"
                   :class="{'active':item.tooltip === category}"
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
        background-color: #333438;
        width:100%;
        height:50px;
        z-index:10;
        top:0;
    }
    .logoBox{
        color:#f5f7f9;
        font-size:28px;
        margin:10px;
        float:left;
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
        margin-top:6px;
        float:right;
    }
    .navbar a{
        display: inline-block;
        color:#f5f7f9;
        margin-right:15px;
        padding:5px 8px;
        border-radius:2px;
    }
    .navbar a:last-child{
        margin-right:0;
    }
    .navbar i{
        font-size:22px;
        cursor: pointer;
    }
    .active{
        background-color: #f5f7f9;
        color:#333438!important;
    }

    @media screen and (max-width:450px){
        .header{
            height:60px;
        }
        .logoBox{
            float:none;
            text-align: center;
            font-size:1.4rem;
            margin:5px;
        }
        .navbar{
            margin:0;
            width:100%;
            float: none;
            overflow-x:auto;
            white-space: nowrap;
            background-color:#44464b;
        }
        .navbar a{
            border-radius:0;
            margin-right:5px;
            padding:5px 12px;
        }
        .active{
            background-color: white;
        }
    }
</style>

<script>
    import Vue from "vue";
    import {cateToName} from "../../utils";
    import VTooltip from "v-tooltip";
    Vue.use(VTooltip);

    export default{
        data(){
            let catePath=location.pathname.split('/')[2]||"",category="";
            if(!catePath.match(/\d+/)){
                category=cateToName(catePath);
            }
            return {
                category:category,
                linkList:[
                    {
                        icon:'icon-icon05',
                        link:'/',
                        tooltip:'头条'
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
                            fontSize:'24px',
                        },
                        tooltip:'娱乐'
                    },
                    {
                        icon:'icon-94',
                        link:'/news/game',
                        style:{
                            fontSize:'24px',
                        },
                        tooltip:'游戏'
                    },
                    {
                        icon:'icon-shouji2',
                        link:'/news/phone',
                        style:{
                            fontSize:'24px',
                        },
                        tooltip:'手机'
                    },
                    {
                        icon:'icon-junshi',
                        link:'/news/army',
                        tooltip:'军事',
                    }
                ]
            }
        }
    }
</script>