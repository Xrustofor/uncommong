<template>
  <div id="app">
    <component :is="layout">
      <router-view></router-view>
    </component>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

const default_layout = 'full-page'
export default {
  data() {
    return {
      show: false,
      info: null,
      live: process.env.VUE_APP_ENV === 'live' ? 'all' : 'noindex',
    }
  },
  metaInfo() {
    return {
      meta: [{ name: 'robots', content: this.live }],
    }
  },
  async mounted() {
    await this.isUnderConstruction(this.tokenUC)
    var name = this.$router.history.current.name
    if (this.underConstruction == true && name !== 'under construction secret') {
      this.$router.push({ path: 'under-construction' })
    }
    const token = this.$cookies.get('access_token')
    if (token != null) {
      this.getApiUser()
    }
  },
  computed: {
    ...mapGetters('underConstructionPage', {
      underConstruction: 'getUnderConstruction',
      tokenUC: 'getTokenUC',
    }),
    layout() {
      return this.$route.meta.layout || default_layout
    },
  },
  watch: {
    underConstruction() {
      var name = this.$router.history.current.name
      if (this.underConstruction == true && name !== 'under construction secret') {
        this.$router.push({ path: 'under-construction' })
      }
    },
  },
  methods: {
    ...mapActions('user', ['getApiUser']),
    ...mapActions('underConstructionPage', ['isUnderConstruction']),
  },
}
</script>
