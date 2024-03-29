import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import axios from "axios";
import VueAxios from "vue-axios";

import router from "../router";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import auth from "./modules/auth";
import user from "./modules/user";
import securityQuestions from "./modules/securityQuestions";
import pageSettings from "./modules/pageSettings";
import organizations from "./modules/organizations";
import billing from "./modules/billing";
import settings from "./modules/settings";
import sweepstakes from "./modules/sweepstakes";
import publicweb from "./modules/publicweb";
import fundraisers from "./modules/fundraisers";
import team from "./modules/p2p/team";
import individual from "./modules/p2p/individual";
import individualCreation from "./modules/p2p/individualCreation";
import teamCreation from "./modules/p2p/teamCreation";

import underConstructionPage from "./modules/underConstruction";

import { paramsUrlReplace } from "@/helpers/script"

let initialState = {
  user,
  auth: { ...auth.state },
  securityQuestions: { ...securityQuestions.state },
  pageSettings: { ...pageSettings.state },
  organizations: { ...organizations.state },
  billing: { ...billing.state },
  sweepstakes,
};

export default new Vuex.Store({
  namespaced: true,
  modules: {
    user,
    auth,
    securityQuestions,
    pageSettings,
    organizations,
    billing,
    settings,
    sweepstakes,
    fundraisers,
    team,
    teamCreation,
    individual,
    individualCreation,
    publicweb,
    underConstructionPage,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    websiteLoader: true,
    somethingChanged: false,
    returnLink: {},
    pageAnchor: {},
    breadItems: [],
    matchingPaths: [],
    namesParams: [],
  },
  getters: {
    getWebsiteLoader(state) { return state.websiteLoader; },
    getSomethingChanged(state) { return state.somethingChanged; },
    getReturnLink(state) { return state.returnLink; },
    getBreadItems(state) { return state.breadItems },
    getNamesParams(state) { return state.namesParams },
    getMatchingPaths(state) { return state.matchingPaths },
  },
  mutations: {
    setLoader(state, payload) {
      state.websiteLoader = payload;
    },
    reset(state, payload) {
      localStorage.clear();
      Vue.$cookies.remove("access_token");
      Vue.$cookies.remove("user");

      router.replace("/login");
    },
    setSomethingChanged(state, payload) {
      state.somethingChanged = payload;
    },
    setReturnLink(state, payload) {
      state.returnLink = payload;
    },
    setMatchingPaths(state, payload) {
      state.matchingPaths = {
        ...payload,
        items: payload.items.map(p => ({
          ...p,
          path: paramsUrlReplace(p.path, p.params)
        }))
      }
    },
    setBreadItems(state, payload) {
      if (!payload.matched.length) return;
      const matched = payload.matched;
      let params = payload.params;
      const items = [];

      if (!payload.mainPath || payload.mainPath.path) {
        items.push({
          url: payload.mainPath.path,
          title: payload.mainPath.title,
          isLink: payload.mainPath.isLink,
          params: {},
          path: '',
          key: '',
        });
      }

      matched.map(p => {
        const title = p.meta.title ? p.meta.title : '';
        items.push({
          url: paramsUrlReplace(p.path, params),
          title: title,
          isLink: p.meta.isLink,
          params,
          path: p.path,
          key: p.meta.key ? p.meta.key : '',
        })
      })

      state.breadItems = items;
    },
    setNamesParams(state, payload) {
      let items = state.namesParams;

      let findIndex = null;
      const candidate = items.find((item, index) => {
        if (item.idName === payload.idName) {
          findIndex = index;
          return true;
        } else {
          return false;
        }
      });

      if (!candidate) {
        items.push(payload);
      } else {
        items[findIndex] = payload;
      }

      state.namesParams = [];
      state.namesParams = items;
    },
    setRouterData(state, payload) { state.routerData = payload },
  },
  actions: {
    setLoader({ commit }, payload) {
      commit("setLoader", payload);
    },
    setSomethingChanged({ commit }, payload) {
      commit("setSomethingChanged", payload);
    },
    async subscribeToNews({ commit }, payload) {
      var email = {
        email: payload,
      };
      let success = "";
      try {
        await Vue.axios
          .post(`/subscribe-news`, email)
          .then((res) => res.data)
          .then((data) => {
            success = data;
          });
        return success;
      } catch (e) {
        console.log(e);
      }
    },
    async logout({ commit }) {
      try {
        await Vue.axios.post("/logout").then(() => {
          commit("reset");
        });
      } catch (e) {
        console.log(e);
      }
    },
    cleanAllData({ commit }) {
      commit("reset");
    },
  },
});
