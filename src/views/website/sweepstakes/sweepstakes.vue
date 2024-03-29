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
          :items="sortSweepstakes"
          @selectElement="selectSortSweepstakes"
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
    <h4 class="title">Featured Sweepstakes</h4>
    <div v-if="this.sweepstakes.length === 0" class="row_empty">
      <p>
        {{
          emptyType
            ? 'No sweepstakes matching your criteria/filter'
            : 'There are no sweepstakes here'
        }}
      </p>
    </div>
    <div class="row" v-else>
      <div class="col-3" v-for="sweepstake in sweepstakes" :key="sweepstake.id">
        <SweepstakeInList :emptyType="emptyType" :sweepstake="sweepstake"/>
      </div>
    </div>
    <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy"></div>
  </div>
</template>
<script>


import SearchWithMatching from '@/components/inputs/searchWithMatch';
import simpleSelect from '@/components/inputs/simpleSelect';
import SimplePagination from '@/components/simplePagination.vue';
import FiltersList from '@/components/filtersList.vue';
import SweepstakeInList from './components/sweepstakeInList.vue';
import Filtration from '@/components/filtrationDropdown.vue';
import Sort from '@/components/sortList';
import SortDropDown from '@/components/sortDropDown';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    SearchWithMatching,
    simpleSelect,
    SimplePagination,
    FiltersList,
    SweepstakeInList,
    Filtration,
    Sort,
    SortDropDown,
  },
  name: 'sweepstakes',
  data() {
    return {
      filtrationClosed: true,
      sendingData: {
        search: '',
        status: '',
        sort_sweepstakes: 'newest',
        sort_focuses: 'count',
        filter_by: [],
        page: 1,
      },
      searchText: '',
      sortSweepstakes: [
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
  async mounted() {
    this.busy = true;
    this.$store.dispatch('setLoader', true);
    await this.getApiSweepstakes(this.sendingData);
    this.$store.dispatch('setLoader', false);
  },
  computed: {
    ...mapGetters('sweepstakes/sweepstakes', {
      sweepstakes: 'getSweepstakes',
      total: 'getTotal',
      numberPages: 'getNumberPages',
      statuses: 'getStatuses',
      focuses: 'getFocuses',
      searchItems: 'getSearchMatched',
      page: 'getPage',
    }),
  },
  watch: {
    sendingData() {
      this.emptyType =
        this.sweepstakes.length === 0 &&
        (this.sendingData.filter_by.length > 0 || this.sendingData.status != '')
          ? true
          : false
    },
    sweepstakes(newVal, oldVal) {
      if (newVal == oldVal) {
        this.busy = true;
      } else {
        this.busy = false;
      };
    },
  },
  methods: {
    ...mapActions('sweepstakes/sweepstakes', ['getApiSweepstakes', 'searchMatchedText']),
    ...mapMutations('sweepstakes/sweepstakes', ['setMatchedText']),
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
      const success = await this.getApiSweepstakes(data);
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
      const success = await this.getApiSweepstakes(data);
      if (success) {
        this.sendingData = data;
      };
    },
    async selectSort(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_focuses: val.key,
      }

      const success = await this.getApiSweepstakes(data);
      if (success) {
        this.sendingData = data;
        this.sortFocuses.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        })
      }
    },
    async selectSortSweepstakes(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_sweepstakes: val.key,
      }

      const success = await this.getApiSweepstakes(data)
      if (success) {
        this.sendingData = data;
        this.sortSweepstakes.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        })
      }
    },
    async selectFilter(val) {
      let status = val != this.sendingData.status ? val : '';
      const data = {
        ...this.sendingData,
        page: 1,
        status: status,
        type: 'status',
      }
      const success = await this.getApiSweepstakes(data);
      if (success) {
        this.sendingData = data;
      }
    },
    async loadMore() {
      this.busy = true;
      if (this.page) {
        var newPage = this.sendingData.page + 1
        const data = {
          ...this.sendingData,
          page: newPage,
        }
        const success = await this.getApiSweepstakes(data);
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
  width: calc(100% + 4rem);
  margin: 0 -2rem 40px;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media only screen and (max-width: 599px) {
    width: 100%;
    margin: 0;
  }
  .col-3 {
    width: calc(100% / 3);
    padding: 0 2rem;
    margin-bottom: 35px;
    @media only screen and (max-width: 998px) {
      width: calc(100% / 2);
    }
    @media only screen and (max-width: 599px) {
      width: 100%;
      padding: 0;
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
  margin-bottom: 30px;
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