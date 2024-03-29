<template>
  <div class="pagination_wrap">
    <button
      class="icon_round"
      @click.prevent="prev"
      :disabled="this.activePage === 1"
    >
      <icon-base
        class="icon pre"
        width="20"
        height="20"
        icon-name="chevron-botto"
        :icon-color="this.activePage === 1 ? '#A098AB' : '#63517A'"
      >
        <icon-pre />
      </icon-base>
    </button>

    <span class="text_center">{{ activePage }}</span>

    <button
      class="icon_round"
      @click.prevent="next"
      :disabled="this.activePage === this.pages.length"
    >
      <icon-base
        class="icon next"
        width="20"
        height="20"
        icon-name="chevron-botto"
        :icon-color="
          this.activePage === this.pages.length ? '#A098AB' : '#63517A'
        "
      >
        <icon-next />
      </icon-base>
    </button>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconNext from "@/components/icons/iconNext";
import iconPre from "@/components/icons/iconPre";

export default {
  props: {
    pages: { type: Array },
  },
  components: {
    IconBase,
    iconPre,
    iconNext,
  },
  data() {
    return {
      activePage: 1,
    };
  },
  watch: {
    pages(val) {
      this.activePage = 1;
    },
  },
  methods: {
    prev() {
      this.activePage =
        this.activePage !== 1 ? this.activePage - 1 : this.activePage;
      this.$emit("paginationChange", this.activePage);
    },
    next() {
      this.activePage =
        this.activePage !== this.pages.length
          ? this.activePage + 1
          : this.activePage;
      this.$emit("paginationChange", this.activePage);
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination_wrap {
  display: flex;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  .text_center {
    margin: 0 10px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #63517a;
    text-align: center;
    font-size: 16px;
    min-width: 30px;
  }
  .icon_round {
    background: #f2eef9;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    position: relative;
    cursor: pointer;
    opacity: 0.8;
    transition: 0.3s all;
    &:disabled {
      cursor: default;
    }
    &:hover {
      opacity: 1;
      transition: 0.3s all;
    }
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      margin-top: 7px;
      &.pre {
        margin-left: 6px;
      }
      &.next {
        margin-left: 8px;
      }
    }
  }
}
</style>