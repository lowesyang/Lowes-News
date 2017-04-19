<template>
    <input
        ref="input"
        :type="type"
        :value="currValue"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
    >
</template>

<style scoped>
    input{
        margin:5px;
        padding:6px 8px;
        border:0;
        border-bottom:1px solid #d7dde4;
        -webkit-transition: border-color 0.3s;
        -moz-transition: border-color 0.3s;
        -ms-transition: border-color 0.3s;
        -o-transition: border-color 0.3s;
        transition: border-color 0.3s;
    }
    input:focus{
        border-color: #657180;
    }
</style>

<script>
    export default{
        data(){
            return {
                currValue:this.value
            }
        },
        props:{
            type:{
                type:String,
                default:"text"
            },
            value:[String,Number],
            placeholder:String,
            disabled: Boolean,
        },
        methods:{
            handleInput(e){
                let value=e.target.value;
                this.$emit('input',value);     //触发input事件，使v-model生效
                this.currValue=value;
                this.$emit('change',value);    //触发change事件
            }
        }
    }
</script>