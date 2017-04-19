<template>
    <div class="footer">
        <div class="container">
            <a href="https://github.com/yyh1102/Lowes-News" target="_blank">
                <i class="iconfont icon-github"></i>
            </a>
            <div class="power">Powered by LowesYang</div>
        </div>
    </div>
</template>

<style scoped>
    .footer{
        width:100%;
        background-color: #464c5b;
        height:70px;
        color:#f5f7f9;
    }
    .container{
        padding-top:2px;
    }
    a{
        color:inherit;
    }
    .icon-github{
        font-size:36px;
        cursor: pointer;
        -webkit-transition: color 0.3s;
        -moz-transition: color 0.3s;
        -ms-transition: color 0.3s;
        -o-transition: color 0.3s;
        transition: color 0.3s;
    }
    .icon-github:hover{
        color:#9ea7b4;
    }
    .power{
        font-size:12px;
        margin-top:4px;
    }
</style>

<script>
    export default{
    }
</script>