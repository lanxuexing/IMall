<template>
    <div>
        <p>这里是购物车界面!
            <span v-if="$route.query.goodsId">商品的ID：{{$route.query.goodsId}}</span>
            <span v-if="$route.params.cartsId">商品的ID：{{$route.params.cartsId}}</span>
        </p>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>