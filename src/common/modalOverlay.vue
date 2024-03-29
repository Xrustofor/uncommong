<template>
  <transition name="fade" appear>
    <div class="modal_overlay" v-if="show">
      <div class="modal_overlay_background" @click="hideConfirm"></div>
      <transition name="pop" appear>
        <div class="modal" v-if="show">
          <span @click="hideConfirm" class="close">
            <img :src="require(`@/assets/img/close.svg`)" class="close" alt="logo" />
          </span>
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'modal-overlay',
  props: {
    showModal: {
      type: Boolean,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  watch: {
    showModal: function (newVal, oldVal) {
      this.show = newVal;
    },
  },
  computed: {
    ...mapGetters({
      somethingChanged: 'getSomethingChanged',
    }),
  },
  methods: {
    ...mapActions(['setSomethingChanged']),
    hideConfirm() {
      if (!this.somethingChanged) {
        this.hideModal();
      } else {
        const answer = window.confirm('Do you want to leave? You have unsaved changes!');
        if (answer) {
          this.hideModal();
          this.setSomethingChanged(false);
        }
      }
    },
    hideModal() {
      const body = document.body;
      const scrollY = body.style.top;
      body.style.position = '';
      body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);

      this.$emit('hideModal', false);
      this.show = false;
    },
  },
}
</script>
<style lang="scss" scoped>
.modal_overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed !important;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: #fbfbfb;
  opacity: 1;
  &.bg-black {
    background: rgba($color: #000000, $alpha: 0.4);
  }
  &_background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    cursor: pointer;
  }
  .modal {
    position: relative;
    width: 100%;
    width: 830px;
    max-width: 90vw;
    max-height: calc(100vh - 8rem);
    box-shadow: 0px 0px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 16px;
    background: #fff;
    z-index: 999;
    padding: 4rem 3rem 4rem 4rem;
    overflow: hidden;
    @media only screen and (max-width: 1399px) {
      padding: 3rem;
    }
    @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
      max-height: calc(100vh - 4rem);
      padding: 2rem 2rem 2rem 1.5rem;
    }
    span.close {
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
      border: 1px solid #f3f3f3;
      border-radius: 8px;
      @media only screen and (max-width: 1399px) {
        width: 30px;
        height: 30px;
      }
      @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
        right: 13px;
        top: 13px;
      }
      img {
        width: 30px;
      }
    }
  }
  &.small {
    .modal {
      max-width: 550px;
      width: 540px;
    }
  }
  &.auto_width {
    .modal {
      width: auto;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-to {
  transition-delay: 0.3s;
}

.pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}
.pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.2s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-50%, -50%);
}
</style>