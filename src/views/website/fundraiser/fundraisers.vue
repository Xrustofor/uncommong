<template>
  <div class="container">
    <div class="header">
      <div class="search">
        <SearchWithMatching
          class="ml-0 mb-25"
          :matched="searchItems"
          :text="searchText"
          @search="search"
          @selectMatch="selectSearch"
        ></SearchWithMatching>
      </div>
    </div>
    <div class="filter_overlay">
      <div class="left_part">
        <SortDropDown
          title="Sort by"
          :items="sortItems"
          @selectElement="selectSortItems"
        ></SortDropDown>
        <Filtration
          title="Filter by cause"
          :items="focuses"
          :selectedItems="selectedCauses"
          :filtrationClosed="filtrationClosed"
          @selectFilter="selectCause"
          @removeFilter="removeCause"
        >
          <template #sort>
            <Sort 
              title="Sort:"
              :items="sortFocuses"
              @selectSort="selectSort"
            />
          </template>
        </Filtration>
      </div>
      <div>
        <FiltersList
          :items="statuses"
          :active="sendingData.status"
          @selectFilter="selectFilter"
        ></FiltersList>
      </div>
    </div>
    <h4 class="title">All Fundraisers</h4>
    <div v-if="this.fundraisers.length === 0" class="row_empty">
      <p>
        {{
          emptyType
            ? 'No fundraisers matching your criteria/filter'
            : 'There are no fundraisers here'
        }}
      </p>
    </div>
    <div class="row" v-else>
      <div v-for="i in fundraisers" :key="i.id" class="col-3">
        <Fundaiser :item="i" />
      </div>
    </div>
    <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy"/>
  </div>
</template>
<script>

import SearchWithMatching from '@/components/inputs/searchWithMatch';
import FiltersList from '@/components/filtersList.vue';
import Filtration from '@/components/filtrationDropdown.vue';
import Sort from '@/components/sortList';
import SortDropDown from '@/components/sortDropDown';
import Fundaiser from './components/fundraiserSmallPreview.vue';

