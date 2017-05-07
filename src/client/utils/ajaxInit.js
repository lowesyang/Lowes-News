import Vue from "vue";
import Promise from "es6-promise";
import axios from "axios";
import Bridge from "../common/bridge";
import {LS,setHttpHeaders} from "../utils";

window.Promise=Promise;

axios.default.timeout=30*1000;  //30s timeout
setHttpHeaders("access-token",LS.getItem("ggsimida")||"");
axios.interceptors.response.use((response)=>{
    if(response.data.code==-1){
        //验证失败
        Vue.toasted.error(response.data.msg);
    }
    return response;

},(err)=>{
    if(err.response.status === 500){
        Vue.toasted.error("服务器向你丢来一个错误!");
    }
    // token invalid
    if(err.response.status === 401) {
        Bridge.$emit("logout");
    }
    return Promise.reject(err);
});

