<template>
  <div>
    <template v-if="countLevel === 3">
      <PageHeader title="Campaigns">
        <template #rightPart>
          <SearchByItem
            :options="[{ key: 'team_name', title: 'team Name' }]"
            default="team_name"
            class="select mb-15 mr-30"
            @search="search"
          ></SearchByItem>
        </template>
      </PageHeader>
      <SimpleTable
        tableWrapPadding="130"
        :headerItems="headerItems"
        :items="items"
        :total="total"
        :countPages="total ? +total : 0"
        :numberPages="numberPages"
        @selectActions="selectActions"
        @selectCount="selectCount"
        @pageSelection="pageSelection"
      >
        <template #loader>
          <ProgressBar :loading="loading"></ProgressBar>
        </template>
      </SimpleTable>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>
<script>

import PageHeader from '../components/pageHeader';
import SimpleTable from '@/components/simpleTable.vue';
import ProgressBar from '@/components/progressBar.vue';
import SearchByItem from '@/components/inputs/simpleSearchByItem.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
  components: { PageHeader, SimpleTable, ProgressBar, SearchByItem },
  data() {
    return {
      countLevel: null,
      sendingData: {
        sort: 'name',
        per_page: 10,
        order: 'asc',
        page: 1,
        search: '',
      },
      sortSelect: {
        sort: 'name',
        order: 'asc',
      },
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { matched, meta } = to;
    this.countLevel = matched.length;
    next();
  },
  async created() {

    const { matched, meta } = this.$router.history.current;
    this.countLevel = matched.length;
    await this.apiCampaignsList(this.sendingData);

  },
  computed: {
    ...mapGetters('settings/campaigns', {
      items: 'getItems',
      headerItems: 'getHeaderItems',
      total: 'getTotal',
      numberPages: 'getNumberPages',
      loading: 'getLoader',
    }),
  },
  methods: {
    ...mapActions('settings/campaigns', ['apiCampaignsList']),
    async selectActions(sort) {
      this.sendingData.sort = sort;
      let sortSelect = this.sortSelect;
      let data = this.sendingData;

      if (sortSelect.sort === '') {
        this.sortSelect = { sort, order: 'desc' }
      }

      if (sortSelect.sort === sort) {
        if (sortSelect.order === 'asc') {
          this.sortSelect = { ...this.sortSelect, order: 'desc' }
        }

        if (sortSelect.order === 'desc') {
          this.sortSelect = { ...this.sortSelect, order: 'asc' }
        }
      } else {
        this.sortSelect = { sort, order: 'asc' }
      }

      data = {
        ...this.sendingData,
        ...this.sortSelect,
      }

      const success = await this.apiCampaignsList(data);
      if (success) {
        this.sendingData = data;
      }
    },
    async selectCount(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        per_page: val,
      }

      const success = this.apiCampaignsList(data);
      if (success) {
        this.sendingData = data
      }
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      }

      const success = this.apiCampaignsList(data)
      if (success) {
        this.sendingData = data;
      }
    },
    async search({ text }) {
      const data = {
        ...this.sendingData,
        search: text,
      }

      const success = await this.apiCampaignsList(data);
      if (success) {
        this.sendingData = data;
      }
    },
  },
}
</script>