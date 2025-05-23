<template>
  <div class="navbar-wrapper">
    <header :class="['navbar', { 'transparent-nav': isTransparent }, navbarClass]">
      <!-- Logo -->
      <router-link to="/" class="logo-link">
        <img
          src="/images/logo.webp"
          alt="Back2Home Logo"
          class="logo"
          width="150"
          height="50"
          loading="eager"
          fetchpriority="high"
          decoding="sync"
        />
      </router-link>

      <!-- Navigation Buttons -->
      <nav class="nav-buttons">
        <div class="show-on-desktop">
          <div class="search-container">
            <q-icon name="search" class="search-icon" />
            <q-input
              v-model="searchQuery"
              class="search-box"
              placeholder="Search..."
              dense
              standout
              @update:model-value="handleSearch"
            />
            <!-- Search Results Dropdown -->
            <div v-show="searchQuery" class="search-dropdown">
              <ul v-if="filteredPages.length > 0">
                <li
                  v-for="page in filteredPages"
                  :key="page.path"
                  @click="navigateToPage(page.path)"
                >
                  <q-icon :name="page.icon" class="page-icon" />
                  {{ page.name }}
                </li>
              </ul>
              <div v-else class="no-results">No results found</div>
            </div>
          </div>
          <router-link to="/AboutUs" class="nav-link"> <q-icon name="info" /> About </router-link>
          <router-link to="/OurPlans" class="nav-link">
            <q-icon name="card_membership" /> Subscriptions
          </router-link>
          <router-link to="/ReportMissing" class="nav-link">
            <q-icon name="report" /> Report
          </router-link>
          <router-link to="/SearchMissing" class="nav-link">
            <q-icon name="search" /> Find
          </router-link>
          <router-link to="/SearchReports" class="nav-link">
            <q-icon name="description" /> Browse
          </router-link>
          <router-link v-if="userPlan === 2" to="/MatchedReports" class="nav-link">
            <q-icon name="compare_arrows" /> Matches
          </router-link>
          <router-link v-if="isAdmin" to="/admin" class="nav-link admin-link">
            <q-icon name="admin_panel_settings" /> Admin
          </router-link>
          <router-link to="/donate" class="donate-btn">
            <q-icon name="volunteer_activism" /> Support
          </router-link>
        </div>
      </nav>

      <!-- Icons -->
      <div class="icon-container">
        <NotificationComponent ref="notificationComponent" />

        <!-- Profile Dropdown -->
        <q-btn-dropdown v-if="user" flat round dense class="icon-btn profile-dropdown">
          <template v-slot:label>
            <q-avatar size="32px" class="no-shadow">
              <img :src="userAvatar" alt="User Avatar" class="avatar-img" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="goToProfile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="goToSavedReports">
              <q-item-section avatar>
                <q-icon name="bookmark" :color="userPlan === 2 ? 'primary' : 'grey'">
                  <q-tooltip v-if="userPlan !== 2" class="bg-grey-8">
                    Upgrade to Pro plan to save reports
                  </q-tooltip>
                </q-icon>
              </q-item-section>
              <q-item-section>Saved Reports</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="handleLogout" class="text-negative">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Sign In / Sign Up Dropdown -->
        <q-btn-dropdown v-else flat round dense class="icon-btn auth-dropdown">
          <template v-slot:label>
            <q-icon name="person" size="32px" style="color: #2c3539" />
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="goToSignIn">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>
              <q-item-section>Sign In</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="goToSignUp">
              <q-item-section avatar>
                <q-icon name="person_add" />
              </q-item-section>
              <q-item-section>Sign Up</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Burger Menu (Mobile) -->
        <div
          v-if="$q.screen.lt.md"
          class="burger-icon"
          @click="toggleMenu"
          :class="{ 'is-menu-open': isMenuOpen }"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        <BurgerMenu ref="burgerMenu" @menuToggled="isMenuOpen = $event" :userPlan="userPlan" />
      </div>
    </header>
  </div>

  <main class="page-content"></main>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import BurgerMenu from './BurgerMenu.vue'
