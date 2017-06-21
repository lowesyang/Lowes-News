import Vue from "vue";
import "../common/css/normalize.css";
import "./index.css";
import VueLazyImages from "vue-lazy-images";
import headBar from "../common/components/headBar.vue";
import newsList from "./components/newsList.vue";
import userBox from "./components/userBox.vue";
import recomList from "./components/recomList.vue";
import friendLink from "./components/friendLink.vue";
import Toasted from "vue-toasted";
import vmodal from "vue-js-modal";
import "../utils/ajaxInit";
import {cateToName} from "../utils";
import "../serviceWorker";

Vue.use(VueLazyImages);
Vue.use(Toasted,{
    position:"top-center",
    duration:3000
});
Vue.use(vmodal);
new Vue({
    data(){
        return {
            bigTitle:cateToName(location.pathname.split('/')[2])
        }
    },
    components:{
        headBar,
        newsList,
        userBox,
        recomList,
        friendLink
    }
}).$mount("#App");