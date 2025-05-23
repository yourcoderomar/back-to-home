// Define route chunks for better code splitting
const routeChunks = {
  auth: () => import('pages/SignIn.vue'),
  profile: () => import('pages/ProfilePage.vue'),
  admin: () => import('layouts/AdminLayout.vue'),
  public: () => import('pages/IndexPage.vue'),
  reports: () => import('pages/ReportMissing.vue'),
  search: () => import('pages/SearchMissing.vue'),
  settings: () => import('pages/AccountSettings.vue'),
  plans: () => import('pages/OurPlans.vue'),
  donation: () => import('pages/DonationPage.vue'),
  error: () => import('pages/ErrorNotFound.vue'),
  matched: () => import('pages/MatchedReports.vue'),
}

// Helper function for lazy loading with loading state
const lazyLoad = (component) => ({
  component: component,
  loading: {
    template: '<div class="loading-container"><q-spinner-dots color="primary" size="40px" /></div>',
  },
  error: {
    template: '<div class="error-container">Failed to load component</div>',
  },
  delay: 200,
  timeout: 5000,
})

const routes = [
  {
    path: '/',
    ...lazyLoad(routeChunks.public),
  },
  {
    path: '/OurPlans',
    ...lazyLoad(routeChunks.plans),
  },
  {
    path: '/ReportMissing',
    ...lazyLoad(routeChunks.reports),
  },
  {
    path: '/SearchMissing',
    ...lazyLoad(routeChunks.search),
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
    ...lazyLoad(routeChunks.auth),
    meta: { requiresGuest: true },
  },
  {
    path: '/ProfilePage',
    ...lazyLoad(routeChunks.profile),
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
    ...lazyLoad(routeChunks.settings),
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
    ...lazyLoad(routeChunks.donation),
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
    meta: { requiresAuth: true },
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: () => import('pages/ContactUs.vue'),
  },
  {
    path: '/admin',
    ...lazyLoad(routeChunks.admin),
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
  {
    path: '/matched-reports',
    name: 'MatchedReports',
    ...lazyLoad(routeChunks.matched),
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)*',
    ...lazyLoad(routeChunks.error),
  },
]

export default routes
