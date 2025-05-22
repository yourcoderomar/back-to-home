const routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'), // Optional: Keep IndexPage.vue if needed
  },
  {
    path: '/OurPlans',
    component: () => import('pages/OurPlans.vue'),
  },
  {
    path: '/ReportMissing',
    component: () => import('pages/ReportMissing.vue'),
  },
  {
    path: '/SearchMissing',
    component: () => import('pages/SearchMissing.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/AboutUs',
    component: () => import('pages/AboutUs.vue'),
  },
  {
    path: '/SignUp',
    component: () => import('pages/SignUp.vue'),
  },

  {
    path: '/CompleteProfile',
    component: () => import('pages/CompleteProfile.vue'),
  },
  {
    path: '/SignIn',
    component: () => import('pages/SignIn.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/ProfilePage',
    component: () => import('pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ReportDetails/:id',
    component: () => import('pages/ReportDetails.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/AccountSettings',
    name: 'AccountSettings',
    component: () => import('pages/AccountSettings.vue'),
  },
  {
    path: '/MyPlan',
    name: 'MyPlan',
    component: () => import('pages/MyPlan.vue'),
  },
  {
    path: '/Security',
    name: 'SecuritySettings',
    component: () => import('pages/Security.vue'),
  },
  {
    path: '/SearchReports',
    name: 'SearchReports',
    component: () => import('pages/SearchReports.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/donate',
    name: 'Donate',
    component: () => import('pages/DonationPage.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('pages/CheckoutPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/saved-reports',
    name: 'SavedReports',
    component: () => import('pages/SavedReports.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: () => import('pages/ContactUs.vue'),
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        component: () => import('pages/admin/Dashboard.vue'),
      },
      {
        path: 'users',
        component: () => import('pages/admin/Users.vue'),
      },
      {
        path: 'reports',
        component: () => import('pages/admin/Reports.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
