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
        <router-link to="/cart">第一种方式：跳转到购物车界面</router-link>
        <p class="link" v-on:click="jump">第二种方式：跳转到购物车界面</p>
        <router-link v-bind:to="{name: 'cart', params: {cartsId: 123}}">第三种方式：跳转到购物车界面</router-link>
    </div>
</template>

<script>
    export default {
        methods: {
            jump() {
                this.$router.push('/cart?goodsId=123');
            }
        }
    }
</script>

<style scoped>
.link{
    cursor: pointer;
    color: #48a8ee;
}
.title, .image{
    float: left;
}
</style>