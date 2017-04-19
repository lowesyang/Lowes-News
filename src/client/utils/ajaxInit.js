import Vue from "vue";
import Promise from "es6-promise";
import axios from "axios";
import Bridge from "../common/bridge";
import {LS,setHttpHeaders} from "../utils";

window.Promise=Promise;

axios.default.timeout=30*1000;  //20s timeout
setHttpHeaders("access-token",LS.getItem("ggsimida")||"");
axios.interceptors.response.use((response)=>{
    if(response.status==500
        || response.data.code==-1){
        //验证失败
        Vue.toasted.error(response.data.msg || "服务器向你丢来一个错误!");
    }
    // token invalid
    if(response.status==401) {
        Vue.toasted.error("token失效，请重新登录!");
        Bridge.$emit("logout");
    }

    return response;

},(err)=>{
    Vue.toasted.error(err.toString());
    return Promise.reject(err);
});

