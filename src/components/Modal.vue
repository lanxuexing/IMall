<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition md-show" v-if="show">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">
            <slot name="title"></slot>
          </div>
          <button class="md-close" @click="dismiss">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="action"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="show" @click="dismiss"></div>
  </div>
</template>

<script>
export default {
  props: ["show"],
  methods: {
    dismiss() {
      this.$emit('dismiss');
    }
  }
};
</script>

<style scoped>
</style>