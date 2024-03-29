<template>
  <div 
    class="sort"
    @mouseenter="open = true"
    @mouseleave="open = false"
  >
    <div class="sort_header">
      <button>
        {{ title }}
        <span
          :class="{
            active: open,
          }"
        >
          <IconBase
            class="icon"
            width="8"
            height="14"
            viewBox="0 0 8 14"
            icon-name="open"
            icon-color="#63517A"
          >
            <IconRight />
          </IconBase>
        </span>
      </button>
    </div>
    <div
      class="sort_body"
      :class="{
        active: open,
      }"
    >
      <ul class="sort_overlay">
        <li v-for="(i, idx) in items" :key="idx">
          <button
            @click.prevent="
              open = false;
              selectElement(i);
            "
            :class="{ active: i.active }"
          >
            {{ i.title }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import IconRight from "@/components/icons/iconRight";
export default {
  props: {
    title: { type: String },
    items: { type: Array },
  },
  components: {
    IconBase,
    IconRight,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    selectElement(val) {
      this.$emit("selectElement", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.sort {
  &_header {
    display: flex;
    align-items: flex-start;
    & > button {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      color: $websiteViolet;
      padding: 15px 20px 15px 0;
      border-radius: 40px;
      white-space: nowrap;
      span {
        position: relative;
        width: 15px;
        height: 15px;
        margin-left: 5px;
        .icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-origin: center;
          @include transition();
        }
        &.active {
          .icon {
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      }
    }
    .selected_filters {
      display: flex;
      flex-wrap: wrap;
      & > button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
        background-color: $websiteViolet;
        box-shadow: 0 5px 5px rgba($color: $websiteViolet, $alpha: 0.2);
        color: #fff;
        padding: 8px 15px;
        margin: 5px;
        border-radius: 20px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 15px;
          height: 15px;
          margin-left: 5px;
          img {
            width: 10px;
            transform: rotate(45deg);
          }
        }
      }
    }
  }
  &_body {
    position: absolute;
    top: 50px;
    transform: translateY(0);
    width: 100%;
    max-width: 285px;
    background: #fff;
    padding: 10px 0;
    border: 1px solid $fieldBorderColor;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 18px;
    padding-right: 4px;
    visibility: hidden;
    opacity: 0;
    @include transition();
    &.active {
      visibility: visible;
      opacity: 1;
    }
  }
  &_overlay {
    max-height: 150px;
    overflow: hidden;
    overflow-y: auto;
  }
  ul {
    width: 100%;
    li {
      button {
        width: 100%;
        padding: 8px 20px;
        color: $violet;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.2;
        background: #fff;
        transition: all 0.3s ease-in-out;
        text-align: left;
        &:hover,
        &.active {
          background: $violetLight;
          color: #fff;
        }
      }
    }
  }
}
</style>