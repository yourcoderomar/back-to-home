import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { supabase } from 'src/boot/supabase'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    try {
      // Fetch the latest session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Get the authenticated user
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user || null

      // Ensure that we detect logout correctly
      const isAuthenticated = session && user

      // Check if user is admin
      let isAdmin = false
      if (isAuthenticated) {
        try {
          const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()

          isAdmin = !!adminData
        } catch (error) {
          console.error('Error checking admin status:', error)
        }
      }

      // 🔒 Redirect guests trying to access protected pages
      if (!isAuthenticated && to.meta.requiresAuth) {
        return next({
          path: '/signin',
          query: { redirect: to.fullPath },
        })
      }

      // 🚫 Redirect non-admin users trying to access admin pages
      if (to.meta.requiresAdmin && !isAdmin) {
        return next('/')
      }

      // 🚀 Redirect logged-in users away from guest-only pages
      if (isAuthenticated && to.meta.requiresGuest) {
        return next('/')
      }

      next()
    } catch (error) {
      console.error('Navigation error:', error)
      next('/')
    }
  })

  return Router
})
