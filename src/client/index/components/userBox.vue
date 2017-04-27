<template>
    <div>
        <div class="userBox">
            <div class="beforeLogin" v-if="!isLogin">
                登录后，News更懂您!&nbsp;
                <a @click="showLogin">登录</a> /
                <a @click="showRegister">注册</a>
            </div>
            <div class="afterLogin" v-else>
                欢迎回来 <span class="userName" v-text="userInfo.username"></span>
                <a @click="logout">注销</a>
            </div>
            <modal name="loginModal" width="400" height="230">
                <h2>登录</h2>
                <form class="userForm">
                    <Input type="text" v-model="loginForm.username" placeholder="用户名" />
                    <Input type="password" v-model="loginForm.password" placeholder="密码" />
                    <Button type="submit" @click.stop.prevent="login">
                        <span v-show="!loading">登录</span>
                        <Pulse-loader :loading="loading" size="10px" color="#f5f7f9"></Pulse-loader>
                    </Button>
                </form>
            </modal>
            <modal name="registerModal" width="400" height="340">
                <h2>注册</h2>
                <form class="userForm">
                    <Input type="text" v-model="registerForm.username" placeholder="用户名" />
                    <Input type="text" v-model="registerForm.email" placeholder="电子邮箱" />
                    <Input type="password" v-model="registerForm.password" placeholder="密码" />
                    <Input type="password" v-model="registerForm.confirm" placeholder="确认密码" />
                    <Button type="submit" @click.stop.prevent="register">
                        <span v-show="!loading">注册</span>
                        <Pulse-loader :loading="loading" size="10px" color="#f5f7f9"></Pulse-loader>
                    </Button>
                </form>
            </modal>
        </div>
    </div>
</template>

<style scoped>
    .userBox{
        font-size:14px;
        text-align: center;
        margin-top:5px;
        padding:20px 0;
        border-top:2px solid #464c5b;
        background-color: #f4f5f6;
        color:#657180
    }
    h2{
        padding:10px 20px;
        margin:0;
        background-color: #464c5b;
        color:#f5f7f9;
    }
    .userBox a{
        cursor:pointer;
    }
    .userForm{
        width: 300px;
        margin:10px auto;
        text-align: center;
    }
    .userForm input{
        box-sizing:border-box;
        width:80%;
        margin-bottom:20px;
    }
    .userForm button{
        margin-top:5px;
        width:80%;
    }
    .userName{
        font-weight: bold;
        margin-right:20px;
    }
    .v-spinner{
        margin-top:3px;
    }
</style>

<script>
    import {LS} from "../../utils";
    import Input from "../../common/components/Input.vue";
    import Button from "../../common/components/Button.vue";
    import axios from "axios";
    import {setHttpHeaders} from "../../utils";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    import Bridge from "../../common/bridge";

    export default{
        data(){
            let token=LS.getItem("ggsimida");
            let userInfo=LS.getItem("userInfo");
            return {
                userInfo:userInfo||{},
                loginForm:{
                    username:"",
                    password:""
                },
                isLogin:!!token,
                registerForm:{
                    username:"",
                    password:"",
                    confirm:"",
                    email:""
                },
                postCD:5,        //发请求冷却时间
                setTm:null,      //setTimeout句柄
                loading:false
            }
        },
        created(){
            Bridge.$on("logout",()=>{
                LS.clear();
                this.isLogin=false;
            })
        },
        methods:{
            showLogin(){
                this.$modal.show("loginModal");
            },
            showRegister(){
                this.$modal.show("registerModal");
            },
            login(){
                this.loading=true;
                axios.post('/login',{
                    username:this.loginForm.username,
                    password:this.loginForm.password
                }).then((response)=>{
                    let res=response.data;
                    if(!res.code){
                        this.setUserInfo(res);
                    }
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
//                    this.setTm=setTimeout(()=>{
//                    },5000);
                })
            },
            register(){
                if(!this.verifyForm(this.registerForm)) return;
                if(this.registerForm.password!=this.registerForm.confirm){
                    return this.$toasted.error("两次密码输入不一致!")
                }
                this.loading=true;
                axios.post('/register',{
                    username:this.registerForm.username,
                    password:this.registerForm.password,
                    confirm:this.registerForm.confirm,
                    email:this.registerForm.email
                }).then((response)=>{
                    let res=response.data;
                    if(!res.code){
                        this.setUserInfo(res);
                    }
                    this.loading=false;
                }).catch(()=>{
                    this.loading=false;
                })
            },
            verifyForm(form){
                if(form.username && form.username.length<6){
                    this.$toasted.error("用户名长度须大于6位!");
                    return false;
                }
                if(form.username && form.username.length>25){
                    this.$toasted.error("用户名长度最长为25位!");
                    return false;
                }
                if(form.password && form.password.length<6){
                    this.$toasted.error("密码长度须大于6位!");
                    return false;
                }
                if(form.email && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-])+/.test(form.email)){
                    this.$toasted.error("电子邮箱格式不正确");
                    return false;
                }
                return true;
            },
            setUserInfo(res){
                LS.setItem("ggsimida",res.token);
                LS.setItem("userInfo",res.body);
                this.userInfo=res.body;
                this.$toasted.success(res.msg);
                setHttpHeaders("access-token",res.token);
                this.isLogin=true;
                this.$modal.hide("loginModal");
                this.$modal.hide("registerModal");

                Bridge.$emit("login",res.token);
            },
            logout(){
                LS.clear();
                this.isLogin=false;
                Bridge.$emit("logout");
            }
        },
        components:{
            Input,
            Button,
            PulseLoader
        }
    }
</script>