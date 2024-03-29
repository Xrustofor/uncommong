<template>
  <div 
    @mouseenter="visible = items && !hidden ? true : false"
    @mouseleave="visible = false"
  >
    <div
      v-if="simpleView"
      class="dots"
      :class="dotsClass"
    >
      <span v-for="i in 3" :key="i"></span>
    </div>
    <div v-else>
      <button 
        @click="items ? (visible = true) : $emit('viewItem')"
        :disabled="viewItemHidden"
      >
        <slot></slot>
      </button>
    </div>

    <ul 
      class="action_pop_up"
      :class="{ visible: visible }"
    >
      <li 
        v-for="i in items"
        :key="i.key"
        :class="{ hidden: i.hidden }"
      >
        <a 
          target="_blank" 
          :href="i.link"
          v-if="i.link"
        >{{ i.title }}</a>
        <a 
          v-else
          @click.prevent="$emit('action', i.key)"
        >{{ i.title }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    hidden: { type: [Boolean, String], default: false },
    items: { type: Array },
    dotsClass: { type: String, required: false },
    simpleView: { type: Boolean, default: true },
    viewItemHidden: { type: Boolean, default: false },
    overlayClientRect: { type: [DOMRect, Object] },
  },
  data() {
    return {
      visible: false,
    }
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
div {
  position: relative;
}
.dots {
  display: flex;
  cursor: pointer;
  padding: 10px 0;
  &.disabled {
    opacity: 0.5;
    cursor: default;
  }
  span {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: $violet;
    margin: 0 3px;
  }
  &_vertical {
    flex-direction: column;
    padding: 5px;
    span {
      margin: 1px 0;
    }
  }
}
ul {
  min-width: 185px;
  max-width: 185px;
  border-radius: 20px;
  border: 1px solid #c4c4c4;
  background-color: #fff;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px !important;
  padding: 10px;
  z-index: 2;
  li {
    &.hidden {
      display: none;
    }
    a {
      display: block;
      padding: 12px 15px;
      font-size: 14px;
      font-weight: 600;
      background-color: #fff;
      cursor: pointer;
      border-radius: 2px;
      @include transition();
      &:hover {
        background-color: #f2eef9;
      }
    }
  }
}

.left {
  .action_pop_up {
    transform: translate(0, 0);
    right: 0;
  }
}
.right {
  .action_pop_up {
    right: -2px;
  }
}

.action_pop_up {
  position: absolute;
  right: 30px;
  top: 20px;
  transform: translate(100%, 0);
  visibility: hidden;
  opacity: 0;
  max-height: 0;
  @include transition();
  &.visible {
    visibility: visible;
    opacity: 1;
    max-height: 500px;
  }
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>