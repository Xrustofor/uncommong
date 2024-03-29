const EmailConfirmation = () => import('@/views/auth/email_verification/emailSend.vue');
const CodeVerification = () => import('@/views/auth/email_verification/codeVerification.vue');

const AuthVerifyCode = () => import('@/views/auth/two_step_auth/codeVerification.vue');

export default [
    {
        path: '/email-confirmation',
        name: 'email-confirmation',
        component: EmailConfirmation,
        meta: {
            layout: 'full-page',
            requiresAuth: true
        }
    },
    {
        path: '/code-verification',
        name: 'email-verification',
        component: CodeVerification,
        meta: {
            layout: 'full-page',
            requiresAuth: true
        }
    },
    {
        path: '/verify-code',
        name: 'verify-code',
        component: AuthVerifyCode,
        meta: {
            layout: 'full-page',
            requiresAuth: true
        }
    },
]