export default {
    namespaced: true,
    state: {
        security_questions: [],
        security_question: '',
        userQuestion: []
    },
    actions: {
        securityQuestions({ commit }, payload) {
            commit("securityQuestions", payload);
        },

        securityQuestionOne({ commit }, payload) {
            commit("securityQuestionOne", payload);
        },

        userQuestion({ commit }, payload) {
            commit("userQuestion", payload);
        },

    },
    mutations: {
        securityQuestions(state, { security_questions }) {
            state.security_questions = security_questions;
        },

        securityQuestionOne(state, { question }) {
            state.security_question = question;
        },

        userQuestion(state, payload) {
            state.userQuestion = payload;
        },
    },
    getters: {
        securityQuestions(state) {
            return state.security_questions;
        },

        securityQuestion(state) {
            return state.security_question;
        },

        userQuestion(state) {
            return state.userQuestion;
        },
    }
}