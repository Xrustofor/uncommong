import Vue from 'vue'
export default {
    namespaced: true,
    state: {
        total: null,
        items: [],
        numberPages: 1,
        headerItems: [
            {
                key: "created_at",
                value: "Timestamp",
                icon: true,
                action: true,
            },
            {
                key: "full_name",
                value: "Donor Name",
                icon: true,
                action: true,
            },
            {
                key: "amount",
                value: "Amount",
                icon: true,
                action: true,
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
                        created_at: item.created_at
                            ? Vue.moment(item.created_at).format("MM/DD/YYYY, h:mm a")
                            : '',
                        amount: item.amount != 0 ? `$${item.amount / 100}` : '$0',
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
        async apiP2PTeamMemberDonations({ commit }, payload) {
            commit('setLoader', true);
            const idTeam = payload.idTeam ? payload.idTeam : null;
            const idIndividual = payload.idIndividual ? payload.idIndividual : null;
            const sort = payload.sort ? payload.sort : '';
            const order = payload.order ? payload.order : ''
            const perPage = payload.per_page ? payload.per_page : 10;
            const page = payload.page ? payload.page : 1;
            const searchField = payload.search_field ? payload.search_field : 'all';
            const search = payload.search ? payload.search : '';
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/${idTeam}/members/donations/${idIndividual}?per_page=${perPage}&page=${page}&sort=${sort}&order=${order}&search_field=${searchField}&search=${search}`)
                    .then(res => res.data)
                    .then(data => {
                        if (data.donations) {
                            commit('setItems', data.donations.data);
                            commit('setTotal', data.donations.total);
                            commit('setNumberPages', data.donations ? data.donations.last_page : 1);
                        }
                        else {
                            commit('setItems', []);
                            commit('setTotal', 0);
                            commit('setNumberPages', 1);
                        }
                    })
                    .finally(() => {
                        commit('setLoader', false);
                    })
            } catch (e) { console.log(e) }
        },
    }
}