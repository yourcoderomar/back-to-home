import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { supabase } from 'src/boot/supabase'
import routes from './routes'

// Cache for admin status to reduce database queries
const adminCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth' }
      }
      return { left: 0, top: 0, behavior: 'smooth' }
    },
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Debounce function to prevent multiple rapid checks
  const debounce = (fn, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  // Check admin status with caching
  const checkAdminStatus = async (userId) => {
    const cached = adminCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.isAdmin
    }

    try {
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      const isAdmin = !!adminData
      adminCache.set(userId, { isAdmin, timestamp: Date.now() })
      return isAdmin
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Debounced navigation guard
  const debouncedGuard = debounce(async (to, from, next) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user || null
      const isAuthenticated = session && user

      if (!isAuthenticated && to.meta.requiresAuth) {
        return next({
          path: '/signin',
          query: { redirect: to.fullPath },
        })
      }

      if (to.meta.requiresAdmin) {
        const isAdmin = await checkAdminStatus(user?.id)
        if (!isAdmin) {
          return next('/')
        }
      }

      if (isAuthenticated && to.meta.requiresGuest) {
        return next('/')
      }

      next()
    } catch (error) {
      console.error('Navigation error:', error)
      next('/')
    }
  }, 100)

  Router.beforeEach((to, from, next) => {
    // Skip navigation guard for static routes
    if (!to.meta.requiresAuth && !to.meta.requiresAdmin && !to.meta.requiresGuest) {
      return next()
    }
    debouncedGuard(to, from, next)
  })

  return Router
})
