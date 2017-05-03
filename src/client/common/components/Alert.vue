<template>
    <div class="alert" :class="{hidden:hidden}">
        <div class="msgAlert" :class="type">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .alert{
        width:100%;
        height:32px;
        line-height:30px;
        -webkit-transition: height 0.3s;
        -moz-transition: height 0.3s;
        -ms-transition: height 0.3s;
        -o-transition: height 0.3s;
        transition: height 0.3s;
        color:#657180;
        overflow: hidden;
    }
    .hidden{
        height:0;
    }
    .msgAlert{
        text-align: center;
        font-size:12px;
        border-radius: 2px;
    }
    .normal{
        border:1px solid #d6ebff;
        background-color: #ebf5ff;
    }
    .warning{
        border:1px solid #ffebcc;
        background-color: #fff5e6;
    }
</style>

<script>
    export default{
        data(){
            return{
                setTm:null
            }
        },
        props:{
            type:{
                type:String,
                default:"normal"
            },
            hidden:Boolean
        },
        mounted(){
            if(!this.hidden) {
                this.delayHidden();
            }
        },
        watch:{
            hidden:function(val,oldVal){
                if(val==false) {
                    this.delayHidden();
                }
            }
        },
        methods:{
            delayHidden(){
                this.setTm && clearTimeout(this.setTm);
                this.setTm=setTimeout(()=>{
                    this.hidden=true;
                    this.setTm=null;
                },5000);
            }
        }
    }
</script>