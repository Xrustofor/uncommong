import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import { separateInitials } from "@/helpers/script";

export default {
  namespaced: true,
  state: {
    fundraiser: {},
    individual: {},
    canEdit: false,
    individualTeam: false,
    bannerInfo: {},
    time: {
      daysRemains: false,
    },
    updates: [],
    milestones: [],
    individuals: [],
    teams: [],
    lastDonations: [],
    individualPlace: [],
    individualTeamPlace: [],
    teamPlace: null,
    donationAllowed: false
  },
  getters: {
    getBannerInfo(state) { return state.bannerInfo },
    getTime(state) { return state.time },
    getUpdates(state) { return state.updates },
    getMilestones(state) { return state.milestones },
    getIndividuals(state) { return state.individuals },
    getTeams(state) { return state.teams },
    getLastDonations(state) { return state.lastDonations },
    getIndividualPlace(state) { return state.individualPlace },
    getTeamPlace(state) { return state.teamPlace },
    getIndividualTeamPlace(state) { return state.individualTeamPlace },
    getDonationAllowed(state) { return state.donationAllowed },
  },
  mutations: {
    setState(state, payload) {
      state.fundraiser = payload.fundraiser
      state.individual = payload.individual
      state.canEdit = payload.canEdit

      state.donationAllowed = payload.fundraiser.organization.is_donation_allowed


      state.bannerInfo = {
        cover_photo: payload.fundraiser.cover_photo,
        name: payload.fundraiser.name,
        short_description: payload.fundraiser.short_description,
        amount_raised: payload.fundraiser.amount_raised,
        goal: payload.fundraiser.goal,
        status: payload.fundraiser.status,
        organization_image: payload.fundraiser.organization.image,
        organization_slug: payload.fundraiser.organization.slug,
        organization_name: payload.fundraiser.organization.name,
        uniqueDonorsCount: payload.fundraiser.uniqueDonorsCount,
        shared_count: payload.fundraiser.shared_count,
      }
    },
    setIndividualTeam(state, payload) {
      state.individualTeam = payload
    },
    setSharedCount(state, payload) {
      let count = state.individual.shared_count;
      let fundraiserCount = state.bannerInfo.shared_count;

      state.individual.shared_count = payload ? payload : count;
      state.bannerInfo = {
        ...state.bannerInfo,
        shared_count: +fundraiserCount + 1
      }
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

    setIndividualPlaceInList(state, payload) {
      let individualPlace = []
      if (payload.individual_place > 4) {
        let item = {
          number: `${payload.individual_place + 1}.)`,
          profile_picture: payload.photo,
          name: payload.name,
          amount: `$${payload.amount_raised ? payload.amount_raised / 100 : 0}`
        }
        individualPlace.push(item)
      }
      state.individualPlace = individualPlace
    },

    setIndividualTeamPlaceInList(state, payload) {
      let individualTeamPlace = [];
      if (payload != null) {
        state.teamPlace = payload.team_place;
        if (payload.team_place > 4) {
          let item = {
            number: `${payload.team_place + 1}.)`,
            profile_picture: payload.photo,
            name: payload.name,
            amount: `$${payload.amount_raised ? payload.amount_raised / 100 : 0}`
          }
          individualTeamPlace.push(item)
        }
      }

      state.individualTeamPlace = individualTeamPlace
    }
  },
  actions: {
    async apiGetIndividual({ state, commit, dispatch }, { fundId, individualId }) {
      let result = false;
      try {
        await Vue.axios
          .get(`/public/fundraisers/layout/${fundId}/individual/${individualId}`)
          .then(res => res.data.result)
          .then(data => {
            result = true
            commit('setIndividualTeam', data.team)
            commit('setState', data)
            commit('setDaysRemains', {
              start_date: data.fundraiser.start_date,
              end_date: data.fundraiser.end_date
            })
            commit('setUpdates', data.individual.updates || [])
            commit('setMilestones', data.fundraiser.milestones || [])

            commit('setIndividuals', data.fundraiser)
            commit('setTeams', data.fundraiser)

            commit('setLastDonations', data.fundraiser.lastDonations || [])
            commit('setIndividualPlaceInList', data.individual)
            commit('setIndividualTeamPlaceInList', data.team)
            return data
          })
        return result;
      } catch (e) {
        console.log('e', e)
      }
    },
    async apiPostUpdate({ state, commit, dispatch }, data) {
      console.log('apiPostUpdate', data)
      try {
        await Vue.axios
          .post(`/user/fundraisers/individual/${state.individual.id}/updates`, data.body)
          .then(res => console.log('posted', res.data))
          .then(() => dispatch('apiGetIndividual', { fundId: state.fundraiser.url, individualId: state.individual.id }))
      } catch (e) {
        console.log('e', e)
      }
    },
    async apiPutUpdate({ state, commit, dispatch }, data) {
      try {
        await Vue.axios
          .put(`/user/fundraisers/individual/${state.individual.id}/updates/${data.updateId}`, data.body)
          .then(res => console.log('posted', res.data))
          .then(() => dispatch('apiGetIndividual', { fundId: state.fundraiser.url, individualId: state.individual.id }))
      } catch (e) {
        console.log('e', e)
      }
    },
    async apiPutIndividual({ state, commit, dispatch }, data) {
      try {
        await Vue.axios
          .put(`/user/fundraisers/individual/${state.individual.id}`, data.body)
          .then(res => res.data)
          .then(() => dispatch('apiGetIndividual', { fundId: state.fundraiser.url, individualId: state.individual.id }))
      } catch (e) {
        console.log('e', e)
      }
    },

    async apiGetNumberShared({ state, commit }, { fundId, individualId }) {
      try {
        Vue.axios.post(`/public/fundraisers/layout/${fundId}/individual/${individualId}`)
          .then(res => res.data)
          .then(data => {
            commit('setSharedCount', +data.result);
          })
      } catch (e) { console.log(e) }
    },
  }
}
