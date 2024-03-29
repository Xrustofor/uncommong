import Vue from 'vue'

export default {
    namespaced: true,
    state: {
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
                defaultImage: true
            },
            {
                key: "team_name",
                value: "Team Name",
                icon: true,
                action: true,
            },
            {
                key: "fundraiser_name",
                value: "Fundraiser Name",
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
                key: "status",
                value: "Status",
                icon: true,
                action: true,
                status: true
            },
            {
                key: "role",
                value: "Your Role",
                icon: true,
                action: true,
            },
            {
                key: "contributors",
                value: "# of Donors",
                icon: true,
                action: true,
            },
        ],
        loader: false,
    },
    getters: {
        getItems(state) { return state.items },
        getHeaderItems(state) { return state.headerItems },
        getTotal(state) { return state.total },
        getLoader(state) { return state.loader },
        getNumberPages(state) { return state.numberPages },
    },
    mutations: {
        setItems(state, payload) {
            const items = [];
            let teams = payload.data,
                past = payload.condition === 'past' ? true : false;

            if (teams.length) {
                teams.map(item => {
                    let owner = item.role === 'owner',
                        edit = item.permissions.edit_team;

                    items.push({
                        ...item,
                        image: item.photo ? item.photo : '',
                        status: item.fundraiser_status,
                        progress: {
                            amount: item.amount_raised != 0 ? (item.amount_raised / 100) : 0,
                            goal: item.goal ? (item.goal / 100) : 0
                        },
                        contributors: item.contributors || 0,
                        actions_variables: [
                            { key: 'view', title: 'View Team', hidden: past || item.fundraiser_status != 'active' || !item.team_status },
                            { key: 'edit', title: 'Edit Team Page', hidden: past ? true : owner || edit ? false : true },
                            { key: 'roster', title: 'View Team Roster' },
                            { key: 'delete', title: 'Delete Team', hidden: past ? true : owner || edit ? false : true },
                        ]
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

    },
    actions: {
        async apiP2PTeamsList({ commit }, payload) {
            commit('setLoader', true);
            const sort = payload.sort ? payload.sort : '';
            const per_page = payload.per_page;
            const order = payload.order ? payload.order : ''
            const page = payload.page ? payload.page : '';
            const condition = payload.condition ? payload.condition : '';
            const search = payload.search ? payload.search : '';
            let success = false;
            try {
                await Vue.axios
                    .get(`/user/fundraisers/team/team-page/list?sortColumn=${sort}&sortOrder=${order}&search=${search}&condition=${condition}&perPage=${per_page}&page=${page}`)
                    .then(res => res.data)
                    .then(data => {
                        commit('setLoader', true);
                        if (data.data) {
                            commit('setItems', { data: data.data, condition: condition });
                            commit('setTotal', data.total);
                            commit('setNumberPages', data.data ? data.last_page : 1);

                        } else {
                            commit('setItems', { data: [], condition: condition });
                            commit('setTotal', 0);
                            commit('setNumberPages', 1);
                        }

                        success = true;
                    }).finally(() => commit('setLoader', false));
                return success;
            } catch (e) { console.log(e) }
        },
        async deleteTeam({ commit }, id) {
            let success = false;
            try {
                await Vue.axios
                    .delete(`/user/fundraisers/team/${id}`)
                    .then(res => {
                        success = true
                        //commit('updateTeam', res.data.result)
                    })
                return success
            } catch (e) { console.log(e) }
        },
    }
}
