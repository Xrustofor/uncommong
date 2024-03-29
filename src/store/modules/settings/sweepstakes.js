import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    sweepstakes: [],
    headers: [
      {
        key: "accordion",
        value: "",
        icon: false,
        action: false,
        className: 'small'
      },
      {
        key: "title",
        value: "Title",
        icon: true,
        action: true,
      },
      {
        key: "days_left",
        value: "Time Remaining",
        icon: true,
        action: true,
      },
      {
        key: "entries",
        value: "Entries",
        icon: true,
        action: true,
      },
      {
        key: "paid",
        value: "Paid",
        icon: true,
        action: true,
      },
      {
        key: "fee",
        value: "CC Fee",
        icon: false,
        action: false,
      },
      {
        key: "organization_name",
        value: "Organization Supported",
        icon: false,
        action: false,
      },
      {
        key: "start_date",
        value: "Start date, time",
        icon: true,
        action: true,
      },
      {
        key: "end_date",
        value: "End date, time",
        icon: true,
        action: true,
        //accordion: true
      },
    ],
    loader: false,
    total: 0,
    numberPages: 1,
  },
  getters: {
    getItems(state) { return state.sweepstakes },
    getHeaderItems(state) { return state.headers },
    getTotal(state) { return state.total },
    getNumberPages(state) { return state.numberPages },
    getLoader(state) { return state.loader },
  },
  mutations: {
    setItems(state, payload) {
      const items = [];
      var current = Vue.moment()
        .tz("America/New_York")
        .format("MM.DD.YYYY HH:mm:ss");
      if (payload.length) {

        const FORMAT = "MM.DD.YYYY HH:mm:ss"

        payload.map(item => {
          let accordionElements = [];
          if (item.history && item.history.length > 0) {
            accordionElements = item.history.map(el => {
              return el = {
                ...el,
                days_left: '',
                organization_name: el.name ? el.name : '-',
                paid: el.amount ? `$${el.amount / 100}` : '$0',
                fee: el.fee != null ? `$${(el.fee / 100).toFixed(2)}` : `-`,
                start_date: item.start_date
                  ? Vue.moment(item.start_date).format("MM/DD/YYYY, hh:mm a")
                  : '',
                end_date: item.end_date
                  ? Vue.moment(item.end_date).format("MM/DD/YYYY, hh:mm a")
                  : '',
              }
            });
          }
          var endTime = Vue.moment(item.end_date, "YYYY-MM-DD HH:mm:ss").format(FORMAT);
          var hours = Vue.moment(endTime, FORMAT).diff(Vue.moment(current, FORMAT), "hours"),
            minuts = Vue.moment(endTime, FORMAT).diff(Vue.moment(current, FORMAT), "minutes"),
            days = Vue.moment(endTime, FORMAT).diff(Vue.moment(current, FORMAT), "days");

          var hoursLeft, daysLeft, minutsLeft;
          hoursLeft =
            hours > 24
              ? hours - Math.floor(hours / 24) * 24
              : hours > 0
                ? hours
                : 0;
          hoursLeft = hoursLeft === 0 ? '' : hoursLeft + " hrs";
          daysLeft = +days === 1 ? days + " day" : +days > 1 ? days + " days" : "";
          minutsLeft = +minuts + ' minuts';

          var daysLeft = days > 0 ? daysLeft + " " + hoursLeft : hours > 0 ? hoursLeft : minutsLeft;
          items.push({
            ...item,
            paid: '$' + (item.paid / 100).toFixed(2),
            fee: '-',
            organization_name: '-',
            days_left: +item.days_left <= 0 ? "Completed" : daysLeft,
            start_date: item.start_date
              ? Vue.moment(item.start_date).format("MM/DD/YYYY, hh:mm a")
              : '',
            end_date: item.end_date
              ? Vue.moment(item.end_date).format("MM/DD/YYYY, hh:mm a")
              : '',
            accordionElements: [...accordionElements]
          })
        });
        state.sweepstakes = items;
      } else {
        state.sweepstakes = [];
      }
    },
    setHeaderItems(state, payload) {
      state.headers = payload
    },
    setTotal(state, payload) { state.total = payload },
    setLoader(state, payload) { state.loader = payload },
    setNumberPages(state, payload) { state.numberPages = payload },
  },
  actions: {
    async getApiSweepstakesList({ commit }, { page, per_page, sort, order }) {
      commit('setLoader', true);
      let success = false;
      try {
        await Vue.axios
          .get(`/user/entered-sweepstakes?page=${page}&per_page=${per_page}&sort=${sort}&order=${order}`)
          .then(res => res.data)
          .then(data => {
            commit('setTotal', data.total);
            commit('setLoader', true);
            if (data.data) {
              commit('setItems', data.data);
              //commit('setNumberPages', sweep_entrants ? sweep_entrants.last_page : 1);
            } else {
              commit('setItems', []);
              //commit('setNumberPages', 1);
            }
            success = true;
          }).finally(() => commit('setLoader', false));
        return success;
      } catch (e) { console.log(e) }




    }
  }
}