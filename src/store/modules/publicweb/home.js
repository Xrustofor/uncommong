import Vue from 'vue';
import store from '@/store'
export default {
    namespaced: true,
    state: {
        organizations: [],
        sweepstakes: [],
        mainIdSweepstake: null,
        mainSweepstake: {
            details: {
                image: '',
                headline: '',
                subtitle: '',
                start_date: new Date(),
                end_date: new Date(),
            },
        },
        time: {
            startDate: new Date(),
            endDate: new Date(),
            active: false,
            startTime: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            },
            endTime: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            },
        },
        fundraisersData: [],
    },
    getters: {
        getOrganizations(state) { return state.organizations },
        getSweepstakes(state) { return state.sweepstakes },
        getMainSweepstake(state) { return state.mainSweepstake },
        getMainIdSweepstake(state) { return state.mainIdSweepstake },
        getTime(state) { return state.time },
        getFundraisersData(state) { return state.fundraisersData },
    },
    mutations: {
        setOrganizations(state, payload) {
            state.organizations = payload;
        },
        setSweepstakes(state, payload) {
            state.sweepstakes = payload.map(p => ({
                ...p,
                details: {
                    ...p.details,
                    end_date: Vue.moment(p.details.end_date, "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm"),
                    start_date: Vue.moment(p.details.start_date, "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm")
                }
            }))
        },
        setMainIdSweepstake(state, payload) { state.mainIdSweepstake = payload },
        setMainSweepstake(state, payload) {
            const item = {
                ...payload,
                details: {
                    ...payload.details,
                    end_date: Vue.moment(payload.details.end_date, "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm"),
                    start_date: Vue.moment(payload.details.start_date, "YYYY-MM-DD HH:mm:ss").format("YYYY/MM/DD HH:mm"),
                }
            }
            state.mainSweepstake = item
        },
        setTime(state, payload) {
            const FORMAT = "YYYY-MM-DD HH:mm:ss"
            const currentDate = Vue.moment().tz("America/New_York").format(FORMAT);
            // console.log(currentDate);
            const startDate = payload.startDate ? Vue.moment(payload.startDate, "YYYY-MM-DD HH:mm:ss").format(FORMAT) : currentDate;
            
            const endDate = payload.endDate ? Vue.moment(payload.endDate, "YYYY-MM-DD HH:mm:ss").format(FORMAT) : currentDate;

            const startDaysDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days");
            const starHoursDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "hour") - startDaysDiff * 24;
            const starMinutesDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "minutes") - startDaysDiff * 24;
            const starSecondsDiff = Vue.moment(startDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "seconds");

            const endDaysDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "days");
            const endHoursDiff = Vue.moment(endDate, FORMAT).diff(Vue.moment(currentDate, FORMAT), "hour") - endDaysDiff * 24;
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
        setFundraisersData(state, payload) {
            state.fundraisersData = [];
            if (!payload.length) { return };
            const items = [];
            payload.map(p => {
                items.push({
                    id: p.id,
                    amount: +p.amount_raised ? +p.amount_raised / 100 : 0,
                    goal: +p.goal ? +p.goal / 100 : 0,
                    image: p.cover_photo || '',
                    organization: p.organization_name || '',
                    headline: p.name || '',
                    slug: p.url || '',
                })
            });
            state.fundraisersData = items;
        },
    },
    actions: {
        async getApiOrganizations({ commit }) {
            let params = {
                sort_organizations: "alphabetically",
                all: true
            }
            try {
                await Vue.axios
                    .get("/public/organizations", { params: params })
                    .then(res => res.data)
                    .then(data => {
                        commit('setOrganizations', data.organizations);
                    })
                    .catch((error) => { })
            } catch (e) { console.log(e) }
        },
        async getApiSweepstakes({ commit }) {
            try {
                await Vue.axios
                    .get("/public/sweepstakes/home-page/list")
                    .then(res => res.data)
                    .then(data => {
                        commit('setSweepstakes', data);
                    })
                    .catch((error) => { })
            } catch (e) { console.log(e) }
        },
        async getMainSweepstake({ commit }) {
            try {
                await Vue.axios
                    .get("/public/sweepstakes/home-page/main")
                    .then(res => res.data)
                    .then(data => {
                        commit('setMainSweepstake', data);
                        const time = {
                            endDate: data.details.end_date || '',
                            startDate: data.details.start_date || '',
                        }

                        commit('setTime', time);
                        commit('setMainIdSweepstake', data.id);
                    })
                    .catch((error) => { })
            } catch (e) { console.log(e) }
        },
        async apiGetFundraisers({ commit }) {
            try {
                await Vue.axios
                    .get("/public/fundraisers/home-page")
                    .then(res => res.data)
                    .then(data => {
                        commit('setFundraisersData', data.fundraisers);
                    })
                    .catch((error) => { })
            } catch (e) { console.log(e) }
        }
    }
}