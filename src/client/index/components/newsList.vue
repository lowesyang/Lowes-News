<template>
    <div>
        <div class="newsList">
            <a :href="'/p/'+item._id" target="_blank" v-for="item in extraList" :id="item._id">
                <div class="item">
                    <div class="infoBox fl">
                        <div class="title">{{item.title}}</div>
                        <div class="intro">{{item.intro || item.title}}</div>
                        <div class="bottomBox">
                            <div class="source fl">{{item.source}}</div>
                            <div class="time fl">{{item.time}}</div>
                        </div>
                    </div>
                <lazy-image class="image fr" :src="item.img"></lazy-image>
                </div>
            </a>
            <Pulse-loader :loading="loading" color="#657180" size="13px"></Pulse-loader>
        </div>
    </div>
</template>

<style scoped>
    .newsList{
        padding-top:0;
    }
    .v-spinner{
        margin-top:15px;
        text-align: center;
    }
</style>

<script>
    import axios from "axios";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    export default{
        data(){
            return {
                page:2,
                pcount:10,
                extraList:[],
                loading:false
            }
        },
        created(){
            if(this.checkToBottom() && !this.loading){
                this.loadExtra();
            }
            window.addEventListener("scroll",()=>{
                if(this.checkToBottom() && !this.loading){
                    this.loadExtra();
                }
            })
        },
        methods:{
            loadExtra(){
                let tarr=location.pathname.split('/');
                let type=tarr[2]|| "";
                this.loading=true;
                axios.get("/extra/news/"+type+"?p="+this.page+"&pcount="+this.pcount)
                    .then((response)=>{
                        let res=response.data;
                        if(res.code==0){
                            this.extraList=this.extraList.concat(res.body.news);
                            this.page++;
                        }
                        this.loading=false;
                    })
            },
            checkToBottom(){
                let scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
                let scrollH=document.documentElement.scrollHeight || document.body.scrollHeight;
                let clientH=document.documentElement.clientHeight||document.body.clientHeight;
                if(scrollTop + clientH + 60 > scrollH) return true;
                else return false;
            },
            getNoImgId(){
                return Math.floor(Math.random()*6+1);
            }
        },
        components:{
            PulseLoader
        }
    }
</script>