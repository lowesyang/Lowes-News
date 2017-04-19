<template>
    <div class="friendLink">
        <h3>友情链接</h3>
        <div class="linkBox">
            <a :href="item.link" v-for="item in linkList" target="_blank">{{item.name}}</a>
        </div>
    </div>
</template>

<style scoped>
    .friendLink{
        margin-top:40px;
        font-size:14px;
        padding:20px;
        border-top:2px solid #464c5b;
        background-color: #f4f5f6;
        color:#657180
    }
    h3{
        margin:0;
        margin-bottom:15px;
        color:#464c5b;
    }
    a{
        display: inline-block;
        color:#657180;
        margin:5px 10px 5px 0px;
        font-size:12px;
    }
</style>

<script>
    export default{
        data(){
            return {
                linkList:[
                    {
                        name:"浙江大学",
                        link:"http://www.zju.edu.cn/"
                    },
                    {
                        name:"浙大计算机学院",
                        link:"http://www.cs.zju.edu.cn/"
                    },
                    {
                        name:"中国网",
                        link:"http://www.china.com.cn/"
                    },
                    {
                        name:"人民网",
                        link:"http://www.people.com.cn/"
                    },
                    {
                        name:"光明网",
                        link:"http://www.gmw.cn/"
                    },
                    {
                        name:"Bilibili",
                        link:"http://www.bilibili.com/"
                    },
                    {
                        name:"浙江在线",
                        link:"http://www.zjol.com.cn/"
                    },
                    {
                        name:"南方网",
                        link:"http://www.southcn.com/"
                    },
                    {
                        name:"新浪",
                        link:"http://www.sina.com.cn/"
                    },
                    {
                        name:"网易",
                        link:"http://www.163.com"
                    },
                    {
                        name:"中国搜索",
                        link:"http://123.chinaso.com/"
                    },
                    {
                        name:"每日经济新闻",
                        link:"http://www.nbd.com.cn/"
                    },
                    {
                        name:"北青网",
                        link:"http://www.ynet.com/"
                    },
                    {
                        name:"中国蓝TV",
                        link:"http://tv.cztv.com/"
                    }
                ]
            }
        }
    }
</script>