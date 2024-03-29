<template>
  <div class="search_overlay" :class="title ? 'column-2' : ''">
    <h3 v-if="title">{{ title }}</h3>
    <div class="search_form">
      <input
        type="search"
        placeholder="Search"
        v-model="searchText"
        @keyup.prevent="search"
      />
      <span class="icon">
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
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      searchText: "",
      outputValue: "",
      timeout: null,
    };
  },
  methods: {
    search() {
      var self = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        self.$emit("search", { text: self.searchText });
      }, 500);
    },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
};
</script>
<style lang="scss" scoped>
.search_overlay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid $violetBorder;
  @media only screen and (max-width: 599px) {
    flex-wrap: wrap;
  }
  input {
    width: 100%;
    max-width: 100%;
  }
  &.no-border {
    width: 100%;
    padding-bottom: 0;
    border-bottom: 0;
  }
  &.ml-0 {
    margin-left: 0;
  }
  &.mb-25 {
    margin-bottom: 25px;
  }
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 700;
    @media only screen and (max-width: 599px) {
      margin-bottom: 1rem;
    }
  }
  &.column-2 {
    .search_form {
      max-width: 40rem;
      @media only screen and (max-width: 599px) {
        max-width: 100%;
      }
    }
  }
  .search_form {
    width: 100%;
    position: relative;
    span {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      height: 20px;
    }
  }
  .icon svg {
    width: auto;
    height: auto;
  }
}
</style>