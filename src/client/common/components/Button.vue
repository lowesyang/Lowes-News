<template>
    <button
        :type="type"
        @click="handleClick"
    >
        <slot></slot>
    </button>
</template>

<style scoped>
    button{
        width: 70px;
        height:30px;
        border:0;
        cursor:pointer;
        background-color: #333438;
        color:#f5f7f9;
        border-radius:2px;
        -webkit-transition: background-color 0.3s;
        -moz-transition: background-color 0.3s;
        -ms-transition: background-color 0.3s;
        -o-transition: background-color 0.3s;
        transition: background-color 0.3s;
    }
    button:hover{
        background-color: #4c4e54;
    }
</style>

<script>
    export default{
        props:{
            type:{
                type:String,
                default:"submit"
            },
            disabled:Boolean,
        },
        methods:{
            handleClick(evt){
                this.$emit("click",evt);
            }
        }
    }
</script>