import Vue from 'vue'

import { exportCSV } from "@/helpers/exportCSV";

export default {
    namespaced: true,
    state: {
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
            },
            {
                key: "fundraiser_name",
                value: "Fundraiser Name",
                icon: true,
                action: true,
            },
            {
                key: "organization_name",
                value: "Organization Name",
                icon: true,
                action: true,
            },
            {
                key: "amount_donated",
                value: "Amount Donated",
                icon: true,
                action: true,
            },
            {
                key: "download",
                value: "Receipt",
                className: 'icon_cell diver-left'
            },
        ],
        loader: false,
    },
    getters: {
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
                        amount_donated: item.amount_donated != 0 ? `$${item.amount_donated / 100}` : 0,
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

    },
    actions: {
        async apiFundraisersList({ commit }, payload) {
            commit('setLoader', true);
            const sort = payload.sort ? payload.sort : '';
            const perPage = payload.perPage;
            const order = payload.order ? payload.order : ''
            const page = payload.page ? payload.page : '';
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/donations/fundraiser-payments?sortColumn=${sort}&sortOrder=${order}&perPage=${perPage}&page=${page}`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setLoader', true);

                        if (data.fundraiser_payments) {
                            commit('setItems', data.fundraiser_payments.data);
                            commit('setTotal', data.fundraiser_payments.total);
                            commit('setNumberPages', data.fundraiser_payments ? data.fundraiser_payments.last_page : 1);

                        } else {
                            commit('setItems', []);
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
            const itemsId = { donations_ids: payload };

            try {
                await Vue.axios
                    .post(`/user/donations/fundraiser-payments/export`, itemsId)
                    .then(res => res.data)
                    .then(data => {
                        exportCSV(data);
                        commit('setLoader', false);
                    }).finally(() => commit('setLoader', false))

            } catch (e) { console.log(e) }
        },
    }
}