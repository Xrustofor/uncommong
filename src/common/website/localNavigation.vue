<template>
  <ul>
    <li
      v-for="(item, key) in localMenu"
      :key="`${key}-nav`"
      v-show="item.status"
      @mouseenter="item.hovered = true"
      @mouseleave="item.hovered = false"
    >
      <router-link
        :to="{ path: item.url, hash: item.hash }"
        active-class="active"
        class="element"
        v-slot="{ isActive, navigate }"
      >
        <div
          :style="isActive ? { background: item.bgColor } : ''"
          :class="isActive ? 'active' : ''"
          @click="navigate"
        >
          <span
            class="circle"
            :class="{ 
              hovered: item.hovered,
              uphovered: !item.hovered
            }"
          >
            <span>
              <icon-base
                class="icon"
                :height="20"
                :width="20"
                icon-color="#fff"
              >
                <iconRightDrop :background="item.bgColor" />
              </icon-base>
            </span>
          </span>
          <p>{{ item.name }}</p>
        </div>
      </router-link>
    </li>
  </ul>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconRightDrop from "@/components/icons/iconRightDrop";

export default {
  props: {
    items: {
      type: [Array, Object],
      default: [{ name: "", url: "", colorActive: "" }],
    },
    rules: { type: Object, default: {} },
    anchor: { type: String, default: "" },
  },
  components: {
    IconBase,
    iconRightDrop,
  },
  data() {
    return {
      localMenu: [],
    };
  },
  created() {
    this.localMenu = this.menuFormatting(this.items, this.rules);
  },
  watch: {
    rules(val) {
      this.localMenu = this.menuFormatting(this.items, val);
    },
  },
  methods: {
    menuFormatting(items, rules) {
      const result = [];
      if (Object.keys(rules).length > 0) {
        items.map((itm) => {
          const key = itm.key;
          for (let i in rules) {
            if (i === key)
              result.push({ ...itm, status: rules[i], hovered: false });
          }
        });
      }
      return items.length > 0 ? result : items;
    },
  },
};
</script>
<style lang="scss" scoped>
ul {
  
  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  li {
    display: flex;
    margin: 0.7rem 0;
    padding: 1.3rem 1.5rem;
    background: #ffffff;
    box-shadow: 0px 1px 18px -3px rgba(154, 131, 183, 0.32);
    border-radius: 3.3rem;
    min-height: 5rem;
    cursor: pointer;
    @media only screen and (max-width: 768px) {
      padding: 5px 10px;
      margin: 0 5px;
      min-height: 4rem;
      margin-top: 25px;
    }
    &:first-child {
      margin-top: 0;
      @media only screen and (max-width: 768px) {
        margin-top: 25px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  li {
    .circle {
      margin-right: 10px;
      @media only screen and (max-width: 768px) {
        margin-right: 5px;
      }
      & > span {
        width: 36px;
        height: 36px;
        @media only screen and (max-width: 768px) {
          -webkit-transform: rotate(-90deg);
          transform: rotate(-90deg);
        }
      }
      &.hovered span {
        @media only screen and (min-width: 768px) {
          -webkit-animation: rotateTo 0.5s forwards;
          -moz-animation: rotateTo 0.5s forwards;
          -o-animation: rotateTo 0.5s forwards;
          animation: rotateTo 0.5s forwards;
        }
        @media only screen and (max-width: 768px) {
          -webkit-transform: rotate(-90deg);
          transform: rotate(-90deg);
        }
      }
      &.uphovered span {
        @media only screen and (min-width: 768px) {
          -webkit-animation: rotateFrom 0.5s forwards;
          -moz-animation: rotateFrom 0.5s forwards;
          -o-animation: rotateFrom 0.5s forwards;
          animation: rotateFrom 0.5s forwards;
        }
      }
    }
  }
  .element {
    display: flex;
    align-items: center;
    width: 100%;
    border-radius: 3rem;
    color: $websiteText;
    font-weight: 800;
    font-size: 2rem;
    padding: 0 7px;
    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      min-width: 100px;
      font-size: 14px;
    }
    @media only screen and (max-width: 399px) {
      min-width: 80px;
    }
    &.active {
      color: #fff;
    }
    &.active .circle > span {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
      animation: none;
      @media only screen and (max-width: 768px) {
        transition: linear 0.3s;
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
      }
    }
  }
  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    position: relative;
    @media only screen and (max-width: 768px) {
      position: absolute;
      top: -20px;
    }
    .icon {
      position: absolute;
      top: 0px;
      left: 0px;
    }
  }
}

@keyframes rotateTo {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
}
@keyframes rotateFrom {
  0% {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  
}
</style>