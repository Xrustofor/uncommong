import Vue from 'vue'
import { separateInitials } from "@/helpers/script";
import store from '@/store';

export default {
    namespaced: true,
    state: {
        teamName: '',
        userTeamPermissions: {
            is_owner: false,
            edit_member: false,
            edit_team: false
        },
        team: {
            name: 'Test',
            edit_member: true,
            edit_team: true
        },
        total: null,
        items: [],
        numberPages: 1,
        headerItems: [
            {
                key: "actions_variables",
                value: "Actions",
                className: 'icon_cell diver-right'
            },
            {
                key: "image",
                value: "",
                image: true,
            },
            {
                key: "full_name",
                value: "Member Name",
                icon: true,
                action: true,
            },
            {
                key: "progress",
                value: "Progress",
                icon: true,
                action: true,
                progress: true
            },
            {
                key: "role",
                value: "Your Role",
                icon: true,
                action: true,
            },
            {
                key: "number_of_donations",
                value: "# of Donations",
                icon: true,
                action: true,
            },
            {
                key: "view",
                value: "View",
                className: 'icon_cell center diver-left',
                viewActions: true
            }
        ],
        loader: false,
        memberPermissions: {
            edit_member: false,
            edit_team: false
        },
        teamFundraiser: {
            status: ''
        }
    },
    getters: {
        getTeam(state) { return state.team },
        getItems(state) { return state.items },
        getHeaderItems(state) { return state.headerItems },
        getTotal(state) { return state.total },
        getLoader(state) { return state.loader },
        getNumberPages(state) { return state.numberPages },
        getMemberPermissions(state) { return state.memberPermissions },
        getUserTeamPermissions(state) { return state.userTeamPermissions },
        getTeamName(state) { return state.teamName }
    },
    mutations: {
        setFundraiser(state, payload) { state.teamFundraiser = payload },
        setTeam(state, payload) { state.team = payload },
        setItems(state, payload) {
            const userAccountId = store.getters['user/getUser'].id;
            const items = [];
            let permissions = state.userTeamPermissions,
                status = state.teamFundraiser.status === 'complete'

            if (payload.length) {
                payload.map(item => {
                    let noIndividual = item.individual_id === null,
                        owner = item.role === 'owner';

                    items.push({
                        ...item,
                        image: item.image ? item.image : '',
                        initials: separateInitials(item.first_name, item.last_name),
                        progress: {
                            amount: item.amount_raised != 0 ? (item.amount_raised / 100) : 0,
                            goal: item.goal ? (item.goal / 100) : 0
                        },
                        number_of_donations: item.number_of_donations || 0,
                        actions_variables: [
                            { key: 'edit', title: 'Edit My Page', hidden: userAccountId != item.user_id },
                            { key: 'remove', title: 'Remove member', hidden: owner ? true : permissions.is_owner ? false : permissions.edit_team ? false : true },
                            { key: 'promote', title: 'Promote to leader', hidden: owner || !permissions.is_owner ? true : false },
                            { key: 'permissions', title: 'Manage permissions', hidden: owner ? true : permissions.is_owner ? false : permissions.edit_member ? false : true },
                            { key: 'view', title: 'View personal page', hidden: item.individual_id ? false : true, link: `/fundraisers/${item.fundraiser_url}/individuals/${item.individual_id}` },
                        ],
                        actionsHidden: status || (owner && noIndividual) || (!permissions.is_owner && !permissions.edit_team && !permissions.edit_member && item.individual_id === null) ? true : false,
                        viewItemHidden: noIndividual
                    })
                });
                state.items = items;
            } else {
                state.items = [];
            }
        },
        setTotal(state, payload) { state.total = payload ? payload : 0 },
        setLoader(state, payload) { state.loader = payload },
        setHeaderItems(state, payload) { state.headerItems = payload },
        setNumberPages(state, payload) { state.numberPages = payload },
        setMemberPermissions(state, payload) { state.memberPermissions = payload },

        setUserTeamPermissions(state, payload) { state.userTeamPermissions = payload },
        setTeamName(state, payload) { state.teamName = payload },
    },
    actions: {
        async fundraiserForTeam({ commit }, id) {
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/fundraisers/by-team-id/${id}`)
                    .then(res => res.data)
                    .then(data => {
                        success = true
                        commit('setFundraiser', data.fundraiser)
                    })
                return success
            } catch (e) { console.log(e) }
        },
        async apiP2PTeamRosterList({ commit }, payload) {
            commit('setLoader', true);
            const id = payload.id ? payload.id : null;
            const sort = payload.sort ? payload.sort : '';
            const order = payload.order ? payload.order : ''
            const perPage = payload.per_page ? payload.per_page : 10;
            const page = payload.page ? payload.page : 1;
            const search_field = payload.search_field ? payload.search_field : 'all';
            const search = payload.search ? payload.search : '';
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/${id}/members?per_page=${perPage}&page=${page}&sort=${sort}&order=${order}&search_field=${search_field}&search=${search}`)
                    .then(res => res.data)
                    .then(data => {
                        if (data.members) {
                            commit('setItems', data.members.data);
                            commit('setTotal', data.members.total);
                            commit('setNumberPages', data.members ? data.members.last_page : 1);
                        }
                        else {
                            commit('setItems', []);
                            commit('setTotal', 0);
                            commit('setNumberPages', 1);
                        }
                    })
                    .finally(() => {
                        commit('setLoader', false);
                    })
            } catch (e) { console.log(e) }
        },
        async userTeamPermissions({ commit }, id) {
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/${id}/members/user-permissions`)
                    .then(res => res.data)
                    .then(data => {
                        success = true
                        commit("setUserTeamPermissions", data.permissions);
                        commit("setTeamName", data.team_name);
                    })
                return success
            } catch (e) { console.log(e) }
        },
        async getMemberPermissions({ commit }, { idTeam, idMember }) {
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/${idTeam}/members/${idMember}`)
                    .then(res => res.data)
                    .then(data => {
                        success = true
                        commit('setMemberPermissions', data.result)
                    })
                return success
            } catch (e) { console.log(e) }
        },
        async deleteMember({ commit }, { idTeam, idMember }) {
            let success = false;
            try {
                await Vue.axios
                    .delete(`/user/fundraisers/team/${idTeam}/members/${idMember}`)
                    .then(res => {
                        success = true
                        //commit('updateTeam', res.data.result)
                    })
                return success
            } catch (e) { console.log(e) }
        },
        async promoteMember({ commit }, { idTeam, idMember }) {
            let success = false;
            try {
                await Vue.axios
                    .put(`/user/fundraisers/team/${idTeam}/members/${idMember}/promote`)
                    .then(res => {
                        success = true
                        //commit('updateTeam', res.data.result)
                    })
                return success
            } catch (e) { console.log(e) }
        },
        async savePermission({ commit }, { idTeam, idMember, value }) {
            let success = false;
            try {
                await Vue.axios
                    .put(`/user/fundraisers/team/${idTeam}/members/${idMember}/manage-permission`, value)
                    .then(res => {
                        success = true
                        //commit('updateTeam', res.data.result)
                    })
                return success
            } catch (e) { console.log(e) }
        },
    }
}
