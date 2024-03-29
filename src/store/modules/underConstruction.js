import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import router from '../../router'

export default {
  namespaced: true,
  state: {
    underConstruction: false,
    tokenUC: null,
  },
  getters: {
    getUnderConstruction(state) {
      return state.underConstruction
    },
    getTokenUC(state) {
      return state.tokenUC
    },
  },
  mutations: {
    setUnderConstruction(state, payload) {
      state.underConstruction = payload
    },
    setTokenUC(state, payload) {
      state.tokenUC = payload
    },
  },
  actions: {
    async isUnderConstruction({ commit }, payload) {
      var params = payload != null ? { underConstructionToken: payload } : {}
      try {
        await Vue.axios
          .post(`/site-settings/under-construction-password/check-existence`, params)
          .then((res) => res.data)
          .then((data) => {
            commit('setUnderConstruction', data.underConstructionPasswordExistence)
          })
          .catch((error) => {
            if (error.response.status === 403) {
              router.replace('/under-construction')
              commit('setUnderConstruction', true)
              commit('setTokenUC', null)
            }
          })
      } catch (e) {
        console.log(e)
      }
    },
    async underConstractionVerifPass({ commit }, payload) {
      var pass = {
        password: payload,
      },
        success = {
          result: false,
          errors: null,
        }
      try {
        await Vue.axios
          .post(`/site-settings/under-construction-password/verify`, pass)
          .then((res) => res.data)
          .then((data) => {
            success.result = true
            commit('setUnderConstruction', false)
            commit('setTokenUC', data.underConstructionToken)
          })
          .catch((error) => {
            success.result = false
            success.errors = error.response.data.errors
          })
        return success
      } catch (e) {
        console.log(e)
      }
    },
  },
}
