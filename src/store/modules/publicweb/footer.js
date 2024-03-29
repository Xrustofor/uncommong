import Vue from 'vue';
import moment from 'vue-moment';
export default {
  namespaced: true,
  state: {
    sweepstakesData: [],
    loade: false,
  },
  getters: {
    getSweepstakesData(state) { return state.sweepstakesData },
    getLoade(state) { return state.loade }
  },
  mutations: {
    setSweepstakesData(state, payload) {
      const items = [];
      const FORMAT = 'MM.DD.YYYY HH:mm:ss';
      payload.data.map(p => {
        const startDate = Vue.moment(p.details.start_date, 'YYYY-MM-DD HH:mm:ss').format(FORMAT),
          endDate = Vue.moment(p.details.end_date, 'YYYY-MM-DD HH:mm:ss').format(FORMAT);

        const currentDate = Vue.moment().tz("America/New_York").format(FORMAT);
        if (p.details.id != payload.id) {
          items.push({
            ...p,
            time: {
              startDate,
              endDate,
              starts: +Vue.moment(currentDate, FORMAT).diff(Vue.moment(startDate, FORMAT), "minuts") > 0
                ? true
                : false,
              days: +Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days"),
              hours: +Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), 'hour') - +Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days") * 24,
              minutes: +Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "minutes") - (+Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), 'hour') * 60),
            }
          })
        }
      })
      state.sweepstakesData = items;
    },
    setLoade(state, payload) { state.loade = payload }
  },
  actions: {
    async apiGetSweepstakesData({ commit }, id) {
      var result = {
        id: id,
        data: []
      }
      commit('setSweepstakesData', result);
      commit('setLoade', true);
      try {
        await Vue.axios.get(`public/sweepstakes/latest-active`)
          .then(res => res.data)
          .then(data => {
            result.data = data;
            commit('setSweepstakesData', result);
            commit('setLoade', false);
          }).finally(() => { commit('setLoade', false) });
      } catch (e) { console.log(e) }

    }
  }
}