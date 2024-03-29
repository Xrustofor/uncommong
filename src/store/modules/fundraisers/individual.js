import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    individual: {},
    fundraiser: {},
    bannerItem: {},
  },

  getters: {
    getIndividual(state) { return state.individual },
    getFundraiser(state) { return state.fundraiser },
    getBannerItem(state) { return state.bannerItem },
  },
  mutations: {
    setIndividual(state, payload) { state.individual = payload },
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
  },
  actions: {
    async apiGetFundraiserIndividual({ commit }, payload) {
      const { slug, organizationFundraiserIndividual } = payload;
      try {
        Vue.axios.get(`public/fundraisers/layout/${slug}/individual/${organizationFundraiserIndividual}`)
          .then(res => res.data.result)
          .then(data => {
            commit('setBannerItem', data.fundraiser);
            commit('setFundraiser', data.fundraiser);
            commit('setIndividual', data.individual);

          })

      } catch (e) { console.log(e) }
    },
  },
}