import NotificationComponent from './NotificationComponent.vue'

export default {
  name: 'NavBar',
  components: {
    BurgerMenu,
    NotificationComponent,
  },
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const searchQuery = ref('')
    const isTransparent = ref(false)
    const burgerMenu = ref(null)
    const notificationComponent = ref(null)
    const isMenuOpen = ref(false)
    const user = ref(null)
    const isAdmin = ref(false)
    const userPlan = ref(null)
    const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    const userAvatar = ref(defaultAvatar)

    // Define available pages for search
    const availablePages = [
      { name: 'About', path: '/AboutUs', icon: 'info' },
      { name: 'Subscriptions', path: '/OurPlans', icon: 'card_membership' },
      { name: 'Report', path: '/ReportMissing', icon: 'report' },
      { name: 'Find', path: '/SearchMissing', icon: 'search' },
      { name: 'Browse', path: '/SearchReports', icon: 'description' },
      { name: 'Matches', path: '/MatchedReports', icon: 'compare_arrows' },
      { name: 'Support', path: '/donate', icon: 'volunteer_activism' },
      { name: 'Profile', path: '/ProfilePage', icon: 'person' },
      { name: 'Account Settings', path: '/AccountSettings', icon: 'settings' },
      { name: 'Security', path: '/Security', icon: 'security' },
      { name: 'Admin Dashboard', path: '/admin', icon: 'admin_panel_settings' },
    ]

    const filteredPages = ref([])

    const handleSearch = (value) => {
      if (!value?.trim()) {
        filteredPages.value = []
        return
      }

      const query = value.toLowerCase()
      filteredPages.value = availablePages.filter(
        (page) =>
          page.name.toLowerCase().includes(query) || page.path.toLowerCase().includes(query),
      )
    }

    const navigateToPage = (path) => {
      router.push(path)
      searchQuery.value = ''
    }

    const fetchUserAvatar = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_picture')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) {
          console.error('Error fetching avatar:', error)
          throw error
        }

        userAvatar.value = data?.profile_picture || defaultAvatar
      } catch (error) {
        console.error('Error in fetchUserAvatar:', error)
        userAvatar.value = defaultAvatar
      }
    }

    const fetchUserPlan = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('user_plan')
          .eq('user_id', userId)
          .single()

        if (error) throw error
        userPlan.value = data?.user_plan
      } catch (error) {
        console.error('Error fetching user plan:', error)
        userPlan.value = null
      }
    }

    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        user.value = userData.user
        await fetchUserAvatar(userData.user.id)
        await fetchUserPlan(userData.user.id)

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', userData.user.id)
          .maybeSingle()

        isAdmin.value = !!adminData
      }
    }

    const goToProfile = () => router.push('/ProfilePage')
    const goToSignIn = () => router.push('/SignIn')
    const goToSignUp = () => router.push('/SignUp')
    const goToSavedReports = () => {
      if (user.value && userPlan.value === 2) {
        router.push('/saved-reports')
      } else {
        router.push('/OurPlans')
      }
    }

    const handleLogout = async () => {
      await supabase.auth.signOut()
      user.value = null
      userAvatar.value = defaultAvatar
      router.push('/SignIn')
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
      burgerMenu.value?.toggleMenu()
    }

    const handleScroll = () => {
      isTransparent.value =
        ['/', '/SignIn', '/SignUp'].includes(route.path) &&
        window.scrollY < window.innerHeight * 0.5
    }

    const toggleNotifications = () => {
      if (notificationComponent.value) {
        notificationComponent.value.toggleNotifications()
      }
    }

    onMounted(() => {
      fetchUser()
      handleScroll()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      searchQuery,
      isTransparent,
      user,
      userAvatar,
      isAdmin,
      userPlan,
      goToProfile,
      goToSignIn,
      goToSignUp,
      goToSavedReports,
      handleLogout,
      isMenuOpen,
      burgerMenu,
      toggleMenu,
      filteredPages,
      handleSearch,
      navigateToPage,
      notificationComponent,
      toggleNotifications,
      navbarClass: props.class,
    }
  },
}
</script>

