<template>
  <div class="filtration" @mouseleave="filter_open = false">
    <div class="filtration_header">
      <button @mouseenter="filtrationOpen">
        {{ title }}
        <span
          :class="{
            active: filter_open,
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
      <div class="selected_filters" v-if="selectedItems || selectedSort">
        <button
          v-for="sort in selectedSort"
          :key="sort.title"
          @click.prevent="removeSort(sort)"
        >
          {{ sort.title }}
        </button>
        <button
          v-for="(i, idx) in selectedItems"
          :key="idx"
          @click.prevent="removeFilter(i)"
        >
          {{ i.title }}
          <span class="icon">
            <img :src="require(`@/assets/img/add.svg`)" alt="logo" />
          </span>
        </button>
      </div>
    </div>
    <div
      class="filtration_body"
      :class="{
        active: filter_open,
      }"
    >
      <div>
        <slot name="sort"></slot>
      </div>
      <div class="filtration_overlay">
        <button
          v-for="(i, idx) in items"
          :key="idx"
          @click.prevent="selectFilter(i)"
        >
          {{ i.title }} ({{ i.count }})
          <span class="icon">
            <img :src="require(`@/assets/img/add.svg`)" alt="logo" />
          </span>
        </button>
      </div>
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
    selectedItems: { type: Array },
    selectedSort: { type: Array },
  },
  components: {
    IconBase,
    IconRight,
  },
  data() {
    return {
      filter_open: false,
    };
  },
  methods: {
    filtrationOpen() {
      this.filter_open = !this.filter_open;
    },
    selectFilter(val) {
      this.$emit("selectFilter", val);
    },
    removeSort(val) {
      this.$emit("removeSort", val);
    },
    removeFilter(val) {
      this.$emit("removeFilter", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.filtration {
  padding: 5px 0;
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
    background: #fff;
    padding: 20px 25px 0;
    border: 1px solid $fieldBorderColor;
    border-radius: 3px;
    @include transition();
    visibility: hidden;
    @media (max-width: 425px) {
      padding: 20px 15px 0;
    }
    opacity: 0;
    &.active {
      visibility: visible;
      opacity: 1;
    }
  }
  &_overlay {
    width: calc(100% + 12.5px);
    margin-left: -12.5px;
    display: flex;
    flex-wrap: wrap;
    button {
      display: flex;
      align-items: center;
      min-width: 150px;
      padding: 0 15px;
      height: 36px;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin: 0 12.5px 20px;
      border-radius: 30px;
      background: $violetLight;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        margin-left: 5px;
        img {
          width: 10px;
        }
      }
      &:hover {
        background: $websiteViolet;
      }
    }
  }
}
</style>