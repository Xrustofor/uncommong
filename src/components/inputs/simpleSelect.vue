<template>
  <div class="select_wrap" ref="selectInput">
    <span class="label">{{ label }}</span>
    <div
      class="select"
      :style="`height:${height}px`"
      @click="showMenu = !showMenu"
    >
      {{ select }}
      <icon-base
        class="icon"
        width="15"
        height="15"
        icon-name="chevron-botto"
        icon-color="#A098AB"
      >
        <icon-chevron-bottom />
      </icon-base>
      <div
        class="menu_wrap"
        :class="showMenu ? 'active' : ''"
        :style="`${positionMenu}: 100%`"
      >
        <ul class="menu" ref="selectMenu">
          <li v-for="(item, key) in items" :key="key" @click="selection(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconChevronBottom from "@/components/icons/iconChevronBottom";

export default {
  props: {
    label: String,
    items: Array,
    height: {
      type: [Number, String],
      default: 25,
    },
    value: [Number, String],
  },
  components: {
    IconBase,
    iconChevronBottom,
  },
  data: () => ({
    select: {
      type: Number,
      default: 10,
    },
    showMenu: false,
    positionMenu: String,
  }),

  beforeUpdate(){
    const heightMenu = this.$refs.selectMenu.offsetHeight;
    const positionSelect = Math.ceil(
      this.$refs.selectInput.getBoundingClientRect().bottom
    );
    const heightWindows = document.body.clientHeight;

    if (+heightWindows - +positionSelect > heightMenu) {
      this.positionMenu = "top";
    } else {
      this.positionMenu = "bottom";
    }
  },
  mounted() {
    if (this.value) {
      this.select = this.value;
    }
  },

  watch: {
    value(val) {
      this.select = val;
    },
  },

  methods: {
    selection(val) {
      this.$emit("selection", val);
      this.$emit("input", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.select_wrap {
  display: flex;
  align-items: center;
  color: #a098ab;
  font-weight: 600;
  .label {
    padding: 0 10px 0 0;
    font-weight: normal;
  }
  .select {
    background: #ffffff;
    border: 1px solid #a098ab;
    border-radius: 28px;
    min-width: 60px;
    display: flex;
    align-items: center;
    padding: 0 25px 0 10px;
    position: relative;
    cursor: pointer;
    .icon {
      position: absolute;
      right: 5px;
      top: 2px;
    }
    .menu_wrap {
      height: 0;
      overflow: hidden;
      position: absolute;
      z-index: 1;
      left: 0;
      min-width: 60px;
      border-radius: 8px;
      margin: 10px 0;
      box-shadow: 3px 10px 120px -2px rgba(154, 131, 183, 0.3);
      &.active {
        height: auto;
      }
    }
    .menu {
      text-align: center;
    }
    li {
      background: #ffffff;
      padding: 4px 0;
      transition: all 0.3s;
      cursor: pointer;
      &:hover {
        background: #f9f8fb;
        transition: all 0.3s;
      }
    }
  }
}
</style>