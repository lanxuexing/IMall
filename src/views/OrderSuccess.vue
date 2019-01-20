<template>
  <div>
    <nav-header/>
    <nav-bread>
      <!-- 第一种方式 -->
      <span>OrderSuccess</span>
      <!-- 第二种方式 -->
      <!-- <span slot="bread">Goods</span> -->
    </nav-bread>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2">
          <span>check out</span>
        </h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur">
            <span>Confirm</span> address
          </li>
          <li class="cur">
            <span>View your</span> order
          </li>
          <li class="cur">
            <span>Make</span> payment
          </li>
          <li class="cur">
            <span>Order</span> confirmation
          </li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic">
          <img src="/static/ok-2.png" alt>
        </div>
        <div class="order-create-main">
          <h3>Congratulations!
            <br>Your order is under processing!
          </h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal | currency('¥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <a href="javascript:;" class="btn btn--m">Cart List</a>
            </div>
            <div class="btn-r-wrap">
              <a href="javascript:;" class="btn btn--m">Goods List</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer/>
  </div>
</template>

<script>
import "./../assets/css/checkout.css";
import NavHeader from "@/components/NavHeader";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";
import NavFooter from "@/components/NavFooter";
import axios from "axios";
export default {
  data() {
    return {
      orderId: '',
      orderTotal: 0
    };
  },
  mounted() {
    this.init();
  },
  components: {
    NavHeader,
    NavBread,
    Modal,
    NavFooter
  },
  methods: {
    init() {
      const orderId = this.$route.query.orderId;
      if (!orderId) {
        return;
      }
      const params = {orderId: orderId};
      axios.get("/users/orderDetail", {params: params}).then(response => {
        const res = response.data;
        if (res.status == "0") {
          console.log(res.result);
          this.orderId = orderId;
          this.orderTotal = res.result.orderTotal;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>