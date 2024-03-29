
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        sweepstakes: [],
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
            {
                id: "coming_soon",
                key: " coming_soon",
                title: " Coming Soon",
                count: 0,
            },
        ],
        searchText: [],
        page: false,
        prevPage: 0,
    },

    getters: {
        getFocuses(state) { return state.focuses },
        getSweepstakes(state) { return state.sweepstakes },
        getPage(state) { return state.page },
        getNumberPages(state) { return state.numberPages },
        getTotal(state) { return state.total },
        getStatuses(state) { return state.statuses },
        getSearchMatched(state) { return state.searchText }
    },
    mutations: {
        setFocuses(state, payload) {
            if (payload !== false) { state.focuses = payload }
        },
        setTotal(state, payload) { state.total = payload ? payload : 0 },
        setNumberPages(state, payload) { state.numberPages = payload },
        setSweepstakes(state, payload) { state.sweepstakes = payload },
        pushSweepstakes(state, payload) {
            if (state.prevPage != payload.page) {
                let sweepstakes = [];
                if (Array.isArray(payload.sweep)) {
                    sweepstakes = state.sweepstakes.concat(payload.sweep)
                }
                else {
                    let newAr = []
                    for (let key in payload.sweep) {
                        newAr.push(payload.sweep[key])
                    }
                    sweepstakes = state.sweepstakes.concat(newAr)
                }

                state.sweepstakes = sweepstakes
            }
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
        setPrevPage(state, payload) { state.prevPage = payload },
    },
    actions: {
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
        async getApiSweepstakes({ commit }, { search, sort_sweepstakes, sort_focuses, status, filter_by, page, type }) {
            commit('canChangePage', false)
            let success = false, clickType = type ? type : null;
            let params = {
                search: search ? search : '',
                status: status ? status : '',
                sort_sweepstakes: sort_sweepstakes ? sort_sweepstakes : "newest",
                sort_focuses: sort_focuses ? sort_focuses : "count",
                page: page ? page : 1,
            };

            if (filter_by.length > 0) {
                params.focuses = filter_by;
            }

            try {
                await Vue.axios
                    .get(`/public/sweepstakes`, { params: params })
                    .then(res => res.data)
                    .then(data => {
                        success = true

                        if (data.sweepstakes.length === 12) {
                            commit('canChangePage', true)
                        } else { commit('canChangePage', false) }
                        if (page > 1) commit('pushSweepstakes', { sweep: data.sweepstakes, page: params.page });
                        else commit('setSweepstakes', data.sweepstakes);

                        commit('setFocuses', clickType === 'focus' ? false : data.focuses)
                        commit('setFilterStatuses', clickType === 'status' ? false : data.statuses)

                        commit('setPrevPage', params.page);
                    })
                    .catch((error) => { });
                return success
            } catch (e) { console.log(e) }
        },
        async searchMatchedText({ commit }, payload) {
            try {
                await Vue.axios
                    .get(`/public/sweepstakes/search/match-names?name=${payload}`)
                    .then(res => res.data)
                    .then(data => {
                        let matches = {
                            matchesArray: data,
                            text: payload
                        }
                        commit('setMatchedText', matches)
                    })
            } catch (e) { console.log(e) }

        }
    },
}