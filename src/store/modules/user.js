import Vue from 'vue'
import VueCookies from 'vue-cookies'
import { separateInitials } from "@/helpers/script";
Vue.use(VueCookies)

export default {
    namespaced: true,
    state: {
        user: {},

        securityAnswerOne: { id: 0, text: '' },
        securityAnswerTwo: { id: 0, text: '' },

        allQuestions: [],

        allSecurityQuestionOne: [],
        securityQuestionOneNames: [],
        securityQuestionOne: { id: 0, text: '' },

        allSecurityQuestionTwo: [],
        securityQuestionTwoNames: [],
        securityQuestionTwo: { id: 0, text: '' },
        userContacts: { email: '', firstName: '', lastName: '' },

    },
    getters: {
        getUser(state) { return state.user },
        getAllQuestions(state) { return state.allQuestions },
        getUserContacts(state) { return state.userContacts },
        getSecurityAnswerOne(state) { return state.securityAnswerOne },
        getSecurityAnswerTwo(state) { return state.securityAnswerTwo },

        getSecurityQuestionOneId(state) { return state.securityQuestionOne.id },
        getSecurityQuestionOneText(state) { return state.securityQuestionOne.text },
        getSecurityQuestionTwoId(state) { return state.securityQuestionTwo.id },
        getSecurityQuestionTwoText(state) { return state.securityQuestionTwo.text },

        getOneNames(state) { return state.securityQuestionOneNames },
        getTwoNames(state) { return state.securityQuestionTwoNames }
    },
    mutations: {
        async setUser(state, payload) {
            var user = {
                ...payload,
                initials: separateInitials(payload.first_name, payload.last_name),
                new_email: payload.new_email ? payload.new_email : false
            }
            await Vue.$cookies.set("user", user)
            state.user = user;
            state.userContacts = {
                email: payload.email,
                firstName: payload.first_name,
                lastName: payload.last_name,
            }
        },
        setSecurityAnswers(state, payload) {
            var answers = payload.answers_for_questions
            state.securityAnswerOne = {
                id: answers[0].id,
                text: answers[0].answer
            };
            state.securityQuestionOne.id = answers[0].security_question_id;

            state.securityAnswerTwo = {
                id: answers[1].id,
                text: answers[1].answer
            };
            state.securityQuestionTwo.id = answers[1].security_question_id
        },
        async setAllSecurityQuestions(state, payload) {
            var allQuestions = payload.security_questions
            state.allQuestions = allQuestions;

            var questionsTwo = [], questionsTwoName = [];
            await allQuestions.forEach((el) => {
                if (el.id != state.securityQuestionOne.id) {
                    questionsTwo.push(el);
                    questionsTwoName.push(el.question)
                } else {
                    state.securityQuestionOne.text = el.question
                    state.securityQuestionOne.id = el.id
                }
            })
            state.allSecurityQuestionTwo = questionsTwo;
            state.securityQuestionTwoNames = questionsTwoName



            var questionsOne = [], questionsOneName = [];
            await allQuestions.forEach((el) => {
                if (el.id != state.securityQuestionTwo.id) {
                    questionsOne.push(el)
                    questionsOneName.push(el.question)
                } else {
                    state.securityQuestionTwo.text = el.question
                    state.securityQuestionTwo.id = el.id
                }
            })
            state.allSecurityQuestionOne = questionsOne;
            state.securityQuestionOneNames = questionsOneName;


        },
        async setSecurityQuestionsTwo(state, payload) {
            var questionsOne = [], questionsOneName = [];
            await state.allQuestions.forEach((el) => {
                if (el.question != payload) {
                    questionsOne.push(el)
                    questionsOneName.push(el.question)
                } else {
                    state.securityQuestionTwo = {
                        id: el.id,
                        text: el.question
                    }
                }
            })
            state.allSecurityQuestionOne = questionsOne;
            state.securityQuestionOneNames = questionsOneName;
        },

        async setSecurityQuestionsOne(state, payload) {
            var questionsTwo = [], questionsTwoName = [];
            await state.allQuestions.forEach((el) => {
                if (el.question != payload) {
                    questionsTwo.push(el);
                    questionsTwoName.push(el.question)
                } else {
                    state.securityQuestionOne = {
                        id: el.id,
                        text: el.question
                    }
                }
            })
            state.allSecurityQuestionTwo = questionsTwo;
            state.securityQuestionTwoNames = questionsTwoName
        }
    },
    actions: {
        async getApiUser({ commit }, payload) {
            try {
                await Vue.axios.get("/user")
                    .then((res) => res.data)
                    .then((data) => {
                        commit('setUser', data.user)
                    });
            } catch (e) { console.log(e) }
        },
        async setUserImage({ commit }, imageUrl) {
            var image = {
                image: imageUrl,
            };
            try {
                Vue.axios
                    .post("/user/upload-image", image)
                    .then((res) => res.data)
                    .then((data) => {
                        commit('setUser', data.user)
                    })
            } catch (e) { console.log(e) }
        },
        async updateUserInfo({ commit }, payload) {
            var result = {
                result: false,
                message: null
            },
                user = {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    email: payload.email,
                    birth_day: payload.birth_day,
                };
            try {
                await Vue.axios
                    .put("/user/update/donors-site", user)
                    .then((res) => res.data)
                    .then((data) => {
                        result.result = true;
                        result.message = data.message
                        commit('setUser', data.user)
                    })
                    .catch((error) => {
                        result.result = false;
                        result.message = error.response.data.errors;
                    });
                return result
            } catch (e) { console.log(e) }
        },
        async resendEmailVerifiation({ commit }) {
            var result;
            try {
                await Vue.axios
                    .post("/user/new-email-verification-resend")
                    .then((res) => {
                        result = res.data.message
                    })
                    .catch((error) => {
                        result = error.response.data.error
                    });
                return result
            } catch (e) { console.log(e) }
        },
        async verifyNewEmail({ commit }, payload) {
            var result = {
                result: false,
                message: ''
            };
            try {
                await Vue.axios
                    .post("/user/verify-new-email", payload)
                    .then((res) => res.data)
                    .then((data) => {
                        result = {
                            result: true,
                            message: data.message
                        };
                        commit('setUser', data.user)
                    })
                    .catch((error) => {
                        result = {
                            result: false,
                            message: error.response.data.error
                        };
                    });
                return result
            } catch (e) { console.log(e) }
        },
        async resetPassword({ commit }, payload) {
            var password = {
                current_password: payload.currentPassword,
                password: payload.newPassword,
                password_confirmation: payload.passwordConfirmation,
            }, errors = false;
            try {
                await Vue.axios
                    .post("/user/reset-password", password)
                    .then((res) => res.data)
                    .then((data) => {
                    })
                    .catch((error) => {
                        errors = error.response.data.errors
                    });
                return errors
            } catch (e) { console.log(e) }
        },
        async twoFactorChange({ commit }, payload) {
            var two_factor_method = {
                two_factor_method: payload,
            },
                result = false;
            try {
                await Vue.axios
                    .patch("/two-factor", two_factor_method)
                    .then((res) => res.data)
                    .then((data) => {
                        result = true;
                        commit('setUser', data.user)
                    })
                return result
            } catch (e) { console.log(e) }
        },
        async securityQuestionChange({ commit }, payload) {
            var answers_for_questions = {
                answers_for_questions: payload
            };
            try {
                await Vue.axios
                    .put("/user/security-questions-with-answers", answers_for_questions)
                    .then((res) => res.data)
                    .then((data) => {
                        console.log(data)
                    })
            } catch (e) { console.log(e) }
        },
        async getSecurityQuestions({ commit }, payload) {
            try {
                await Vue.axios
                    .get("/user/security-questions-with-answers")
                    .then((res) => res.data)
                    .then((data) => {
                        commit('setSecurityAnswers', data)
                    })
            } catch (e) { console.log(e) }
        },
        async getApiAllQuestions({ commit }, payload) {
            try {
                await Vue.axios
                    .get("/security-questions")
                    .then((res) => res.data)
                    .then((data) => {
                        commit('setAllSecurityQuestions', data)
                    })
            } catch (e) { console.log(e) }
        },
        async changeSecurity({ commit }, payload) {
            var result = false;
            try {
                await Vue.axios
                    .put("/user/security-questions-with-answers", payload)
                    .then((res) => res.data)
                    .then((data) => {
                        result = true;
                    })
                return result;
            } catch (e) { console.log(e) }
        }
    }
}