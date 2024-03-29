export default {
    namespaced: true,
    state: {
        pageSettings: {
            title: ''
        },
    },
    actions: {
        pageSettingsTitle({ commit }, payload) {
            commit("pageSettingsTitle", payload);
        },
    },
    mutations: {
        pageSettingsTitle(state, payload) {
            state.pageSettings.title = payload
        },
    },
    getters: {
        pageSettings(state) {
            return state.pageSettings;
        },
    }
}