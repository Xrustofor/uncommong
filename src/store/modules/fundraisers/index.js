import fundraiser from './fundraiser.js'
import team from './team'
import individual from './individual'
import Vue from 'vue'

export default {
    fundraiser,
    namespaced: true,
    modules: { fundraiser, team, individual },
    state: {
        items: [],
        fundraiserItem: {},
        total: 0,
        numberPages: 1,
        focuses: [],
        statuses: [
            {
                id: "ending_soon",
                key: "ending_soon",
                title: "Ending Soon",
                count: 0,
            },
            {
                id: "active",
                key: "active",
                title: "Currently Active",
                count: 0,
            },
            {
                id: "completed",
                key: "completed",
                title: "Completed",
                count: 0,
            },
        ],
        searchText: [],

        pageNow: 1,
        lastPage: 1,
        page: false,
        modelId: null,
        organization: {},
    },

    getters: {
        getFocuses(state) { return state.focuses },
        getItems(state) { return state.items },
        getFundraiserItem(state) { return state.fundraiserItem },
        getNumberPages(state) { return state.numberPages },
        getTotal(state) { return state.total },
        getStatuses(state) { return state.statuses },
        getSearchMatched(state) { return state.searchText },
        getPage(state) { return state.page },
        getOrganization(state) { return state.organization },
        getModelId(state) { return state.modelId },
    },
    mutations: {
        setFocuses(state, payload) {
            if (payload !== false) { state.focuses = payload }
        },
        setFundraiserItem(state, payload) {
            state.fundraiserItem = {
                ...payload,
                subtitle: payload.organization ? payload.organization.focus.title : null,
                organization_image: payload.organization.image,
                organization_slug: payload.organization.slug,
                organization_name: payload.organization.name
            }
        },
        setTotal(state, payload) { state.total = payload ? payload : 0 },
        setNumberPages(state, payload) { state.numberPages = payload },
        setItems(state, payload) {
            state.items = payload.map(el => {
                return el = {
                    ...el,
                    amount_raised: el.amount_raised != 0 ? (el.amount_raised / 100) : 0,
                    goal: el.goal != 0 ? (el.goal / 100) : 0
                }
            })
        },
        pushItems(state, payload) {
            let funds = payload.map(el => {
                return el = {
                    ...el,
                    amount_raised: el.amount_raised != 0 ? (el.amount_raised / 100) : 0,
                    goal: el.goal != 0 ? (el.goal / 100) : 0
                }
            });
            let items = state.items.concat(funds);
            state.items = items;
        },
        setFilterStatuses(state, payload) {
            if (payload !== false) {
                let newFilterStatuses = [];
                newFilterStatuses = state.statuses.map((el) => {
                    return (el = {
                        ...el,
                        count: payload[el.id],
                    });
                });
                state.statuses = newFilterStatuses;
            }
        },
        setMatchedText(state, { matchesArray, text }) {
            matchesArray.forEach(element => {
                element.full_match = element.name === text ? true : false
            });
            state.searchText = matchesArray
        },
        canChangePage(state, payload) { state.page = payload; },
        setOrganization(state, payload) {
            state.organization = { accountId: '', id: null, name: '' }
            if (!payload) return;
            state.organization = {
                accountId: payload.account_id,
                id: payload.id,
                name: payload.name
            }
        },
        setModelId(state, payload) { state.modelId = payload },
        setSharedCount(state, payload) {
            let count = state.fundraiserItem.shared_count
            state.fundraiserItem.shared_count = payload ? payload : count
        },
    },
    actions: {
        async apiGetNumberShared({ state, commit }) {
            const url = state.fundraiserItem.url;
            try {
                Vue.axios.post(`/public/fundraisers/layout/${url}`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setSharedCount', +data.result);
                    })
            } catch (e) { console.log(e) }
        },
        async getApiFocuses({ commit }) {
            try {
                await Vue.axios
                    .get(`/public/focuses`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setFocuses', data.focuses)
                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }
        },
        async getApiItems({ commit }, { search, sort_fundraisers, sort_focuses, status, filter_by, page, type }) {
            commit('canChangePage', false)
            let success = false, clickType = type ? type : null;
            let params = {
                search: search ? search : '',
                filter: status ? status : '',
                sort_fundraisers: sort_fundraisers ? sort_fundraisers : "newest",
                sort_focuses: sort_focuses ? sort_focuses : "count",
                page: page ? page : 1,
            };

            if (filter_by.length > 0) {
                params.focuses = filter_by;
            }

            try {
                await Vue.axios
                    .get(`/public/fundraisers/list`, { params: params })
                    .then(res => res.data)
                    .then(data => {
                        success = true

                        if (params.page < data.fundraisers.last_page) {
                            commit('canChangePage', true)
                        } else { commit('canChangePage', false) }


                        if (params.page > 1) commit('pushItems', data.fundraisers.data);
                        else commit('setItems', data.fundraisers.data);

                        commit('setFocuses', clickType === 'focus' ? false : data.focuses)
                        commit('setFilterStatuses', clickType === 'status' ? false : data.statuses)
                    })
                    .catch((error) => { });
                return success
            } catch (e) { console.log(e) }
        },
        async searchMatchedText({ commit }, payload) {
            try {
                await Vue.axios
                    .get(`/public/fundraisers/list/search-names?name=${payload}`)
                    .then(res => res.data)
                    .then(data => {
                        let matches = {
                            matchesArray: data,
                            text: payload
                        }
                        commit('setMatchedText', matches)
                    })
            } catch (e) { console.log(e) }

        },

        async apiGetfundraiserData({ commit }, payload) {
            const { slug } = payload;
            try {
                await Vue.axios
                    .get(`/public/fundraisers/layout/${slug}`)
                    .then(res => res.data.fundraiser)
                    .then(fundraiser => {
                        commit('setFundraiserItem', fundraiser);
                        commit('setModelId', fundraiser.id);
                        commit('setOrganization', fundraiser.organization);
                    })
            } catch (e) { console.log(e) }

        },
    },
}
