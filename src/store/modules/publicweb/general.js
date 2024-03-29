import Vue from 'vue';
import store from '@/store'

export default {
  namespaced: true,
  state: {
    loading: false,
    message: '',
    cards: [
      {
        billing_details: Object,
        card: Object,
        created: '',
        customer: '',
        id: '',
        livemode: false,
        metadata: [],
        object: '',
        type: '',
      }
    ],
    bankAccounts: [
      {
        account_holder_name: '',
        account_holder_type: '',
        bank_name: '',
        country: '',
        currency: '',
        customer: '',
        default: true,
        fingerprint: '',
        id: null, last4: '',
        metadata: [],
        object: '',
        routing_number: '',
        status: ''
      }
    ],
  },
  getters: {
    getLoading(state) { return  state.loading },
    getMessage(state) { return state.message },
    getCards(state) { return state.cards },
    getBankAccounts(state) { return state.bankAccounts },
  },
  mutations: {
    setLoading(state, payload) { state.loading = payload },
    setMessage(state, payload) { state.message = payload },
    setCards(state, payload) {
      const defaultCardId = payload.default
      const items = payload.payment_methods.map(p => {
        return (defaultCardId === p.id) ? { ...p, default: true } : p
      });
      state.cards = items;
    },
    setbankAccounts(state, payload) {
      state.bankAccounts = payload;
    },
  },
  actions: {

    async apiGetIsBillingsExists({ commit }, payload) {
      commit("setLoading", true);
      commit("setMessage", '');
      let result = false;

      try {
        await Vue.axios.get(`user/donor-billings/exists`)
          .then(res => res.data)
          .then(data => {
            result = data.billingInfoExistence;
            commit("setLoading", false);
          }).finally(() => {
            commit("setLoading", false);
          });
      } catch (e) { console.log(e) };

      return result

    },

    async apiGetCards({ commit }) {
      commit("setMessage", '');
      commit("setLoading", true);
      let result = null
      try {
        await Vue.axios.get('/user/donor-billings/cards')
          .then(res => res.data)
          .then(data => {
            commit('setCards', data);
            result = data;
            commit("setLoading", false);
          }).finally(() => {
            commit("setLoading", false);
          });
  
      } catch (e) { console.log(e) }
      return result;
    },

    async apiGetBankAccounts({ commit }) {
      commit("setMessage", '');
      commit("setLoading", true);
      let result = null
      try {
        await Vue.axios.get('/user/donor-billings/bank-accounts')
          .then(res => res.data)
          .then(data => {
            if(!data.default) return;
            const defaultId = data.default;
            
            result = data.bank_accounts.map(p => {
              p.name = JSON.parse(JSON.stringify(p.bank_name));
              return p.id === defaultId ? {...p, default: true } : {...p}
            });

            commit("setbankAccounts", result);
            commit("setLoading", false);

          }).finally(() => { commit("setLoading", false) });
      } catch (e) { console.log(e) };
      return result;
    },

    async apiDonationCardPaymentBase({commit}, payload){
      commit("setMessage", '');
      const { organizationId, data } = payload;
      let result;
      try{
        await Vue.axios.post(
          `public/organizations/donation/card-payment/base/${organizationId}`,
          data
        ).then(res => res.data)
        .then(data => {
          if(data.client_secret || data.payment_method_id){
            result = {
              clientSecret: data.client_secret,
              paymentMethodId: data.payment_method_id,
            }
          }else{
            result = data
          }
        });
      }catch(e) {
        if (e.response.status === 403 && error.response.data.message) {
          Vue.swal({
              title: error.response.data.message,
              confirmButtonText: "OK",
          })
        }
        console.log(e)
      }
      return result;
    },

    async apiDonationTypeCardPaymentBase({ commit }, payload){
      commit("setMessage", '');
      const { organizationId, data } = payload;
      let result;
      try{
        await Vue.axios.post(`public/organizations/donation/card-payment/base-recurring/${organizationId}`, data)
          .then(res => res.data)
          .then(data => {
            if(data.client_secret || data.payment_method_id){
              result = {
                clientSecret: data.client_secret,
                paymentMethodId: data.payment_method_id,
              }
            }else{
              result = data
            }
          })
      }catch(e){ console.log(e) };
      return result;
    },

    async apiBankAccountPayment({commit}, payload) {
      commit("setMessage", '');
      const { organizationId, data } = payload;
      let result;

      try {
        await Vue.axios.post(`user/donations/bank-payment/base/${organizationId}`, data)
          .then(res => res.data)
          .then(data => {
            result = data;
          })

      } catch (e) { 
        if (e.response.status === 403 && error.response.data.message) {
          Vue.swal({
              title: error.response.data.message,
              confirmButtonText: "OK",
          })
        }
        console.log(e)
      }
      
      return result;
    },

    async apiBankAccountPaymentRecurring({commit}, payload) {
      commit("setMessage", '');
      const { organizationId, data } = payload;
      let result;
      try {
        await Vue.axios.post(`user/donations/bank-payment/base-recurring/${organizationId}`, data)
          .then(res => res.data)
          .then(data => {
            result = data;
          })

      } catch (e) { console.log(e) }
      
      return result;
    },



    async apiDonationSpecialCardPayment({commit}, payload){
      commit("setMessage", '');
      const { organizationId, productId, data } = payload;
      let result;
      try{
        await Vue.axios.post(
          `public/organizations/donation/card-payment/special/${organizationId}/${productId}`,
          data
        ).then(res => res.data)
        .then(data => {
          if(data.client_secret || data.payment_method_id){
            result = {
              clientSecret: data.client_secret,
              paymentMethodId: data.payment_method_id,
            }
          }else{
            result = data
          }
        });
      }catch(e) { console.log(e) }
      return result;
    },

    async apiBankAccountSpecialPayment({commit}, payload) {
      commit("setMessage", '');
      const { organizationId, productId, data } = payload;
      let result;


      try {
        await Vue.axios.post(`user/donations/bank-payment/special/${organizationId}/${productId}`, data)
          .then(res => res.data)
          .then(data => {
            result = data;
          })

      } catch (e) { console.log(e) }
      
      return result;
    },

    async apiDonationCardPaymentSweepstake({commit}, payload){
      commit("setMessage", '');
      const { organizationId, sweepstakeId, data } = payload;
      let result;
      try{
        await Vue.axios.post(
          `user/donations/sweepstake/card-payment/${sweepstakeId}/${organizationId}`,
          data
        ).then(res => res.data)
        .then(data => {
          if(data.client_secret || data.payment_method_id){
            result = {
              clientSecret: data.client_secret,
              paymentMethodId: data.payment_method_id,
            }
          }else{
            result = data;
          }
        });
      }catch(e) { 
        console.log(e);
        if (e.response.status === 422) {
          commit('setMessage', e.response.data.message);
        }

      }
      return result;
    },

    async apiDonationBankAccountSweepstake({commit}, payload){
      commit("setMessage", '');
      const { organizationId, sweepstakeId, data } = payload;
      let result;
      try{
        await Vue.axios.post(
          `user/donations/sweepstake/bank-payment/${sweepstakeId}/${organizationId}`,
          data
        ).then(res => res.data)
        .then(data => {
          result = data.message;
        });
      }catch(e) { console.log(e) }
      return result;
    },

    async apiPostCardPayment({commit}, payload){
      let result;
      commit("setMessage", '');
      const {fundraiserId, organizationId, data} = payload;
      
      try{
        await Vue.axios.post(
          `public/organizations/donation/card-payment/fundraiser/${organizationId}/${fundraiserId}`,
          data
        ).then(res => res.data)
         .then(data => {
          if(data.client_secret || data.payment_method_id){
            result = {
              clientSecret: data.client_secret,
              paymentMethodId: data.payment_method_id,
            }
          }else{
            result = data;
          }
        });
      }catch(e) { 
        console.log(e);
        if (e.response.status === 403 && e.response.data.message) {
          Vue.swal({
              title: e.response.data.message,
              confirmButtonText: "OK",
          })
        }

        if (e.response.status === 422) {
          commit('setMessage', e.response.data.message);
        }
      }
      return result;
    },
    async apiPostBankPayment({commit}, payload){
      let result;
      commit("setMessage", '');
      const {fundraiserId, organizationId, data} = payload;
      try{
          await Vue.axios
                .post(
                  `user/donations/bank-payment/fundraiser/${organizationId}/${fundraiserId}`,
                  data
                )
                .then(res => res.data)
                .then(data => {
                  result = data;
                })
      }catch(e) { console.log(e) }
      return result;
    }
  },
}