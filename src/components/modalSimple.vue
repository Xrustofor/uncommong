<template>
  <transition name="fade" appear>
    <div
      class="modal"
      v-show="isVisible"
      :style="{ backgroundColor: bgColor }"
      @click.self="$emit('close')"
    >
      <transition name="pop" appear>
        <div class="modal__content" v-show="isVisible">
          <span @click="$emit('close')" class="modal__close">
            <img :src="require(`@/assets/img/close.svg`)" alt="logo" />
          </span>

          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import IconBase from '@/components/IconBase';
import IconClose from '@/components/icons/iconClose';
export default {
  name: 'ModalSimple',
  components: { IconClose, IconBase },
  props: {
    bgColor: {
      type: String,
      default: '#fbfbfb',
    },
    isVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  padding: 40px 50px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;

  &__content {
    position: relative;
    min-width: 300px;
    min-height: 200px;
    box-shadow: 0px 0px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 16px;
    background: $white;
    padding: 30px 20px 20px;
    overflow-y: auto;
  }

  &__close {
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
  @media (max-width: $sm) {
    padding: 40px 20px;
  }
}
.max830 .modal__content {
  max-width: 830px;
  width: 100%;
}
.max1200 .modal__content {
  max-width: 1200px;
  width: 100%;
}
.max-700 .modal__content {
  max-width: 700px;
  width: 100%;
}
.max-600 .modal__content {
  max-width: 700px;
  width: 100%;
}
.padding-50 .modal__content {
  padding-right: 50px;
  padding-left: 50px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
