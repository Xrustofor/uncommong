<template>
  <transition name="fade" appear>
    <div class="modal_overlay" v-if="show">
      <div class="modal_overlay_background" @click="hideModal"></div>
      <transition name="pop" appear>
        <div class="modal" v-if="show">
          <div class="modal_content">
            <h4>{{ info.title }}</h4>
          </div>
          <div class="btn_overlay">
            <a
              href=""
              class="btn btn-yellow btn-small"
              @click.prevent="agree"
              >{{ info.yes }}</a
            >
            <a
              href=""
              class="btn btn-violte btn-small"
              @click.prevent="cancel"
              v-if="info.no != null"
              >{{ info.no }}</a
            >
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
export default {
  name: "modal-overlay",
  props: {
    info: {
      type: Object,
      default: {
        title: null,
        yes: null,
        no: null,
      },
    },
    showModal: {
      type: Boolean,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    showModal: function (newVal, oldVal) {
      this.show = newVal;
    },
  },
  methods: {
    hideModal($event) {
      this.$emit("hideModal", false);
      this.show = false;
    },
  },
};
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
  padding: 4rem;
  @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
    padding: 2rem;
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
    max-width: 400px;
    max-height: calc(100vh - 8rem);
    box-shadow: 0px 0px 20px rgba(154, 131, 183, 0.05),
      0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 10px;
    background: #fff;
    padding: 4rem;
    z-index: 999;
    @media only screen and (max-width: 1399px) {
      padding: 3rem;
    }
    @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
      max-height: calc(100vh - 4rem);
      padding: 2rem 2.5rem 2rem 2rem;
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