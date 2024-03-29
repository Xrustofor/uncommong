export default {
    namespaced: true,
    state: {
        donate: {}
    },
    actions: {
        startDonation({ commit }, payload) {
            commit("startDonation", payload);
        },
    },
    mutations: {
        startDonation(state, payload) {
            state.donate = payload
        },
    },
    getters: {
        getStartedDonateSlug(state) {
            return state.donate.slug;
        },
    }
}