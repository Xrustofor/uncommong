const Registration = () => import('@/views/auth/registration/registrationInfoSetup.vue');
const SecurityQuestions = () => import('@/views/auth/two_step_auth/security_questions/setSecurityQuestions.vue');


export default [
    {
        path: '/register',
        name: 'registration',
        component: Registration,
        meta: {
            layout: 'full-page',
            guest: true,
        }
    },
    {
        path: '/set-security-questions',
        name: 'security-questions-register',
        component: SecurityQuestions,
        meta: {
            layout: 'full-page',
            requiresAuth: true,
        }
    },
]