<template>
  <div class="tabs-container">
    <div class="tabs-container__tabs">
      <div
        class="tab"
        v-for="(tab, index) in tabsLocal"
        :key="tab.key"
        :class="[
          { 'tab--active': tab.isActive },
          { 'tab--divider': index > 0 },
          { 'tab--hidden': tab.isHidden },
          { 'tab--single': tabsLocal.length === 1 },
        ]"
        @click="toggleTab(tab.key)"
        v-show="!tab.isHidden"
      >
        {{tab.title}}
      </div>
    </div>
    <div
      class="tabs-container__container"
      v-for="slot in tabsLocal"
      :key="slot.key"
      v-show="slot.isActive"
    >
      <slot :name="slot.key"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [
        { title: 'tab one', key: 'tab-1', isActive: true, isHidden: false },
        { title: 'tab two', key: 'tab-2', isActive: false, isHidden: false },
      ],
      required: true,
    },
  },
  data() {
    return {
      tabsLocal: this.calculateSingle(this.tabs),
    }
  },
  watch: {
    tabs(val) {
      this.tabsLocal = this.calculateSingle(val)
    },
  },
  methods: {
    calculateSingle(array) {
      return array.filter((tab) => {
        return !tab.isHidden
      })
    },
    toggleTab(key) {
      this.tabsLocal.forEach((tab) => {
        tab.isActive = tab.key === key
      });
       this.$emit('selectTab', key);
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs-container {
  &__tabs {
    display: flex;

    .tab {
      flex: 1;
      padding: 15px;
      text-align: center;
      border-radius: 20px 20px 0px 0px;
      box-shadow: 0px 0px 10px rgba(#c4c4c4, 0.5);
      border: 1px solid #c4c4c4;
      background-color: $white;
      font-weight: bold;
      font-size: $fs4;
      line-height: $lh4;
      color: #c4c4c4;
      cursor: pointer;
    }
    .tab--active {
      background-color: $violet;
      color: $white;
    }
    &--single {
      cursor: default;
    }

    @media (max-width: $md) {
      .tab {
        font-size: $fs3;
        line-height: $lh3;
      }
      .tab--single {
        font-size: $fs4;
        line-height: $lh4;
      }
    }
  }

  &__container {
    background-color: #fff;
    padding: 45px;
    border-radius: 0px 0px 20px 20px;
    box-shadow: 0px 0px 10px #c4c4c4;

    @media (max-width: $md) {
      padding: 40px 20px;
    }
  }
}

.empty {
  .tabs-container__tabs {
    .tab {
      background-color: transparent;
      color: $violet;
      border: none;
      border-radius: 0;
      box-shadow: none;

      &:first-child {
        padding-left: 0;
        text-align: left;
      }
      &:last-child {
        padding-right: 0;
        text-align: right;
      }

      &--hidden {
        & + .tab {
          padding-left: 0;
          text-align: left;
          &--divider {
            &:before {
              display: none;
            }
          }
        }
      }
      &--active {
        text-decoration: underline;
      }
      &--divider {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 30px;
          width: 2px;
          background-color: rgba($violetLight, 0.5);
        }
      }


      &:hover {
        color: $violetLight;
      }
      &--single {
        text-align: left !important;
        text-decoration: none;
        cursor: default;
        &:hover {
          color: $violet;
        }
      }
    }
  }

  .tabs-container__container {
    background: transparent;
    padding: 50px 0 0 0;
    border-radius: 0;
    box-shadow: none;

    @media (max-width: $md) {
      padding: 20px 0 0 0;
    }
  }
}

.no-padding-top {
  .tabs-container__container {
    padding-top: 20px;
  }
}

.mode-content-scroll {
  .tabs-container__container {
    max-height: 600px;
    overflow: auto;
  }
}
</style>
