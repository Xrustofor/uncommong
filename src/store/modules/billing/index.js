import Vue from 'vue'
import { firstLetterBig } from "@/helpers/script";

export default {
    namespaced: true,
    state: {
        billingExists: false,
        checkoutSpecial: null,
        checkoutBase: null,

        specialDonateMessage: '',
        baseDonateMessage: '',

        specialDonateError: null,
        donateError: null
    },
    getters: {
        getBillingExists(state) { return state.billingExists },
        getCheckoutSpecial(state) { return state.checkoutSpecial },
        getCheckoutBase(state) { return state.checkoutBase },

        getSpecialDonateMessage(state) { return state.specialDonateMessage },
        getBaseDonateMessage(state) { return state.baseDonateMessage },

        getSpecialDonateError(state) { return state.specialDonateError },
        getDonateError(state) { return state.donateError },
    },
    mutations: {
        setBillingExists(state, payload) { state.billingExists = payload },
        setCheckoutSpecial(state, payload) { state.checkoutSpecial = payload },
        setCheckoutBase(state, payload) { state.checkoutBase = payload },

        specialDonateMessage(state, payload) {
            state.specialDonateMessage = firstLetterBig(payload)
        },
        baseDonateMessage(state, payload) {
            state.baseDonateMessage = firstLetterBig(payload)
        },

        setSpecialDonateError(state, payload) {
            state.specialDonateError = firstLetterBig(payload)
        },
        setDonateError(state, payload) {
            state.donateError = firstLetterBig(payload)
        },
    },

    actions: {

        async checkBillingExists({ commit }) {
            try {
                await Vue.axios
                    .get("/user/donor-billings/exists")
                    .then((res) => {
                        commit('setBillingExists', res.data.billingInfoExistence);
                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }

        },

        async getCheckoutSpecial({ commit }, payload) {
            commit('setCheckoutSpecial', null);
            try {
                await Vue.axios
                    .post(`/public/organizations/donation/get-checkout-special/${payload.id}`, payload.product)
                    .then((res) => {
                        commit('setCheckoutSpecial', res.data.sessionId);
                    })
                    .catch((error) => {
                        commit('specialDonateError', error.response.data.message);
                    });
            } catch (e) { console.log(e) }

        },
        async getCheckoutBase({ commit }, payload) {
            try {
                await Vue.axios
                    .post(`/public/organizations/donation/get-checkout-base/${payload.id}`, payload.product)
                    .then((res) => {
                        commit('setCheckoutBase', res.data.sessionId);
                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }

        },

        async baseDonate({ commit }, { id, donateAmount }) {
            var amount = {
                amount: donateAmount
            }
            try {
                await Vue.axios
                    .post(`/user/donations/base/${id}`, amount)
                    .then((res) => {
                        commit('baseDonateMessage', res.data.message)
                        commit('setDonateError', null)
                    })
                    .catch((error) => {
                        commit('setDonateError', error.response.data.message)
                    });
            } catch (e) { console.log(e) }
        },

        async specialDonate({ commit }, { id, product_id, count }) {
            var productId = {
                product_id: product_id,
                count: count
            }
            try {
                await Vue.axios
                    .post(`/user/donations/special/${id}`, productId)
                    .then((res) => {
                        commit('specialDonateMessage', res.data.message)
                    })
                    .catch((error) => {
                        commit('setSpecialDonateError', error.response.data.message)
                    });
            } catch (e) { console.log(e) }

        },

        setSpecialDonateError({ commit }, payload) {
            commit('setSpecialDonateError', payload)
        },
        setDonateError({ commit }, payload) {
            commit('setDonateError', payload)
        }

    },
}