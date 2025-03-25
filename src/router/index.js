import { defineRouter } from "#q-app/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { supabase } from "src/boot/supabase";
import routes from "./routes";

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    console.log(`🔄 Checking route: ${to.path}`);

    try {
      // Fetch the latest session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("✅ Supabase session:", session);

      // Get the authenticated user (needed to confirm login)
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user || null;

      console.log("👤 User:", user);

      // Ensure that we detect logout correctly
      const isAuthenticated = session && user;

      // 🔒 Redirect guests trying to access protected pages
      if (!isAuthenticated && to.meta.requiresAuth) {
        console.log("🔑 Not authenticated, redirecting to /signin");
        // Store the attempted route in query params
        return next({
          path: "/signin",
          query: { redirect: to.fullPath }, // Store the original route in query params
        });
      }

      // 🚀 Redirect logged-in users away from guest-only pages (e.g., Sign-In)
      if (isAuthenticated && to.meta.requiresGuest) {
        console.log("🚀 Already signed in, redirecting to /");
        return next("/"); // Redirect to home if already authenticated
      }

      next(); // Allow navigation if no redirection is needed
    } catch (error) {
      console.error("❌ Router error:", error);
      next(); // Let the user navigate if there's an error
    }
  });

  return Router;
});
