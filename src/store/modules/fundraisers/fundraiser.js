import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import { separateInitials } from "@/helpers/script";

export default {
  namespaced: true,
  state: {
    fundraiserFull: {},
    item: {},
    time: {
      daysRemains: false,
    },
    bannerInfo: {},
    updates: [],
    milestones: [],
    individuals: [],
    teams: [],
    lastDonations: [],
    donationAllowed: false
  },
  getters: {
    getItem(state) { return state.item },
    getTime(state) { return state.time },
    getBannerInfo(state) { return state.bannerInfo },
    getUpdates(state) { return state.updates },
    getMilestones(state) { return state.milestones },
    getIndividuals(state) { return state.individuals },
    getTeams(state) { return state.teams },
    getLastDonations(state) { return state.lastDonations },
    getDonationAllowed(state) { return state.donationAllowed },
    getFundraiserFull(state) { return state.fundraiserFull },
  },
  mutations: {
    setFundraiserFull(state, payload) {
      state.fundraiserFull = payload
    },
    setItem(state, payload) {
      state.item = payload
      state.bannerInfo = {
        cover_photo: payload.cover_photo,
        name: payload.name,
        short_description: payload.short_description,
        subtitle: payload.organization ? payload.organization.focus.title : null,
        amount_raised: payload.amount_raised,
        goal: payload.goal,
        status: payload.status,
        organization_image: payload.organization.image,
        organization_slug: payload.organization.slug,
        organization_name: payload.organization.name,
        uniqueDonorsCount: payload.uniqueDonorsCount,
        shared_count: payload.shared_count,
      }

      state.donationAllowed = payload.organization.is_donation_allowed

      const { meta, path } = router.history.current;
      const params = {
        id: payload.id,
        title: payload.name,
        idName: meta.idName ? meta.idName : "",
        url: path,
      };
      store.commit('setNamesParams', params);
    },
    setDaysRemains(state, payload) {
      const FORMAT = "YYYY-MM-DD HH:mm:ss"
      const currentDate = Vue.moment().tz("America/New_York").format(FORMAT);

      const endDate = payload.end_date ? Vue.moment(payload.end_date, "YYYY-MM-DD HH:mm:ss").format(FORMAT) : false;

      let daysRemains = false;

      if (endDate) {
        const months = Vue.moment(endDate, FORMAT).diff(
          Vue.moment(currentDate, FORMAT),
          "months"
        );
        const days = Vue.moment(endDate, FORMAT).diff(
          Vue.moment(currentDate, FORMAT),
          "days"
        );
        const hours =
          Vue.moment(endDate, FORMAT).diff(
            Vue.moment(currentDate, FORMAT),
            "hour"
          ) -
          days * 24;
        const minutes =
          Vue.moment(endDate, FORMAT).diff(
            Vue.moment(currentDate, FORMAT),
            "minutes"
          ) -
          Vue.moment(endDate, FORMAT).diff(
            Vue.moment(currentDate, FORMAT),
            "hour"
          ) *
          60;

        if (months > 1) {
          daysRemains = `${months} ${months > 1 ? 'months' : 'month'} remaining`
        }
        else if (days >= 1) {
          daysRemains = `${days} ${days > 1 ? "days" : "day"} remaining`
        }
        else if (hours >= 1) {
          daysRemains = `${hours} ${hours > 1 ? "hours" : "hour"} remaining`
        }
        else if (minutes > 0) {
          daysRemains = `${minutes} ${minutes > 1 ? "minutes" : "minute"} remaining`
        }
        else daysRemains = false

      }

      state.time.daysRemains = daysRemains;
    },
    setUpdates(state, payload) {
      state.updates = payload
    },
    setMilestones(state, payload) { state.milestones = payload.sort((a, b) => a.amount - b.amount) },

    setIndividuals(state, payload) {
      let array = payload.individuals;
      let individuals = [];
      if (array.length) {
        individuals = array.map((el, idx) => {
          return el = {
            url: `/fundraisers/${payload.url}/individuals/${el.id}`,
            number: `${idx + 1}.)`,
            profile_picture: el.photo,
            name: el.name,
            amount: `$${el.amount_raised ? el.amount_raised / 100 : 0}`
          }
        })
      }
      state.individuals = individuals
    },
    setTeams(state, payload) {
      let array = payload.teams;
      let teams = [];
      if (array.length) {
        teams = array.map((el, idx) => {
          return el = {
            url: `/fundraisers/${payload.url}/teams/${el.id}`,
            number: `${idx + 1}.)`,
            profile_picture: el.photo,
            name: el.name,
            amount: `$${el.amount_raised ? el.amount_raised / 100 : 0}`
          }
        })
      }
      state.teams = teams
    },

    setLastDonations(state, payload) {
      let lastDonations = [];
      if (payload.length) {
        lastDonations = payload.map((el, idx) => {
          return el = {
            initials: separateInitials(el.first_name, el.last_name),

            profile_picture: el.profile_picture,
            name: `${el.first_name} ${el.last_name}`,
            time: el.time_past,
            amount: `$${el.amount ? el.amount / 100 : 0}`
          }
        })
      }
      state.lastDonations = lastDonations
    },

    setSharedCount(state, payload) {
      let count = state.bannerInfo.shared_count
      state.bannerInfo.shared_count = payload ? payload : count
    }


  },
  actions: {
    async getApiFundraiser({ state, commit }, slug) {
      let fundraiser;
      try {
        await Vue.axios
          .get(`/public/fundraisers/layout/${slug}`)
          .then(res => res.data)
          .then(data => {
            commit('setFundraiserFull', data.fundraiser)
            fundraiser = data.fundraiser
            commit('setItem', data.fundraiser)
            commit('setDaysRemains', {
              start_date: data.fundraiser.start_date,
              end_date: data.fundraiser.end_date
            })
            commit('setUpdates', data.fundraiser.updates || [])
            commit('setMilestones', data.fundraiser.milestones || [])

            commit('setIndividuals', data.fundraiser)
            commit('setTeams', data.fundraiser)

            commit('setLastDonations', data.fundraiser.lastDonations || [])
          })

        commit('setLoader', false, { root: true })
      } catch (e) {
        console.log('e', e)
      }
      return fundraiser
    },
    async apiGetNumberShared({ state, commit }) {
      const url = state.item.url;
      try {
        Vue.axios.post(`/public/fundraisers/layout/${url}`)
          .then(res => res.data)
          .then(data => {
            commit('setSharedCount', +data.result);
          })
      } catch (e) { console.log(e) }
    },
  }
}
