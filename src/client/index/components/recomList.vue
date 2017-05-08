<!-- 推荐列表 -->
<template>
    <div class="recomList" v-if="isLogin">
        <h4>
            猜您喜欢
            <div class="changeRecom fr" @click="loadRecom(20)"><i class="iconfont icon-refresh" :class="{loading:isLoading}"></i>换一批</div>
        </h4>
        <Alert :hidden="isLoading">
            <span>{{alertMsg}}</span>
        </Alert>
        <div class="list">
            <a :href="'/p/'+item._id"  v-for="item in recomList" class="item" target="_blank">
                <div class="title" v-text="item.title"></div>
                <div class="intro" v-text="item.intro || item.title"></div>
            </a>
        </div>
    </div>
</template>

<style scoped>
    .recomList{
        margin-top:40px;
        background-color: #f4f5f6;
        padding:10px;
    }
    h4{
        color:#666870;
        border-bottom:1px solid #e3e8ee;
        padding-bottom:10px;
        margin:0;
    }
    .changeRecom{
        font-size:12px;
        margin-top:4px;
        color:#9ea7b4;
        cursor:pointer;
    }
    .changeRecom i{
        margin-right:5px;
    }
    .changeRecom .loading{
        display: inline-block;
        -webkit-animation:reloading 1s infinite linear;
        -o-animation:reloading 1s infinite linear;
        animation:reloading 1s infinite linear;
    }
    .list .notice{
        margin-top:10px;
        text-align: center;
        font-size:12px;
    }
    @keyframes reloading {
        0%{
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50%{
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100%{
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-moz-keyframes reloading {
        0%{
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50%{
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100%{
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-ms-keyframes reloading {
        0%{
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50%{
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100%{
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-o-keyframes reloading {
        0%{
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50%{
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100%{
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes reloading {
        0%{
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        50%{
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        100%{
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    .item{
        color:inherit;
        display: block;
        padding:10px 0;
        border-bottom: 1px solid #e3e8ee;
        letter-spacing:0.5px;
        -webkit-transition: border-color 0.3s;
        -moz-transition: border-color 0.3s;
        -ms-transition: border-color 0.3s;
        -o-transition: border-color 0.3s;
        transition: border-color 0.3s;
    }
    .item:hover{
        border-color:#cdd3da;
    }
    .list{
        padding:0 10px;
    }
    .item .title{
        color:#666870;
        font-size:14px;
        font-weight: 600;
    }
    .item .intro{
        font-size:12px;
        margin-top:5px;
    }
    .item .title,.item .intro{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<script>
    import {LS} from "../../utils";
    import Bridge from "../../common/bridge";
    import axios from "axios";
    import Alert from "../../common/components/Alert.vue";
    export default{
        data(){
            let userInfo=LS.getItem("userInfo");
            let token=LS.getItem("ggsimida");
            return {
                isLogin:!!token,
                recomList:[],
                isLoading:false,
                alertMsg:""
            }
        },
        created(){
            Bridge.$on("login",(token)=>{
                this.isLogin=!!token;
                this.loadRecom();
            });
            Bridge.$on("logout",()=>{
                this.isLogin=false;
            });
            this.loadRecom();
        },
        methods:{
            loadRecom(num = 20){
                if(this.isLoading || !this.isLogin) return;
                this.isLoading=true;
                let type=location.pathname.split('/')[2]||"";
                axios.get("/recom/list/"+type+"?num="+num).then((response)=>{
                    let res=response.data;
                    if(!res.code){
                        let data=[];
                        res.body.data.forEach((item)=>{
                            data.push(item.news)
                        });
                        // 更新token
                        LS.setItem("ggsimida",res.token);
                        this.recomList=data;
                        this.alertMsg=res.msg;
                    }
                    this.isLoading=false;
                }).catch(()=>{
                    this.isLoading=false;
                })
            }
        },
        components:{
            Alert
        }
    }
</script>