<style lang="scss" scoped>
$link-color: #49596b;
$white: #f2f0e9;
$black: black;
$gray: rgb(90, 90, 90);

.navbar-wrapper {
  width: 100%;
}

.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  background: $white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  border-radius: 16px;
  height: 70px;
  transition:
    background 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
}

/* Push content down to avoid overlap */
.page-content {
  margin-top: 50px;
  padding: 20px;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin: 10px;
}

.logo {
  height: 50px;
  width: auto;
  object-fit: contain;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box {
  width: 200px;
}

.donate-btn {
  color: #2c3539;
  text-decoration: none;
  font-weight: 800;
}

.donate-btn:hover {
  color: $link-color;
}

.nav-link {
  color: #2c3539;
  text-decoration: none;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover {
  color: $link-color;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-btn:hover {
  color: $link-color;
}

.transparent-nav {
  background: transparent !important;
  box-shadow: none;
}

.show-on-mobile {
  display: none; /* Hidden by default */
}

.show-on-desktop {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 🔹 Burger Menu Icon - Shows Only on Mobile */
.burger-icon {
  width: 30px;
  height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.burger-icon div {
  width: 100%;
  height: 4px;
  background-color: #2c3539;
  border-radius: 3px;
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

/* 🔥 Smooth "X" Animation */
.burger-icon.is-menu-open div:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.burger-icon.is-menu-open div:nth-child(2) {
  opacity: 0;
}

.burger-icon.is-menu-open div:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar {
    width: 95%;
  }
}

@media (max-width: 857px) {
  .show-on-mobile {
    display: flex; /* Show only on mobile */
  }
  .show-on-desktop {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    width: 100%;
    left: 0;
    transform: none;
    border-radius: 0;
    top: 0;
  }
  .page-content {
    margin-top: 80px;
  }
}

/* Floating Notification Panel */
.notification-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 250px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  z-index: 1000;
}

.notification-panel h4 {
  margin: 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

.notification-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-panel li {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.notification-panel li:last-child {
  border-bottom: none;
}

/* Smooth Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.icon-container {
  display: flex; /* Ensures horizontal layout */
  align-items: center; /* Aligns items vertically */
  gap: 10px; /* Adds spacing between icons */
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;

  .no-results {
    padding: 16px;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: #2c3539;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f5f5f5;
    }

    .page-icon {
      color: #666;
    }
  }
}

.admin-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #49596b;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(73, 89, 107, 0.1);
  }

  .q-icon {
    font-size: 20px;
  }
}

/* Enhanced Dropdown Styling */
:deep(.q-menu) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  padding: 8px;
  min-width: 200px;
}

:deep(.q-item) {
  border-radius: 8px;
  margin: 4px 0;
  min-height: 48px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f7fa;
  }

  .q-item__section--avatar {
    min-width: 40px;
    color: #49596b;
  }

  .q-icon {
    font-size: 20px;
  }

  .q-item__label {
    font-size: 14px;
    font-weight: 500;
    color: #2c3539;
  }

  .q-tooltip {
    font-size: 12px;
    padding: 8px 12px;
    border-radius: 4px;
  }
}

:deep(.q-btn-dropdown) {
  .q-btn__content {
    padding: 4px;
  }

  .q-avatar {
    border: 2px solid #e0e0e0;
    transition: border-color 0.2s ease;
    background: transparent;

    &:hover {
      border-color: #49596b;
    }

    .avatar-img {
      border-radius: 50%;
      object-fit: cover;
    }
  }
}

/* Profile Dropdown Specific */
:deep(.profile-dropdown) {
  .q-item {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &.text-negative {
      color: #c62828;
      .q-icon {
        color: #c62828;
      }
    }
  }
}

/* Sign In/Up Dropdown Specific */
:deep(.auth-dropdown) {
  .q-item {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
