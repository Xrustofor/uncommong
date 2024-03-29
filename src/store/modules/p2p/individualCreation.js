import Vue from 'vue';
import router from '@/router';
import store from '@/store';

export default {
  namespaced: true,
  state: {
    individual: {},
  },
  mutations: {
    setState(state, payload) {
      state.individual = payload
    },
  },
  actions: {
    async apiGetIndividual({state, commit, dispatch}, fundraiserSlug) {
      let individual = false
      try {
        await Vue.axios
          .get(`/user/fundraisers/individual/${fundraiserSlug}`)
          .then(res => res.data.individual)
          .then(data => {
            console.log('res.data.individual', data)
            individual = data ? data : {}
            commit('setState', data ? data : {})
          })
      } catch (e) {
        console.log('e', e)
      }
      return individual;
    },
    async apiPostIndividual({state, commit, dispatch}, {fundraiserId, body}) {
      let individual = false
      try {
        await Vue.axios
          .post(`/user/fundraisers/individual/${fundraiserId}`, body)
          .then(res => {
            individual = res
            commit('setState', res.data.individual)
          })
      } catch (e) {
        console.log('e', e)
      }
      return individual;
    },
    async apiPutIndividual({state, commit, dispatch}, {individualId, body}) {
      let individual = false
      try {
        await Vue.axios
          .put(`/user/fundraisers/individual/${individualId}`, body)
          .then(res => {
            individual = res
            commit('setState', res.data)
          })
      } catch (e) {
        console.log('e', e)
      }
      return individual;
    },
    async apiPatchIndividual({state, commit, dispatch}, individualId) {
      let individual = false
      try {
        await Vue.axios
          .patch(`/user/fundraisers/individual/${individualId}`)
          .then(res => res.data.individual)
          .then(data => {
            individual = data
            commit('setState', data)
            return data
          })
      } catch (e) {
        console.log('e', e)
      }
      return individual;
    },
  }
}
