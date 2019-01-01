<template>
    <div>
        <button @click="increment">+</button>
        <button v-on:click="decrement">-</button>
        <p>{{number}}</p>
    </div>
</template>

<script>
    export default {
        props: [
            'number'
        ],
        data() {
            return {
                
            }
        },
        methods: {
            increment() {
                this.$emit('incre');
            },
            decrement() {
                this.$emit('decre');
            }
        }
    }
</script>

<style scoped>

</style>