import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        total: null,
        items: [],
        numberPages: 1,
        headerItems: [
            {
                key: "image",
                value: "",
                image: true,
                defaultImage: true
            },
            {
                key: "name",
                value: "Team Name",
                icon: true,
                action: true,
            },
            {
                key: "progress",
                value: "Progress",
                icon: true,
                action: true,
                progress: true
            },
            {
                key: "contributors",
                value: "Total Contributors",
                icon: true,
                action: true,
            },
            {
                key: "view",
                value: "View",
                className: 'icon_cell center diver-left',
                viewActions: true
            }
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
                        image: item.photo ? item.photo : '',
                        contributors: item.contributors || 0,
                        progress: {
                            amount: item.amount_raised != 0 ? (item.amount_raised / 100) : 0,
                            goal: item.goal ? (item.goal / 100) : 0
                        },
                        view: [
                            { key: 'fundraiser', title: 'View Fundraiser', link: `${process.env.VUE_APP_UNCOMMONGOOD}/fundraisers/${item.url}` },
                            { key: 'team', title: 'View Team Page', hidden: item.team_id ? false : true, link: `${process.env.VUE_APP_UNCOMMONGOOD}/fundraisers/${item.url}/teams/${item.team_id}` },
                            { key: 'individual', title: 'View Individual Page', hidden: item.individual_id ? false : true, link: `${process.env.VUE_APP_UNCOMMONGOOD}/fundraisers/${item.url}/individuals/${item.individual_id}` },
                        ]
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
        async apiCampaignsList({ commit }, payload) {
            commit('setLoader', true);
            const sort = payload.sort ? payload.sort : '';
            const perPage = payload.per_page;
            const order = payload.order ? payload.order : ''
            const page = payload.page ? payload.page : '';
            const search = payload.search ? payload.search : '';
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/campaigns/list?sortColumn=${sort}&sortOrder=${order}&perPage=${perPage}&page=${page}&search=${search}`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setLoader', true);
                        if (data.campaigns) {
                            commit('setItems', data.campaigns.data);
                            commit('setTotal', data.campaigns.total);
                            commit('setNumberPages', data.campaigns ? data.campaigns.last_page : 1);

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
    }
}
