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
            <svg class="icon icon-arrow-short">
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
              <dd @click="priceChecked = 'all';setPriceFilter(index)">
                <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == 'all'}">All</a>
              </dd>
              <dd v-for="(price, index) in priceFilter" :key="index" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
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
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <div class="loadding" v-show="!busy">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer/>
  </div>
</template>

<script>
import "../assets/css/base.css";
import "../assets/css/product.css";
import NavHeader from "@/components/NavHeader";
import NavBread from "@/components/NavBread";
import NavFooter from "@/components/NavFooter";
import axios from "axios";

export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [
          {
              startPrice: '0',
              endPrice: '100'
          },
          {
              startPrice: '100',
              endPrice: '500'
          },
          {
              startPrice: '500',
              endPrice: '1000'
          },
          {
              startPrice: '1000',
              endPrice: '5000'
          }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
    };
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) { // 获取商品列表
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      axios.get("/goods", {params: params}).then(response => {
        let res = response.data;
        if (res.status == '0') {
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
        this.getGoodsList();
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
    sortGoods() { // 排序
      this.sortFlag = !this.sortFlag;
      this.getGoodsList();
    },
    loadMore() { // 分页懒加载
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
        this.budy = false;
      }, 500);
    }
  }
};
</script>

<style scoped>
.load-more {
  position: relative;
}
</style>