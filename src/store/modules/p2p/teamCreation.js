import Vue from 'vue';
import router from '@/router';
import store from '@/store';

export default {
  namespaced: true,
  state: {
    team: {},
  },
  mutations: {
    setState(state, payload) {
      state.team = payload
    },
  },
  actions: {
    async apiGetTeamEdit({ state, commit, dispatch }, fundraiserSlug) {
      let team = false
      try {
        await Vue.axios
          .get(`/user/fundraisers/team/${fundraiserSlug}/edit`)
          .then(res => res.data.team)
          .then(data => {
            console.log('res.data.result', data)
            team = data ? data : {}
            commit('setState', data ? data : {})
          })
      } catch (e) {
        console.log('e', e)
      }
      return team;
    },
    async apiGetTeam({ state, commit, dispatch }, fundraiserSlug) {
      let team = false
      try {
        await Vue.axios
          .get(`/user/fundraisers/team/${fundraiserSlug}`)
          .then(res => res.data.team)
          .then(data => {
            console.log('res.data.result', data)
            team = data ? data : {}
            commit('setState', data ? data : {})
          })
      } catch (e) {
        console.log('e', e)
      }
      return team;
    },
    async apiPostTeam({ state, commit, dispatch }, fundraiserId) {
      let team = false
      try {
        await Vue.axios
          .post(`/user/fundraisers/team/${fundraiserId}`)
          .then(res => res.data.result)
          .then(data => {
            team = data
            commit('setState', data)
            return data
          })
      } catch (e) {
        console.log('e', e)
      }
      return team;
    },
    async apiPutTeam({ state, commit, dispatch }, {teamId, body}) {
      let team = false
      try {
        await Vue.axios
          .put(`/user/fundraisers/team/${teamId}`, body)
          .then(res => {
            team = res
            commit('setState', res.data.team)
          })
      } catch (e) {
        console.log('e', e)
      }
      return team;
    },
    async apiPatchTeam({ state, commit, dispatch }, teamId) {
      let team = false
      try {
        await Vue.axios
          .patch(`/user/fundraisers/team/${teamId}/publish`)
          .then(res => res.data.team)
          .then(data => {
            team = data
            commit('setState', data)
            return data
          })
      } catch (e) {
        console.log('e', e)
      }
      return team;
    },
  }
}
