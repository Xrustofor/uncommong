import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        message: '',
        items: [],
        focuses: [],
        page: false,
        prevPage: 0,
        organization: {},
        idOrganization: null,
        organizationColors: {
            primary: null
        },
        donationsAllowance: false,
        specialDonations: [],
        specialDonation: {},
        socialNetworks: [],
        gallery: [],
        localLoading: false,
        isGalleryPage: false,
        isFundraisersPage: false,
        fundraiserTabData: [],
    },
    getters: {
        getMessage( state ) { return state.message },
        getOrganizationsList(state) { return state.items },
        getFocuses(state) { return state.focuses },
        getPage(state) { return state.page },
        getOrganization(state) { return state.organization },
        getIdOrganization(state) { return state.idOrganization },
        getOrganizationColors(state) { return state.organizationColors },
        getSpecialDonation(state) { return state.specialDonation },
        getSpecialDonations(state) { return state.specialDonations },
        getDonationsAllowance(state) { return state.donationsAllowance },
        getSocialNetworks(state) { return state.socialNetworks },
        getGallery(state) { return state.gallery },
        getlocalLoading(state) { return state.localLoading },
        getIsGalleryPage ( state ) { return state.isGalleryPage },
        getIsFundraisersPage ( state ) { return state.isFundraisersPage },
        getFundraiserTabData( state ) { return state.fundraiserTabData },
    },
    mutations: {
        setOrganizationsList(state, payload) { state.items = payload; },
        pushOrganizationsList(state, payload) {
            if (state.prevPage != payload.page) {
                let org = [];
                org = state.items.concat(payload.org)
                state.items = org
            }
        },
        setFocuses(state, payload) {
            if (payload !== false) {
                state.focuses = payload.map(el => {
                    return el = {
                        id: el.id,
                        title: el.title,
                        count: el.focus_count
                    }
                })
            }
        },
        canChangePage(state, payload) { state.page = payload; },
        setPrevPage(state, payload) { state.prevPage = payload },
        setDonationsAllowance(state, payload) {
            state.donationsAllowance = false;
            state.donationsAllowance = payload;
        },
        setOrganization(state, payload) {
            let special_donations = []
            payload.special_donations.map(el => {
                el.price = el.price / 100;
                special_donations.push(el)
            })
            payload.special_donations = special_donations
            state.organization = payload;
        },
        getSpecialDonation(state, payload) {
            state.specialDonation = payload;
        },
        setSpecialDonations(state, payload) {
            state.specialDonations = [];
            if(!payload.length) return;
            state.specialDonations = payload;
        },
        setOrganizationColors(state, payload) {
            state.organizationColors = payload != null ? payload : { primary: null }
        },
        setSocialNetworks(state, payload) {
            state.socialNetworks = [];
            if (payload.length === 0) return;
            const items = [];
            for (let key in payload) {
                switch (key) {
                    case 'facebook_link': {
                        if (payload[key] === "") break;
                        items.push({ name: 'facebook', url: payload[key], type: 'socialNetwork' }); break;
                    };
                    case 'youtube_link': {
                        if (payload[key] === "") break;
                        items.push({ name: 'youtube', url: payload[key], type: 'socialNetwork' }); break;
                    };
                    case 'instagram_link': {
                        if (payload[key] === "") break;
                        items.push({ name: 'instagram', url: payload[key], type: 'socialNetwork' }); break;
                    };
                    case 'twitter_link': {
                        if (payload[key] === "") break;
                        items.push({ name: 'twitter', url: payload[key], type: 'socialNetwork' }); break;
                    };
                    case 'website_link': {
                        if (payload[key] === "") break;
                        items.push({ url: payload[key], type: 'website' }); break;
                    };
                    case 'website_preview_text': {
                        if (payload[key] === "") break;
                        const index = items.findIndex(i => i.type === 'website');
                        if (index !== undefined) {
                            items[index] = { name: payload[key], ...items[index] }
                        }
                        break;
                    };
                };
            }
            
            state.socialNetworks = items;
        },
        setIdOrganization(state, payload) { state.idOrganization = payload },
        setGallery(state, payload) {
            state.gallery = [];
            if (!payload.length) return;
            state.gallery = payload.sort((a, b) => a.order - b.order);
        },
        setlocalLoading(state, payload) { state.localLoading = payload },
        setGallaryImagesСlear(state){
            state.gallery = [];
        },
        setMessage( state, payload ) { state.message = payload },
        setIsGalleryPage ( state, payload ) { state.isGalleryPage = payload },
        setIsFundraisersPage ( state, payload ) {
            if(typeof payload !== 'boolean') {
                state.isFundraisersPage = false;
            }else{
                state.isFundraisersPage = payload;
            }
        },
        setFundraiserTabData( state, payload ){
            state.fundraiserTabData = [];
            if(!payload.length) { return };
            const items = [];
            payload.map(p => {
                switch(p.type){
                    case 'fundraiser':{
                        items.push({
                            type: p.type,
                            image: p.image || '',
                            headline: p.name,
                            organization: p.organization_name || '',
                            description: p.fundraiser_short_description || '',
                            goal: p.goal ? p.goal / 100 : null,
                            amount: p.amount_raised ? p.amount_raised / 100 : null,
                            slug: p.url,
                            startDate: p.start_date,
                            endDate: p.end_date,
                        })
                        break;
                    };
                    case 'sweepstake':{
                        items.push({
                            type: p.type,
                            image: p.image || '',
                            headline: p.name || '',
                            organization: p.sweepstake_focus || '',
                            description: p.fundraiser_short_description || '',
                            slug: p.url,
                            endDate: p.end_date,
                            startDate: p.start_date,
                        })
                        break;
                    }
                }

            });
            state.fundraiserTabData = items;
        }
    },
    actions: {
        async getApiOrganizationsList({ commit }, { search, sort_organizations, sort_focuses, page, focuses }) {
            commit('canChangePage', false)
            let success = false,
                params = {
                    search: search ? search : '',
                    sort_organizations: sort_organizations ? sort_organizations : "newest",
                    sort_focuses: sort_focuses ? sort_focuses : 'alphabetically',
                    page: page ? page : 1,
                };
            if (focuses.length > 0) {
                params.focuses = focuses;
            }
            try {
                await Vue.axios
                    .get("/public/organizations", { params: params })
                    .then(res => res.data)
                    .then(data => {
                        success = true;

                        if (data.organizations.length === 12) {
                            commit('canChangePage', true)
                        } else { commit('canChangePage', false) }

                        if (page > 1) commit('pushOrganizationsList', { org: data.organizations, page: params.page });
                        else commit('setOrganizationsList', data.organizations);

                        commit('setFocuses', data.focuses);
                        commit('setPrevPage', params.page);

                    })
                    .catch((error) => { });
                return success
            } catch (e) { console.log(e) }
        },

        async checkDonationsAllowance({ commit }, id) {
            try {
                await Vue.axios
                    .get("/public/organizations/donation/allowance/" + id)
                    .then((res) => {
                        commit('setDonationsAllowance', res.data.is_donation_allowed);
                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }

        },
        async apiGetIsFundraisers({ commit }, id) {
            const organizationId = id;
            try {
                await Vue.axios
                    .get(`/public/organizations/${organizationId}/fundraisers-tab/is-exist`)
                    .then((res) => res.data)
                    .then(data => {
                        commit('setIsFundraisersPage', data.isExistFundraiserTab);
                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }

        },
        async apiGetFundraisersData({ commit }, id) {
            commit('setlocalLoading', true);
            const organizationId = id;
            try {
                await Vue.axios
                    .get(`/public/organizations/${organizationId}/fundraisers-tab`)
                    .then((res) => res.data)
                    .then(data => {
                        commit('setlocalLoading', false);
                        commit('setFundraiserTabData', data.fundraiserTabData);
                    })
                 } catch (e) { console.log(e) }
              finally { commit('setlocalLoading', false) }
        },



        async getApiOrganization({ commit }, id) {
            commit('setSocialNetworks', []);
            try {
                await Vue.axios
                    .get("/public/organizations/" + id)
                    .then(res => res.data)
                    .then(data => {

                        commit('setIsGalleryPage', !!data.is_gallery_page_active);

                        commit('setOrganization', data);

                        commit('setIdOrganization', data.id);

                        commit('setSpecialDonations', data.special_donations);

                        commit('setOrganizationColors', data.current_palette);

                        if (data.social_networks) {
                            commit('setSocialNetworks', data.social_networks);
                        }

                    })
                    .catch((error) => { });
            } catch (e) { console.log(e) }

        },
        getSpecialDonation({ commit }, payload) {
            commit('getSpecialDonation', payload);
        },

        async apiGetGallary({ commit, getters }) {
            const idOrganization = getters.getIdOrganization;
            commit('setlocalLoading', true);
            try {
                await Vue.axios
                    .get(`public/organizations/${idOrganization}/gallery`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setGallery', data ? data : []);
                        commit('setlocalLoading', false);
                    })
            } catch (e) { console.log(e) }
            commit('setlocalLoading', false);
        },
        async apiCenselDonateMonthly({ commit }, payload){
            commit('setMessage', '');
            const { token } = payload;
            try {
              await Vue.axios
                .post(`public/recurring-payments/cancel`, {token})
                .then(res => res.data)
                .then(data => {
                  if(data.message) commit('setMessage', data.message);
                }).finally(() => commit('setLoader', false))
      
            } catch (e) { console.log(e) }
        },
        async apiRestoreDonateMonthly({ commit }, payload){
            commit('setMessage', '');
            const { token } = payload;
            try {
              await Vue.axios
                .post(`public/recurring-payments/restore`, {token})
                .then(res => res.data)
                .then(data => {
                  if(data.message) commit('setMessage', data.message);
                }).finally(() => commit('setLoader', false))
      
            } catch (e) { console.log(e) }
          }
    },
}