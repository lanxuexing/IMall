<template>
    <div>
        <p>这里是商品列表界面
            <span>{{$route.params.goodsId}}</span>
        </p>
        <div>
            <router-link to="/goods/title">显示标题</router-link>
            <router-link to="/goods/image">显示图片</router-link>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>