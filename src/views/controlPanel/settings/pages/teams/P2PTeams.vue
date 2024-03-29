<template>
  <div>
    <template v-if="countLevel === 3">
      <PageHeader title="Teams">
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
        tableWrapPadding="185"
        :headerItems="headerItems"
        :items="items"
        :total="total"
        :countPages="total ? +total : 0"
        :numberPages="numberPages"
        :tabsН="tabsН"
        @selectActions="selectActions"
        @selectCount="selectCount"
        @pageSelection="pageSelection"
        @toggleTab="toggleTab"
        @actionWithElement="actions"
      >
        <template #loader>
          <ProgressBar :loading="loading"/>
        </template>
      </SimpleTable>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>
<script>
import PageHeader from '../../components/pageHeader';
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
        sort: 'team_name',
        per_page: 10,
        order: 'asc',
        page: 1,
        condition: 'current',
      },
      sortSelect: {
        sort: 'team_name',
        order: 'asc',
      },
      tabsН: [
        { title: 'Current', key: 'current', isActive: true },
        { title: 'Past', key: 'past', isActive: false },
      ],
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

    await this.apiP2PTeamsList(this.sendingData);
  },
  computed: {
    ...mapGetters('settings/p2pTeams/teams', {
      items: 'getItems',
      headerItems: 'getHeaderItems',
      total: 'getTotal',
      numberPages: 'getNumberPages',
      loading: 'getLoader',
    }),
  },
  methods: {
    ...mapActions('settings/p2pTeams/teams', ['apiP2PTeamsList', 'deleteTeam']),
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

      const success = await this.apiP2PTeamsList(data);
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

      const success = this.apiP2PTeamsList(data)
      if (success) this.sendingData = data
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      }

      const success = this.apiP2PTeamsList(data)
      if (success) this.sendingData = data
    },
    async search({ text }) {
      const data = {
        ...this.sendingData,
        search: text,
      }

      const success = await this.apiP2PTeamsList(data)
      if (success) {
        this.sendingData = data
      }
    },
    async toggleTab(val) {
      let tabsН = this.tabsН.map((el) => {
        if (el.key == val) {
          el.isActive = true
        } else el.isActive = false

        return el
      })
      this.tabsН = tabsН

      const data = {
        ...this.sendingData,
        condition: val,
      }

      const success = this.apiP2PTeamsList(data)
      if (success) this.sendingData = data
    },
    actions(e) {
      switch (e.key) {
        case 'roster': {
          this.$router.push({ path: `/admin/account/teams/${e.el.id}/roster` })
          break
        }
        case 'view': {
          this.$router.push({ path: `/fundraisers/${e.el.fundraiser_url}/teams/${e.el.id}` })
          break
        }
        case 'edit': {
          this.$router.push({ path: `fundraisers/${e.el.fundraiser_url}/teams-edit/${e.el.id}` })
          break
        }
        case 'delete': {
          this.$swal({
            title: 'Delete Team',
            html: `<p class='subtitle'>Are you sure you want to delete “${e.el.team_name}” team? You cannot undo this action.</p>`,
            showCancelButton: true,
            confirmButtonText: 'confirm',
          }).then((result) => {
            if (result.value === true) {
              this.deleteTeamConfirm(e.el)
            }
          })
          break
        }
      }
    },
    async deleteTeamConfirm(el) {
      let success = await this.deleteTeam(el.id);
      if (success) {
        await this.apiP2PTeamsList(this.sendingData);
        this.$swal({
          title: `${el.team_name} was successfully deleted.`,
          confirmButtonText: 'OK',
        })
      }
    },
  },
}
</script>
