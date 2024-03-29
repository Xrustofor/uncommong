<template>
  <div class="search_overlay">
    <p>{{ title }}</p>
    <div class="search">
      <input
        :class="loading ? 'loading' : false"
        type="search"
        placeholder="Search"
        v-model="searchText"
        @keyup.prevent="search"
        @focus="focusSearch = true"
        @blur="blurSearch"
        :disabled="disabled"
      />
      <span class="icon loader" v-if="loading">
        <Loader></Loader>
      </span>
      <button class="icon" @click.prevent="search">
        <icon-base
          width="18"
          height="18"
          viewBox="0 0 10 8"
          icon-name="search"
          icon-color="#303852"
        >
          <icon-search />
        </icon-base>
      </button>
    </div>
    <div class="matching" v-if="matched.length > 0 && focusSearch">
      <button
        v-for=" in matched"
        :key="match.id"
        :class="{
          full_match: match.full_match,
        }"
        @click.prevent.stop="selectMatch(match)"
      >
        {{ match.name }}
      </button>
    </div>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase';
import iconSearch from '@/components/icons/iconSearch';
import Loader from '@/components/loaderIcon';
export default {
  props: {
    title: { type: String },
    matched: { type: Array },
    disabled: { type: Boolean, default: false },
    text: { type: String },
  },
  components: {
    IconBase,
    iconSearch,
    Loader,
  },
  data() {
    return {
      searchText: '',
      timeout: null,
      focusSearch: false,
      loading: false,
    }
  },
  watch: {
    text() {
      this.searchText = this.text;
    },
    matched() {
      this.loading = false;
    },
  },
  methods: {
    search() {
      var self = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        self.loading = true;
        self.$emit('search', { text: self.searchText });
      }, 500)
    },
    blurSearch() {
      var self = this;
      setTimeout(() => {
        self.focusSearch = false;
      }, 300)
    },
    selectMatch(match) {
      this.$emit('selectMatch', match);
    },
  },
}
</script>
<style lang="scss" scoped>
.search_overlay {
  position: relative;
  z-index: 2;
  &.mb-15 {
    margin-bottom: 15px;
  }
  p {
    font-size: 12px;
    font-weight: 300;
    color: $violet;
    margin-bottom: 8px;
    cursor: pointer;
  }
  .search {
    width: 100%;
    position: relative;
    input {
      padding-right: 50px;
      &.loading {
        padding-right: 80px;
      }
    }
    .icon {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      height: 20px;
      width: 20px;
      cursor: pointer;
      svg {
        width: auto;
      }
      &.loader {
        right: 50px;
      }
    }
  }
  .matching {
    position: absolute;
    bottom: -8px;
    transform: translateY(100%);
    width: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 40px 80px rgba(44, 51, 76, 0.06);
    padding: 10px 0;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #efefef;
    button {
      display: block;
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: $violet;
      text-align: left;
      padding: 14px 3.8rem;
      &.full_match {
        font-weight: 600;
      }
      &:hover {
        font-weight: 600;
        color: $websiteViolet;
      }
    }
  }
}
</style>