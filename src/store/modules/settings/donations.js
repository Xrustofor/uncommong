import Vue from 'vue'

import { exportCSV } from "@/helpers/exportCSV";

export default {
  namespaced: true,
  state: {
    message: '',
    total: null,
    items: [],
    numberPages: 1,
    headerItems: [
      {
        key: "timestamp",
        value: "Timestamp",
        checkbox: true,
        icon: true,
        action: true,
        menuKey: "checkbox",
        menu: [
          {
            title: "Filter By:",
            items: [
              {
                key: "last_3",
                value: "Last 3 months",
              },
              {
                key: "last_6",
                value: "Last 6 months",
              },
              {
                key: "last_y",
                value: "Last Year",
              },
            ],
          },
        ],
      },
      {
        key: "organization",
        value: "Organization Name",
        icon: true,
        action: true,
      },
      {
        key: "donation_type",
        value: "Donation Type",
        icon: true,
        action: true,
      },
      {
        key: "payment_method",
        value: "Payment Method",
        icon: true,
        action: true,
        className: 'capitalize',
      },
      {
        key: "recurring",
        value: "Recurring?",
        booleanType: true,
        button: {
          primary: { color: 'yellow', text: 'Cancel' }
        },
      },
      {
        key: "amount",
        value: "Amount",
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
        key: "download",
        value: "Receipt",
        className: 'icon_cell'
      },
    ],
    loader: false,
  },
  getters: {
    getMessage(state) { return state.message },
    getItems(state) { return state.items },
    getHeaderItems(state) { return state.headerItems },
    getTotal(state) { return state.total },
    getLoader(state) { return state.loader },
    getNumberPages(state) { return state.numberPages },
  },
  mutations: {

    setItems(state, payload) {
      const items = [];
      if (payload.length) {
        payload.map(item => {
          items.push({
            ...item,
            amount: `$${item.amount / 100}`,
            fee: item.fee != null ? `$${(item.fee / 100).toFixed(2)}` : `$0`,
            timestamp: item.timestamp
              ? Vue.moment(item.timestamp).format("MM/DD/YYYY, h:mm a")
              : '',
          })
        });
        state.items = items;
      } else {
        state.items = [];
      }
    },
    setTotal(state, payload) { state.total = payload ? payload : 0 },
    setLoader(state, payload) { state.loader = payload },
    setHeaderItems(state, payload) { state.headerItems = payload },
    setNumberPages(state, payload) { state.numberPages = payload },
    setMessage(state, payload) { state.message = payload },
    setRemoveMonthlySubscription(state, payload) {
      const { token } = payload;
      const items = [];
      state.items.map(item => {
        if (item.recurring === token) {
          items.push({ ...item, recurring: null })
        } else {
          items.push({ ...item })
        }
      });
      state.items = items;
    },
  },
  actions: {
    async apiDonationsList({ commit }, payload) {
      commit('setLoader', true);
      const sort = payload.sort ? payload.sort : '';
      const perPage = payload.perPage;
      const order = payload.order ? payload.order : ''
      const search = payload.search ? payload.search : '';
      const page = payload.page ? payload.page : '';
      let success = false;
      try {
        await Vue.axios
          .get(`user/donations?sort=${sort}&per_page=${perPage}&order=${order}&search=${search}&page=${page}`)
          .then(res => res.data)
          .then(data => {
            commit('setLoader', true);

            if (data.data) {
              commit('setItems', data.data);
              commit('setTotal', data.total);
              commit('setNumberPages', data ? data.last_page : 1);

            } else {
              commit('setItems', data);
              commit('setTotal', 0);
              commit('setNumberPages', 1);

            }

            success = true;
          }).finally(() => commit('setLoader', false));
        return success;
      } catch (e) { console.log(e) }
    },

    async apiDownloadExport({ commit }, payload) {
      commit('setLoader', true);
      const itemsId = { donationIds: payload };
      try {
        await Vue.axios
          .post(`user/donations/export`, itemsId)
          .then(res => res.data)
          .then(data => {
            exportCSV(data);
            commit('setLoader', false);
          }).finally(() => commit('setLoader', false))

      } catch (e) { console.log(e) }

    },
    async apiDownloadExport({ commit }, payload) {
      commit('setLoader', true);
      const itemsId = { donationIds: payload };
      try {
        await Vue.axios
          .post(`user/donations/export`, itemsId)
          .then(res => res.data)
          .then(data => {
            exportCSV(data);
            commit('setLoader', false);
          }).finally(() => commit('setLoader', false))

      } catch (e) { console.log(e) }

    },
    async apiCenselDonateMonthly({ commit }, payload) {
      commit('setMessage', '');
      commit('setLoader', true);
      const { token } = payload;
      try {
        await Vue.axios
          .post(`public/recurring-payments/cancel`, { token })
          .then(res => res.data)
          .then(data => {
            if (data.message) commit('setMessage', data.message);
            commit('setRemoveMonthlySubscription', { token });
            commit('setLoader', false);
          }).finally(() => commit('setLoader', false))

      } catch (e) { console.log(e) }
    }
  }
}