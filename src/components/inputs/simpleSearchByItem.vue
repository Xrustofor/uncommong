<template>
  <div class="search_overlay">
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
      <div class="selected" :class="{ open: open }" @click="open = !open">
        <p><span>Search by </span>{{ selected.title }}</p>
        <span class="icon" v-if="options.length > 1">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M9.34302 15.6569L14.9999 10L13.5857 8.58579L7.92881 14.2426L9.34302 15.6569Z"
              fill="#fff"
            />
            <path
              d="M9.34302 15.6569L10.7572 14.2426L5.10039 8.58578L3.68617 9.99999L9.34302 15.6569Z"
              fill="#fff"
            />
          </svg>
        </span>
      </div>
      <div class="items" :class="{ selectHide: !open }" v-if="options.length > 1">
        <div
          v-for="(option, i) of options"
          :key="i"
          @click="
            selected = option
            open = false
            search()
          "
        >
          {{ option.title }}
        </div>
      </div>
    </div>
    <div class="search">
      <input type="search" v-model="searchText" @keyup.prevent="search" />
      <span @click.prevent="search">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6685 15.0678L13.9647 12.364C14.802 11.1284 15.1487 9.6251 14.9369 8.14764C14.7251 6.67019 13.9702 5.32474 12.8195 4.37411C11.6688 3.42348 10.2051 2.93595 8.71422 3.00676C7.22334 3.07756 5.81241 3.70161 4.75701 4.75701C3.70161 5.81241 3.07756 7.22334 3.00676 8.71422C2.93595 10.2051 3.42348 11.6688 4.37411 12.8195C5.32474 13.9702 6.67019 14.7251 8.14764 14.9369C9.6251 15.1487 11.1284 14.802 12.364 13.9647L15.0678 16.6685C15.28 16.8807 15.5679 17 15.8681 17C16.1683 17 16.4562 16.8807 16.6685 16.6685C16.8807 16.4562 17 16.1683 17 15.8681C17 15.5679 16.8807 15.28 16.6685 15.0678ZM8.99721 13.0006C8.20498 13.0009 7.43046 12.7662 6.77162 12.3263C6.11277 11.8863 5.59921 11.2609 5.2959 10.529C4.99258 9.79712 4.91314 8.99174 5.06762 8.21472C5.2221 7.4377 5.60356 6.72394 6.16375 6.16375C6.72394 5.60356 7.4377 5.2221 8.21472 5.06762C8.99174 4.91314 9.79712 4.99258 10.529 5.2959C11.2609 5.59921 11.8863 6.11277 12.3263 6.77162C12.7662 7.43046 13.0009 8.20498 13.0006 8.99721C13.0006 10.059 12.5788 11.0772 11.828 11.828C11.0772 12.5788 10.059 13.0006 8.99721 13.0006Z"
            fill="#63517A"
          />
        </svg>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      searchText: '',
      timeout: null,
      selected: {
        key: '',
        title: '',
      },
      open: false,
    }
  },
  created() {
    this.options.forEach((el) => {
      if (el.key == this.default) {
        this.selected = el;
      }
    })
  },
  methods: {
    search() {
      var self = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        self.$emit('search', {
          text: self.searchText,
          selected: self.selected.key,
        })
      }, 500)
    },
  },
}
</script>
<style lang="scss" scoped>
.search_overlay {
  position: relative;
  width: 100%;
  max-width: 475px;
  min-width: 300px;
  flex: 1;
  .search {
    position: relative;
    input {
      padding-left: 48%;
      padding-right: 45px;
      @media only screen and (max-width: 998px) {
        padding-left: 53%;
      }
    }
    span {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .custom-select {
    position: absolute;
    width: 45%;
    text-align: left;
    outline: none;
    height: 100%;
    z-index: 2;
    @media only screen and (max-width: 998px) {
      width: 50%;
    }
    .selected {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      background-color: $indigoDark;
      color: #fff;
      padding-left: 1.5rem;
      border-top-left-radius: 3rem;
      border-bottom-left-radius: 3rem;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      .icon {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
          width: 1px;
          height: 70%;
          background: rgba($color: #fff, $alpha: 0.5);
        }
      }
      svg {
        position: relative;
        width: 20px;
        height: 20px;
        margin: 0 15px;
        @media only screen and (max-width: 1299px) {
          margin: 0 10px;
        }
        @media only screen and (max-width: 998px) {
          margin: 0 8px;
        }
      }
      p {
        text-transform: capitalize;
        span {
          display: inline;
          position: relative;
          text-transform: none;
        }
      }
    }
  }

  .custom-select .items {
    color: #fff;
    border-radius: 6px;
    overflow: hidden;
    position: absolute;
    background-color: $indigoDark;
    left: 0;
    right: 0;
    z-index: 1;
    margin-top: 10px;
    div {
      color: #fff;
      padding: 0.75rem 2rem;
      cursor: pointer;
      user-select: none;
      text-transform: capitalize;
      &:hover {
        background-color: $blue;
      }
    }
  }

  .selectHide {
    display: none;
  }
}
</style>