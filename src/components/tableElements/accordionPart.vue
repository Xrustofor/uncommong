<template>
  <transition
    name="accordion-item"
    @enter="startTransition"
    @after-enter="endTransition"
    @before-leave="startTransition"
    @after-leave="endTransition"
  >
    <div class="accordion" v-if="className">
      <div
        class="row_content"
        v-for="(element, idx) in accordionContent"
        :key="idx"
      >
        <div class="accordion_content">
          <div
            class="col"
            v-for="(el, index) in columnNames"
            :key="`header-${index}`"
            :class="el.class ? el.class : el.image ? 'image' : ''"
          >
            <p>{{ element[el.key] }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    className: { type: Boolean, default: false },
    columnNames: { type: Array },
    accordionContent: { type: Array },
  },
  methods: {
    startTransition(el) {
      el.style.height = el.scrollHeight + "px";
    },
    endTransition(el) {
      el.style.height = "";
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin color($color1) {
  color: $color1;
  background: rgba($color: $color1, $alpha: 0.2);
  border-color: rgba($color: $color1, $alpha: 0.5);
}
.row_content {
  border-top: 1px solid $violetBorder;
  &:last-of-type {
    border-bottom: none;
  }
}
.accordion_content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  transition: all 0.2s;
  &:hover {
    transition: all 0.2s;
    background: #f9f8fb;
  }
  p {
    color: $violet;
    cursor: default;
  }
  .col {
    display: flex;
    align-items: center;
    position: relative;
    padding: 15px;
    flex: 1;
    min-width: 200px;
    box-sizing: content-box;
    & > div {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &.small {
      min-width: 25px;
      max-width: 25px;
      flex: 0.4;
    }
    &.medium {
      min-width: 40px;
      max-width: 40px;
      flex: 0.5;
    }
    &.image {
      min-width: 50px;
      max-width: 50px;
      flex: 0.4;
      padding: 10px 0 10px 10px;
      margin-right: -5px;
      .image {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: $violetBorder;
        background-size: cover;
        background-position: center;
      }
    }
    &:last-child {
      padding-right: 0;
    }
  }
}

.accordion {
  overflow: hidden;
}
.accordion-item-enter-active,
.accordion-item-leave-active {
  will-change: height;
  transition: height 0.2s ease;
}
.accordion-item-enter,
.accordion-item-leave-to {
  height: 0 !important;
}
</style>