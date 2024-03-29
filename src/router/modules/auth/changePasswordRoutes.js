/*recovery*/
const CheckRecoveryToken = () => import('@/views/auth/password/recovery/checkToken.vue');
const NewPassword = () => import('@/views/auth/password/recovery/newPassword.vue');

/*forgot*/
const ForgotPassword = () => import('@/views/auth/password/forgot/forgotPassword.vue');
const CheckForgotToken = () => import('@/views/auth/password/forgot/checkToken.vue');
const ForgotPasswordConfirme = () => import('@/views/auth/password/forgot/forgotPasswordConfirme.vue');


export default [
    {
        path: '/password/recovery/:token',
        name: 'check-recovery-token',
        component: CheckRecoveryToken,
        meta: {
            layout: 'full-page',
            guest: true
        }
    },
    {
        path: '/new-password',
        name: 'new-password',
        component: NewPassword,
        meta: {
            layout: 'full-page',
            guest: true
        }
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            layout: 'full-page',
            guest: true
        }
    },
    {
        path: '/password/forgot/:token',
        name: 'check-forgot-token',
        component: CheckForgotToken,
        meta: {
            layout: 'full-page',
            guest: true
        }
    },
    {
        path: '/forgot-password-confirme',
        name: 'forgot-password-confirme',
        component: ForgotPasswordConfirme,
        meta: {
            layout: 'full-page',
            guest: true
        }
    },
]