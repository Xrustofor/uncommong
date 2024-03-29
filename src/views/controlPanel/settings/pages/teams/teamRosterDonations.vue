<template>
  <div>
    <PageHeader :title="`${teamName} Roster`">
      <template #rightPart>
        <SearchByItem
          :options="[{ key: 'full_name', title: 'Name' }]"
          default="full_name"
          class="select ml-15"
          @search="search"
        ></SearchByItem>
      </template>
    </PageHeader>
    <SimpleTable
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
  </div>
</template>
<script>
import PageHeader from '../../components/pageHeader';
import SimpleTable from '@/components/simpleTable.vue';
import ProgressBar from '@/components/progressBar.vue';
import SearchByItem from '@/components/inputs/simpleSearchByItem.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {
    PageHeader,
    SimpleTable,
    ProgressBar,
    SearchByItem,
  },
  data() {
    return {
      sendingData: {
        idTeam: this.$route.params.idTeam,
        idIndividual: this.$route.params.idIndividual,
        sort: 'created_at',
        per_page: 10,
        order: 'asc',
        page: 1,
        search_field: 'full_name',
        search: '',
      },
      sortSelect: {
        sort: 'created_at',
        order: 'asc',
      },
    }
  },
  async created() {
    await this.userTeamPermissions(this.sendingData.idTeam);
    await this.apiP2PTeamMemberDonations(this.sendingData);
  },
  computed: {
    ...mapGetters('settings/p2pTeams/roster', {
      teamName: 'getTeamName',
    }),
    ...mapGetters('settings/p2pTeams/donations', {
      items: 'getItems',
      headerItems: 'getHeaderItems',
      total: 'getTotal',
      numberPages: 'getNumberPages',
      loading: 'getLoader',
    }),
  },
  methods: {
    ...mapActions('settings/p2pTeams/roster', ['userTeamPermissions']),
    ...mapActions('settings/p2pTeams/donations', ['apiP2PTeamMemberDonations']),
    async selectActions(sort) {
      this.sendingData.sort = sort;
      let sortSelect = this.sortSelect;
      let data = this.sendingData;

      if (sortSelect.sort === '') {
        this.sortSelect = { sort, order: 'desc' };
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

      const success = await this.apiP2PTeamMemberDonations(data);
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

      const success = this.apiP2PTeamMemberDonations(data);
      if (success) {
        this.sendingData = data
      }
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      }

      const success = this.apiP2PTeamMemberDonations(data)
      if (success) {
        this.sendingData = data;
      }
    },
    async search({ text, selected }) {
      const data = {
        ...this.sendingData,
        search_field: selected,
        search: text,
      }

      const success = await this.apiP2PTeamMemberDonations(data)
      if (success) {
        this.sendingData = data;
      }
    },
  },
}
</script>