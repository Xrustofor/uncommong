import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    team: {},
    fundraiser: {},
    bannerItem: {},
  },

  getters: {
    getTeam(state) { return state.team },
    getFundraiser(state) { return state.fundraiser },
    getBannerItem(state) { return state.bannerItem },
    setTeamId(state) { return state.id },
    setTeamId(state) { return state.id },
  },
  mutations: {
    setTeam(state, payload) { state.team = payload },
    setFundraiser(state, payload) { state.fundraiser = payload },
    setBannerItem(state, payload) {
      const item = {
        cover_photo: payload.cover_photo,
        name: payload.name,
        short_description: payload.short_description,
        amount_raised: payload.amount_raised,
        goal: payload.goal,
        status: payload.status,
        organization_image: payload.organization.image,
        organization_slug: payload.organization.slug,
        organization_name: payload.organization.name,
        uniqueDonorsCount: payload.uniqueDonorsCount,
        shared_count: payload.shared_count,
      }
      state.bannerItem = item;
    },
    setTeamId(state, payload) { return state.id = payload },

  },
  actions: {
    async apiGetfundraiserTeamData({ commit }, payload) {
      const { slug, organizationFundraiserTeam } = payload;
      try {
        Vue.axios.get(`public/fundraisers/layout/${slug}/team/${organizationFundraiserTeam}`)
          .then(res => res.data.result)
          .then(data => {
            commit('setTeamId', data.team.id);
            commit('setBannerItem', data.fundraiser);
            commit('setTeam', data.team);
            commit('setFundraiser', data.fundraiser)
          })

      } catch (e) { console.log(e) }
    },
  },
}
