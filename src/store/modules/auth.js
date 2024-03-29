import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

export default {
    namespaced: true,
    state: {
        registration_block: false,
        access_token: null,
        accountLocked: {
            isUserBlocked: false,
            errorText: '',
        },
        resetPassword: false
    },
    getters: {
        registrationBlock(state) {
            return state.registration_block
        },
        getToken(state) {
            return state.access_token
        },
        isAuthenticated(state) {
            if (state.access_token != null) {
                return true;
            } else return false
        },
        accountLocked(state) {
            return state.accountLocked;
        },
        resetPassword(state) {
            return state.resetPassword;
        },
    },
    mutations: {
        registrationBlock(state, data) {
            state.registration_block = data
        },
        authUser(state, access_token) {
            Vue.$cookies.set("access_token", access_token.access_token, access_token.expires_in)
            state.access_token = access_token.access_token
        },
        accountLocked(state, { isUserBlocked, error }) {
            state.accountLocked.errorText = error;
            state.accountLocked.isUserBlocked = isUserBlocked
        },
        resetPassword(state, payload) {
            state.resetPassword = payload
        },
    },
    actions: {
        registrationBlock({ commit }, data) {
            commit('registrationBlock', data);
        },
        authUser({ commit }, authData) {
            commit('authUser', authData.token)
        },
        singup({ commit }, authData) {
            commit('authUser', authData.token)
            commit('user/setUser', authData.user, { root: true })
        },
        login({ commit }, authData) {
            commit('user/setUser', authData.user, { root: true })
            commit('authUser', authData.token)
        },
        accountLocked({ commit }, payload) {
            commit("accountLocked", payload);
        },
        resetPassword({ commit }, payload) {
            commit("resetPassword", payload);
        },
    },
}