import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    SearchWithMatching,
    FiltersList,
    Filtration,
    Sort,
    SortDropDown,
    Fundaiser,
  },
  data() {
    return {
      filtrationClosed: true,
      sendingData: {
        search: '',
        status: '',
        sort_fundraisers: 'newest',
        page: 1,
        sort_focuses: 'count',
        filter_by: [],
      },
      searchText: '',
      sortItems: [
        { title: 'Newest to Oldest', key: 'newest', active: true },
        { title: 'Alphabetically', key: 'alphabetically', active: false },
      ],
      sortFocuses: [
        { title: 'By Organization Count', key: 'count', active: true },
        { title: 'Alphabetically', key: 'alphabetically', active: false },
      ],
      selectedCauses: [],
      selectedSortes: [],
      emptyType: false,
      busy: true,
    }
  },
  async created() {
    this.busy = true;
    this.$store.dispatch('setLoader', true);
    await this.getApiItems(this.sendingData);
    this.$store.dispatch('setLoader', false);
  },
  computed: {
    ...mapGetters('fundraisers', {
      fundraisers: 'getItems',
      total: 'getTotal',
      statuses: 'getStatuses',
      focuses: 'getFocuses',
      searchItems: 'getSearchMatched',
      page: 'getPage',
    }),
  },
  watch: {
    sendingData() {
      this.emptyType = this.fundraisers.length === 0
        && (this.sendingData.filter_by.length > 0
        || this.sendingData.status != '') ? true : false;
    },
    fundraisers(newVal, oldVal) {
      if (newVal == oldVal) {
        this.busy = true;
      } else {
        this.busy = false;
      }
    },
  },
  methods: {
    ...mapActions('fundraisers', [
      'getApiItems', 'searchMatchedText'
    ]),
    ...mapMutations('sweepstakes/sweepstakes', [
      'setMatchedText'
    ]),
    async selectFilter(val) {
      let status = val != this.sendingData.status ? val : '';
      const data = {
        ...this.sendingData,
        page: 1,
        status: status,
        type: 'status',
      }
      const success = await this.getApiItems(data);
      if (success){
        this.sendingData = data;
      }
    },
    async selectSortItems(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_fundraisers: val.key,
      }

      const success = await this.getApiItems(data);
      if (success) {
        this.sendingData = data;
        this.sortItems.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        })
      }
    },
    selectSearch({ name }) {
      this.searchText = name;
      this.searchMatchedText(name);
      this.searchToText(name);
    },
    search({ text }) {
      this.searchMatchedText(text);
      this.searchToText(text);
    },
    async searchToText(text) {
      let data = {
        ...this.sendingData,
        search: text,
        page: 1,
      }
      const success = await this.getApiItems(data);
      if (success) {
        this.sendingData = data;
      }
    },
    selectCause(val) {
      var hasElement = this.selectedCauses.some((o) => o.id === val.id);
      if (!hasElement) {
        this.selectedCauses.push(val);
        this.filtration();
      }
    },
    removeCause(val) {
      this.selectedCauses = this.selectedCauses.filter((item) => item !== val);
      this.filtration();
    },
    async filtration() {
      var causes = [];
      this.selectedCauses.forEach((element) => {
        causes.push(element.id);
      })
      const data = {
        ...this.sendingData,
        page: 1,
        filter_by: causes,
        type: 'focus',
      }
      const success = await this.getApiItems(data);
      if (success) {
        this.sendingData = data;
      }
    },
    async selectSort(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_focuses: val.key,
      }

      const success = await this.getApiItems(data)
      if (success) {
        this.sendingData = data;
        this.sortFocuses.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        })
      }
    },
    async loadMore() {
      this.busy = true;
      if (this.page) {
        let newPage = this.sendingData.page + 1;
        const data = {
          ...this.sendingData,
          page: newPage,
        }
        const success = await this.getApiItems(data);
        if (success) {
          this.sendingData = data;
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  .search {
    max-width: 51rem;
    margin-bottom: 15px;
  }
  & > div {
    width: calc((100% - 30px) / 2);
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
}
.filter_overlay {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 25px;
  @media only screen and (max-width: 599px) {
    margin-bottom: 15px;
  }
  .left_part {
    display: flex;
    align-items: center;
  }
}
.row {
  display: flex;
  width: calc(100% + 40px);
  margin: 0 -20px 40px;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media only screen and (max-width: 1199px) {
    width: calc(100% + 20px);
    margin: 0 -10px 40px;
  }
  @media only screen and (max-width: 599px) {
    width: 100%;
    margin: 0;
  }
  .col-3 {
    width: calc((100% - 120px) / 3);
    margin: 0 20px 75px;
    @media only screen and (max-width: 1199px) {
      width: calc((100% - 60px) / 3);
      margin: 0 10px 50px;
    }
    @media only screen and (max-width: 998px) {
      width: calc((100% - 40px) / 2);
    }
    @media only screen and (max-width: 599px) {
      width: 100%;
      margin: 0 0 25px;
    }
  }
  &_empty {
    p {
      font-size: 18px;
      font-weight: 700;
      padding: 40px 0 60px;
      text-align: center;
    }
  }
}
.title {
  margin-bottom: 55px;
}
.pagination_overlay {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 15px;
  @media only screen and (max-width: 599px) {
    margin-bottom: 5px;
  }
  & > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px 0;
    @media only screen and (max-width: 599px) {
      width: 100%;
      justify-content: space-between;
    }
    &:first-child {
      font-size: 12px;
      color: $disabledColor;
      padding-right: 24px;
      @media only screen and (max-width: 599px) {
        margin-right: 20px;
      }
    }
  }
}
.select_count {
  margin-right: 24px;
  @media only screen and (max-width: 599px) {
    margin-right: 20px;
  }
}
.select_count,
.pagination {
  padding: 5px 0;
}
</style>