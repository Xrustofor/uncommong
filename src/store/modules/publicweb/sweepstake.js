import Vue from 'vue';
import store from '@/store'

export default {
  namespaced: true,
  state: {
    details: {
      id: null,
      startDate: '',
      endDate: '',
      focus: { id: '', title: '' },
      headline: '',
      helpingToDescription: '',
      helpingToHeader: '',
      image: '',
      imageAlt: '',
      name: '',
      organizationFocusId: null,
      subtitle: '',
      sharedCount: 0,
      selectDonate: null,
      rules: '',
      sweepstakeId: null,
    },
    donateList: [
      { entries: 100, colorIcon: '#6DB5D1', price: 10 },
      { entries: 250, colorIcon: '#D3584B', price: 25 },
      { entries: 500, colorIcon: '#9A83B7', price: 50 }
    ],
    organizations: [{ id: null, focus: '', focusId: null, name: '' }],
    prizes: {
      images: [],
      aboutPrize: '',
      caption: '',
      count: '',
      descriptions: [{ id: null, description: '', sweepstake_prize_id: null }],
      widgetTitle: "Donate to Enter",
      widgetText: "You may not win but you definitely won't lose",
      widgetImage: "",
    },
    sweepstakeDetailId: null,
    sweepstakePrizeId: null,
    donorsCount: 0,
    organizationsImages: [],
    loaded: false,
    loadedDetails: false,
    sessionId: '',
    message: '',
    time: null,
    simpleTime: null,
    billingInfoExistence: null,
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
    sliderItems: null,
    pageFreeDonation: false
  },
  getters: {
    getDetails(state) { return state.details },
    getOrganizations(state) { return state.organizations },
    getPrizes(state) { return state.prizes },
    getSweepstakeDetailId(state) { return state.sweepstakeDetailId },
    getSweepstakePrizeId(state) { return state.sweepstakePrizeId },
    getSocialItems(state) { return state.socialItems },
    getDonateList(state) { return state.donateList },
    getDonorsCount(state) { return state.donorsCount },
    getOrganizationsImg(state) { return state.organizationsImages },
    getLoaded(state) { return state.loaded },
    getId(state) { return state.id },
    getSharedCount(state) { return state.sharedCount },
    getSessionId(state) { return state.sessionId },
    getMessage(state) { return state.message },
    getSelectDonate(state) { return state.selectDonate },
    getLoadedDetails(state) { return state.loadedDetails },
    getTime(state) { return state.time },
    getSimpleTime(state) { return state.simpleTime },
    getBillingInfoExistence(state) { return state.billingInfoExistence },
    getCards(state) { return state.cards },
    getBankAccounts(state) { return state.bankAccounts },
    getSliderItems(state) { return state.sliderItems },
    getSweepstakeId(state) { return state.sweepstakeId },
    getPageFreeDonation(state) { return state.pageFreeDonation }
  },
  mutations: {
    setPageFreeDonation(state, payload) {
      state.pageFreeDonation = payload
    },
    setSimpleTime(state, payload) {
      state.simpleTime = payload
    },
    setTime(state, payload) {

      const FORMAT = "YYYY.MM.DD HH:mm:ss"
      const currentDate = Vue.moment().tz("America/New_York").format(FORMAT);

      const startDate = payload.startDate ? Vue.moment(payload.startDate, "YYYY-MM-DD HH:mm:ss").format(FORMAT) : currentDate;
      const endDate = payload.endDate ? Vue.moment(payload.endDate, "YYYY-MM-DD HH:mm:ss").format(FORMAT) : currentDate;

      const startDaysDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days");
      const starHoursDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "hour") - (startDaysDiff * 24);
      const starMinutesDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "minutes") - (startDaysDiff * 24 * 60);
      const starSecondsDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "seconds");

      const endDaysDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days");
      const endHoursDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "hour") - (endDaysDiff * 24);
      const endMinutesDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "minutes") - Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "hour") * 60;
      const endSecondsDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "seconds");

      const item = {
        startDate,
        endDate,
        active: +starSecondsDiff < 0 && endSecondsDiff > 0,
        startTime: {
          days: startDaysDiff,
          hours: starHoursDiff,
          minutes: starMinutesDiff,
          seconds: starSecondsDiff,
        },
        endTime: {
          days: endDaysDiff,
          hours: endHoursDiff,
          minutes: endMinutesDiff,
          seconds: endSecondsDiff,
        }
      }
      state.time = item;
    },

    setDetails(state, payload) { state.details = payload },
    setOrganizations(state, payload) { state.organizations = payload },
    setPrizes(state, payload) { state.prizes = payload },
    setSweepstakeDetailId(state, payload) { state.sweepstakeDetailId = payload },
    setSweepstakePrizeId(state, payload) { state.sweepstakePrizeId = payload },
    setDonorsCount(state, payload) { state.donorsCount = payload },
    setOrganizationsImg(state, payload) {
      if (!payload.length) state.organizationsImages = [];
      else state.organizationsImages = payload.map(p => ({ image: p.image }));
    },
    setLoaded(state, payload) { state.loaded = payload },
    setId(state, payload) { state.id = payload },
    setSharedCount(state, payload) { state.sharedCount = payload },
    setSessionId(state, payload) { state.sessionId = payload },
    setMessage(state, payload) { state.message = payload },
    setSelectDonate(state, payload) { state.selectDonate = payload },
    setLoadedDetails(state, payload) { state.loadedDetails = payload },
    setBillingInfoExistence(state, payload) { state.billingInfoExistence = payload },
    setCards(state, payload) {
      const defaultCardId = payload.default
      const items = payload.payment_methods.map(p => {
        return (defaultCardId === p.id) ? { ...p, default: true } : p
      });
      state.cards = items;
    },

    setbankAccounts(state, payload) {
      const bankAccountsId = payload.default;
      const items = payload.bank_accounts.map(p => {
        return (bankAccountsId === p.id) ? { ...p, default: true } : p
      });
      state.bankAccounts = items;

    },
    setSliderItems(state, payload) { state.sliderItems = payload; },
    setSweepstakeId(state, payload) { state.sweepstakeId = payload },
  },
  actions: {
    async apiGetSweepstakData({ commit }, payload) {
      commit('setLoadedDetails', false);
      const slug = payload;
      try {
        await Vue.axios.get(`public/sweepstakes/${slug}`)

          .then(res => {
            return res.data
          })
          .then(data => {
            commit('setId', data.id);
            commit('setSharedCount', +data.shared_count || null)
            commit('setDonorsCount', +data.donors_count || 0);
            let details = {
              id: data.details ? data.details.id : null,
              startDate: data.details ? data.details.start_date : '',
              endDate: data.details ? data.details.end_date : '',
              focus: data.details ? data.details.focus : { id: '', title: '' },
              headline: data.details ? data.details.headline : '',
              helpingToDescription: data.details ? data.details.helping_to_description : '',
              helpingToHeader: data.details ? data.details.helping_to_header : '',
              helpingToImageFirst: data.details.helping_to_image_first || '',
              helpingToImageSecond: data.details.helping_to_image_second || '',
              image: data.details ? data.details.image : '',
              imageAlt: data.details ? data.details.image_alt : '',
              name: data.details ? data.details.name : '',
              organizationFocusId: data.details ? data.details.organization_focus_id : null,
              subtitle: data.details ? data.details.subtitle : '',
              //howItWork: data.details ? data.details.how_it_work : '',
              //howItWorkDescription: data.details ? data.details.how_it_work_description : '',
              rules: data.details ? data.details.rules : null,
              widgetText: data.details && data.details.widget_text ? data.details.widget_text : 'Donate and Everybody Wins!',
              widgetFirstTag: data.details && data.details.widget_first_tag ? data.details.widget_first_tag : 'Donate to Enter',
              widgetSecondTag: data.details && data.details.widget_second_tag ? data.details.widget_second_tag : 'Change a Life'
            }

            commit('setDetails', details);

            const time = {
              endDate: data.details.end_date || '',
              startDate: data.details.start_date || '',
            }

            commit('setSimpleTime', time)

            const organizationsSlider = [];
            if (details.helpingToImageFirst) organizationsSlider.push(details.helpingToImageFirst);
            if (details.helpingToImageSecond) organizationsSlider.push(details.helpingToImageSecond);

            const sliderItems = {
              organizationsCount: data.organizations ? data.organizations.length : 0,
              images: organizationsSlider,
              organizations: data.organizations || [],
            }

            commit('setDetails', details);
            commit('setTime', time);
            commit('setSliderItems', sliderItems);

            let organizations = []
            if (data.organizations) {
              organizations = data.organizations
            } else {
              organizations = [{ id: null, account_id: null, focus: '', focusId: null, name: '' }]
            }
            commit('setOrganizations', organizations);

            const prizes = {
              id: data.prizes ? data.prizes.id : null,
              aboutPrize: data.prizes ? data.prizes.about_prize : '',
              caption: data.prizes ? data.prizes.caption : '',
              count: data.prizes ? data.prizes.count : null,
              descriptions: data.prizes ? data.prizes.descriptions : { id: null, description: '', sweepstake_prize_id: null },
              images: data.prizes ? data.prizes.images : [],
              prize: data.prizes ? data.prizes.prize : '',
              isMicro: data.prizes ? !!data.prizes.is_micro : false,
              widgetTitle: data.prizes && data.prizes.widget_title ? data.prizes.widget_title : "Donate to Enter",
              widgetText: data.prizes && data.prizes.widget_text ? data.prizes.widget_text : "You may not win but you definitely won't lose",
              widgetImage: data.prizes ? data.prizes.widget_image : "",
            }

            commit('setPrizes', prizes);
            commit('setOrganizationsImg', data.organizations);

            commit('setSweepstakeDetailId', data.sweepstake_detail_id ? data.sweepstake_detail_id : null);
            commit('setSweepstakePrizeId', data.sweepstake_prize_id ? data.sweepstake_prize_id : null);
            commit('setLoadedDetails', true);
            commit('setSweepstakeId', data.id);

          }).finally(() => {
            store.dispatch("setLoader", false);
            commit('setLoadedDetails', true);
          })
      } catch (e) { console.log(e) }
    },

    async apiGetIsBillingsExists({ commit }, payload) {
      let result = false;

      try {
        await Vue.axios.get(`user/donor-billings/exists`)
          .then(res => res.data)
          .then(data => {
            commit('setBillingInfoExistence', data.billingInfoExistence);
            result = data.billingInfoExistence;
          }).finally(() => {
            store.dispatch("setLoader", false);
          });
      } catch (e) { console.log(e) };

      return result

    },

    async apiGetNumberShared({ getters, commit }, payload) {

      store.dispatch("setLoader", false);

      const id = payload ? payload : getters.getId;
      try {
        Vue.axios.patch(`public/sweepstakes/${id}`)
          .then(res => res.data)
          .then(data => {
            commit('setSharedCount', +data.sharedCount || 0);
          }).finally(() => {
            store.dispatch("setLoader", false);
          })
      } catch (e) { console.log(e) }
    },

    async apiGetCheckout({ commit, getters }, payload) {

      commit('setSessionId', '');

      const sweepstakeId = getters.getId;
      const organizationId = payload.organizationId;

      var result = {
        success: false,
        message: ''
      };

      try {
        await Vue.axios
          .post(`/user/donations/sweepstake/checkout/${organizationId}/${sweepstakeId}`, payload.options)
          .then(res => res.data)
          .then(data => {
            result.success = true;
            if (data.sessionId) {
              commit('setSessionId', data.sessionId)
            } else {
              commit('setSessionId', '')
            }
          })
          .catch((error) => {
            result.success = false
            result.message = error.response.data.message;
          });
        return result
      } catch (e) { console.log(e) }
    },

    async apiGetDonateDefault({ commit, getters }, payload) {
      const sweepstakeId = getters.getId;
      const organizationId = payload.organizationId;

      var result = {
        success: false,
        message: ''
      };
      try {
        await Vue.axios
          .post(`/user/donations/sweepstake/default-payment-method/${organizationId}/${sweepstakeId}`, payload.options)
          .then(res => res.data)
          .then(data => {
            result.success = true;
            if (data.message) {
              commit('setMessage', data.message);
            } else {
              commit('setMessage', '');
            }
          })
          .catch((error) => {
            result.success = false
            result.message = error.response.data.message;
          });
        return result
      } catch (e) { console.log(e) }
    },
    async apiSendFreeDonate({ getters, commit }, payload) {
      const sweepstakeId = getters.getId;
      var result = {
        success: false,
        message: ''
      };
      commit('setMessage', '');
      commit('setLoaded', true);
      try {
        await Vue.axios
          .post(`/user/donations/sweepstake/free-entrance/${sweepstakeId}`, payload)
          .then(res => {
            commit('setLoaded', false);
            result.success = true;
            return res.data;
          })
          .then(data => {
            commit('setMessage', data.message);
          })
          .catch((error) => {
            result.success = false
            result.message = error.response.data.message;
          })
          .finally(() => {
            commit('setLoaded', false)
          });

      } catch (e) {
        if (e.response.status === 403) {
          result.success = false;
          commit('setMessage', e.response.data.message);
        } else {
          commit('setMessage', e.response.data.message);
        }
      }
      return result;
    },
    async apiGetForUnauthorizedCheckout({ getters, commit }, payload) {

      commit('setSessionId', '');

      const sweepstakeId = getters.getId;
      const organizationId = payload.organizationId;

      var result = {
        success: false,
        message: ''
      };
      try {
        await Vue.axios
          .post(`/public/sweepstakes/checkout/${organizationId}/${sweepstakeId}`, payload.options)
          .then(res => res.data)
          .then(data => {
            result.success = true;
            if (data.sessionId) {
              commit('setSessionId', data.sessionId)
            } else {
              commit('setSessionId', '')
            }
          })
          .catch((error) => {
            result.success = false;
            result.message = error.response.data.message;
          });
        return result
      } catch (e) { console.log(e) }
    },

    async apiGetCards({ commit }) {
      try {
        await Vue.axios.get('/user/donor-billings/cards')
          .then(res => res.data)
          .then(data => {
            commit('setCards', data)
          })

      } catch (e) { console.log(e) }
    },

    async apiGetBankAccounts({ commit }) {
      try {
        await Vue.axios.get('/user/donor-billings/bank-accounts')
          .then(res => res.data)
          .then(data => {
            commit('setbankAccounts', data);
          })
      } catch (e) { console.log(e) }
    },
  }
}
