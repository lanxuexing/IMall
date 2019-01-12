<template>
  <div>
    <nav-header/>
    <nav-bread>
      <!-- 第一种方式 -->
      <span>Goods</span>
      <!-- 第二种方式 -->
      <!-- <span slot="bread">Goods</span> -->
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon-arrow-short">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="priceChecked = 'all';setPriceFilter('all')">
                <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == 'all'}">All</a>
              </dd>
              <dd v-for="(price, index) in priceFilter" :key="index" @click="setPriceFilter(index)">
                <a
                  href="javascript:void(0)"
                  v-bind:class="{'cur': priceChecked == index}"
                >{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'static/'+item.productImage" :key="item.productImage" alt>
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">¥{{item.salePrice}}</div>
                    <div class="btn-area" @click="addCart(item.productId)">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="load-more"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <!-- css动画 -->
                <!-- <div class="loadding" v-show="!busy">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>-->
                <!-- svg动画 -->
                <div class="loadding" v-show="loadding">
                  <img src="./../assets/loading-spinning-bubbles.svg" alt>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal v-bind:show="modalShow" v-on:dismiss="closeModal">
      <p slot="message">
        <span>您还未登录，无法加入到购物车，请先登录</span>
      </p>
      <div slot="action">
        <a href="javascript:void(0);" class="btn btn--m" @click="modalShow = false">关闭</a>
      </div>
    </modal>
    <modal v-bind:show="modalShowCart" v-on:dismiss="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="action">
        <a href="javascript:void(0);" class="btn btn--m" @click="modalShowCart = false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:void(0);" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer/>
  </div>
</template>

<script>
import "../assets/css/base.css";
import "../assets/css/product.css";
import NavHeader from "@/components/NavHeader";
import NavBread from "@/components/NavBread";
import Modal from "@/components/Modal";
import NavFooter from "@/components/NavFooter";
import axios from "axios";

export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: "0",
          endPrice: "100"
        },
        {
          startPrice: "100",
          endPrice: "500"
        },
        {
          startPrice: "500",
          endPrice: "1000"
        },
        {
          startPrice: "1000",
          endPrice: "5000"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
      loadding: false,
      modalShow: false,
      modalShowCart: false
    };
  },
  components: {
    NavHeader,
    NavBread,
    Modal,
    NavFooter
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    getGoodsList(flag) {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.loadding = true;
      axios.get("/goods/list", { params: params }).then(response => {
        this.loadding = false;
        let res = response.data;
        if (res.status == "0") {
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list);
            if (res.result.count < 8) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.list;
            this.budy = false;
          }
        } else {
          this.goodsList = [];
        }
      });
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList(index == "all" ? true : false, true);
      if (index == "all") {
        this.goodsList = [];
      }
      this.closePop();
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    // 排序
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.getGoodsList();
    },
    // 分页懒加载
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
        this.budy = false;
      }, 500);
    },
    // 加入购物车
    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(response => {
          const res = response.data;
          if (res.status == 0) {
            this.modalShow = false;
            this.modalShowCart = true;
          } else {
            this.modalShow = true;
          }
        });
    },
    // 关闭弹出框
    closeModal() {
      this.modalShow = false;
      this.modalShowCart = false;
    },
    // 对象数组去重复
    arrayToHeavy(data) {
      let hash = {};
      return data.reduce((preVal, curVal) => {
        hash[curVal.productId]
          ? ""
          : (hash[curVal.productId] = true && preVal.push(curVal));
        return preVal;
      }, []);
    }
  }
};
</script>

<style scoped>
.load-more {
  position: relative;
}
</style>