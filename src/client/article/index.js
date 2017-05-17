import Vue from "vue";
import "../common/css/normalize.css";
import "./article.css";
import headBar from "../common/components/headBar.vue";
import footBar from "../common/components/footBar.vue";
import {LS} from "../utils";
import axios from "axios";
import Promise from "es6-promise";
import "../serviceWorker";

window.Promise=Promise;
axios.default.timeout=30*1000;
new Vue({
    data(){
        let token=LS.getItem("ggsimida");
        return {
            isLogin:!!token,
            token:token
        }
    },
    mounted(){
        let pathArr=location.pathname.split("/");
        let pid=pathArr[pathArr.length-1];
        if(this.isLogin){
            axios.post(`/recom/save/${pid}`,{
                token:this.token
            })
        }
    },
    components:{
        headBar,
        footBar
    }
}).$mount("#article");