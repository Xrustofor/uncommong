<template>
  <div>
    <template v-if="countLevel === 4">
      <PageHeader :title="teamName + ' Roster'">
        <template #rightPart>
          <SearchByItem
            :options="[{ key: 'full_name', title: 'Name' }]"
            default="full_name"
            class="select mb-15 mr-30"
            @search="search"
          ></SearchByItem>
        </template>
      </PageHeader>
      <SimpleTable
        tableWrapPadding="230"
        :headerItems="headerItems"
        :items="items"
        :total="total"
        :countPages="total ? +total : 0"
        :numberPages="numberPages"
        @selectActions="selectActions"
        @selectCount="selectCount"
        @pageSelection="pageSelection"
        @actionWithElement="
          member = $event.el
          actions($event)
        "
        @viewItem="
          $router.push({
            path: `/admin/account/teams/${$route.params.idTeam}/roster/${$event.individual_id}/donations`,
          })
        "
      >
        <template #loader>
          <ProgressBar :loading="loading" />
        </template>
      </SimpleTable>
      <ModalOverlay :showModal="modal" @hideModal="modal = false" class="small bg-black">
        <ManagePermissons
          :team="sendingData.id"
          :member="member"
          @hideModal="modal = false"
        ></ManagePermissons>
      </ModalOverlay>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>
<script>
import PageHeader from '../../components/pageHeader'
import SimpleTable from '@/components/simpleTable.vue'
import ProgressBar from '@/components/progressBar.vue'
import SearchByItem from '@/components/inputs/simpleSearchByItem.vue'
import ModalOverlay from '@/common/modalOverlay.vue'
import ManagePermissons from '../../components/managePermissions'

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    PageHeader,
    SimpleTable,
    ProgressBar,
    SearchByItem,
    ModalOverlay,
    ManagePermissons,
  },
  data() {
    return {
      countLevel: null,
      sendingData: {
        id: this.$route.params.idTeam,
        sort: 'full_name',
        per_page: 10,
        order: 'asc',
        page: 1,
        search_field: 'full_name',
        search: '',
      },
      sortSelect: {
        sort: 'full_name',
        order: 'asc',
      },
      modal: false,
      permissionLoader: false,
      permissionSaved: false,
      member: {},
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { matched, meta } = to
    this.countLevel = matched.length
    next()
  },
  async created() {
    const { matched, meta, path } = this.$router.history.current
    this.countLevel = matched.length

    await this.userTeamPermissions(this.sendingData.id)
    await this.fundraiserForTeam(this.sendingData.id)
    await this.apiP2PTeamRosterList(this.sendingData)

    const params = {
      id: this.sendingData.id,
      title: this.teamName,
      idName: meta.idName ? meta.idName : '',
      url: path,
    }

    this.$store.commit('setNamesParams', params)
  },
  computed: {
    ...mapGetters('settings/p2pTeams/roster', {
      teamName: 'getTeamName',
      items: 'getItems',
      headerItems: 'getHeaderItems',
      total: 'getTotal',
      numberPages: 'getNumberPages',
      loading: 'getLoader',
    }),
  },
  methods: {
    ...mapMutations(['setBreadCrumbs']),
    ...mapActions('settings/p2pTeams/roster', [
      'fundraiserForTeam',
      'apiP2PTeamRosterList',
      'userTeamPermissions',
      'deleteMember',
      'promoteMember',
    ]),
    async selectActions(sort) {
      this.sendingData.sort = sort
      let sortSelect = this.sortSelect
      let data = this.sendingData

      if (sortSelect.sort === '') {
        this.sortSelect = { sort, order: 'desc' }
      } else {
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

      const success = await this.apiP2PTeamRosterList(data)
      if (success) {
        this.sendingData = data
      }
    },
    async selectCount(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        per_page: val,
      }

      const success = this.apiP2PTeamRosterList(data)
      if (success) {
        this.sendingData = data
      }
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      }

      const success = this.apiP2PTeamRosterList(data)
      if (success) {
        this.sendingData = data
      }
    },
    async search({ text, selected }) {
      const data = {
        ...this.sendingData,
        search_field: selected,
        search: text,
      }

      const success = await this.apiP2PTeamRosterList(data)
      if (success) {
        this.sendingData = data
      }
    },
    actions(e) {
      switch (e.key) {
        case 'edit': {
          this.$router.push({
            path: `/admin/account/fundraisers/${e.el.fundraiser_url}/individual-edit/${e.el.individual_id}`,
          })
          break
        }
        case 'remove': {
          this.$swal({
            title: 'Remove member',
            html: `<p class='subtitle'>Are you sure you want to remove ${e.el.full_name} from your team?</p>`,
            showCancelButton: true,
            confirmButtonText: 'confirm',
          }).then((result) => {
            if (result.value === true) {
              this.deleteMemberConfirm(e.el)
            }
          })
          break
        }
        case 'promote': {
          this.$swal({
            title: 'Promote to leader',
            html: `<p class='subtitle'>Are you sure you want to promote ${e.el.full_name} to team leader? You will lose your privileges once they accept the change.</p>`,
            showCancelButton: true,
            confirmButtonText: 'confirm',
          }).then((result) => {
            if (result.value === true) {
              this.promoteMemberConfirm(e.el)
            }
          })
          break
        }
        case 'permissions': {
          this.modal = true
          break
        }
      }
    },
    async deleteMemberConfirm(el) {
      let success = await this.deleteMember({ idTeam: this.sendingData.id, idMember: el.id })
      if (success) {
        await this.apiP2PTeamRosterList(this.sendingData)
        this.$swal({
          title: `${el.full_name} was successfully deleted.`,
          confirmButtonText: 'OK',
        })
      }
    },
    async promoteMemberConfirm(el) {
      let success = await this.promoteMember({ idTeam: this.sendingData.id, idMember: el.id })
      if (success) {
        await this.userTeamPermissions(this.sendingData.id)
        await this.apiP2PTeamRosterList(this.sendingData)
        this.$swal({
          title: `${el.full_name} successfully promoted`,
          confirmButtonText: 'OK',
        })
      }
    },
  },
}
</script>
