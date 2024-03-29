const Login = () => import('@/views/auth/login/login.vue');
const AnswerSecurityQuestion = () => import('@/views/auth/two_step_auth/security_questions/answerSecurityQuestions.vue')
const SecurityQuestionsLogin = () => import('@/views/auth/login/securityQuestionsLogin.vue');

export default [
    {
        path: '/login',
        name: 'login',
        component: Login,
        props: true,
        meta: {
            layout: 'full-page',
            guest: true,
        },

    },
    {
        path: '/security-questions',
        name: 'security-questions-login',
        component: SecurityQuestionsLogin,
        meta: {
            layout: 'full-page',
            requiresAuth: true,
        }
    },
    {
        path: '/answer-security-question',
        name: 'answer-security-question',
        component: AnswerSecurityQuestion,
        meta: {
            layout: 'full-page',
            requiresAuth: true,
        }
    },
]