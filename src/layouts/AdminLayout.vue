<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" class="menu-btn" />
        <q-toolbar-title class="text-weight-bold">Admin Dashboard</q-toolbar-title>

        <!-- Breadcrumbs -->
        <div class="breadcrumbs">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/admin/dashboard" label="Home" />
            <q-breadcrumbs-el :label="currentPage" />
          </q-breadcrumbs>
        </div>

        <NotificationComponent />
        <q-btn-dropdown v-if="user" flat round dense class="header-btn">
          <template v-slot:label>
            <q-avatar size="32px">
              <img :src="userAvatar" alt="User Avatar" class="avatar-img" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="goToProfile">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="admin-drawer"
      :width="280"
      :breakpoint="400"
      :behavior="'desktop'"
      persistent
      :mini="!leftDrawerOpen"
    >
      <q-list padding class="drawer-list">
        <q-item-label header class="drawer-header">Navigation</q-item-label>

        <!-- Main Navigation -->
        <q-item
          clickable
          v-ripple
          to="/admin/dashboard"
          exact
          class="drawer-item"
          :class="{ active: $route.path === '/admin/dashboard' }"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/users"
          class="drawer-item"
          :class="{ active: $route.path === '/admin/users' }"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/admin/reports"
          class="drawer-item"
          :class="{ active: $route.path === '/admin/reports' }"
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Reports</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Recent Section -->
        <q-item-label header class="drawer-header">Recent</q-item-label>
        <q-item
          v-for="(item, index) in recentItems"
          :key="index"
          clickable
          v-ripple
          :to="item.path"
          class="drawer-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption>{{ item.time }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/" class="drawer-item">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Back to Home</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import NotificationComponent from 'components/NotificationComponent.vue'

export default {
  name: 'AdminLayout',
  components: {
    NotificationComponent,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const leftDrawerOpen = ref(false)
    const user = ref(null)
    const userAvatar = ref('https://cdn-icons-png.flaticon.com/512/149/149071.png')
    const recentItems = ref([])

    const currentPage = computed(() => {
      const path = route.path.split('/').pop()
      return path.charAt(0).toUpperCase() + path.slice(1)
    })

    const addToRecent = (path, label, icon) => {
      const newItem = {
        path,
        label,
        icon,
        time: new Date().toLocaleTimeString(),
      }
      recentItems.value = [newItem, ...recentItems.value.slice(0, 4)]
      localStorage.setItem('recentItems', JSON.stringify(recentItems.value))
    }

    // Load recent items from localStorage
    onMounted(() => {
      const savedRecentItems = localStorage.getItem('recentItems')
      if (savedRecentItems) {
        recentItems.value = JSON.parse(savedRecentItems)
      }
    })

    // Watch route changes to update recent items
    watch(
      () => route.path,
      (newPath) => {
        const pathParts = newPath.split('/')
        const page = pathParts[pathParts.length - 1]
        if (page && page !== 'dashboard') {
          addToRecent(newPath, page.charAt(0).toUpperCase() + page.slice(1), 'history')
        }
      },
    )

    const fetchUserAvatar = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_picture')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) throw error
        userAvatar.value = data?.profile_picture || userAvatar.value
      } catch (error) {
        console.error('Error fetching avatar:', error)
      }
    }

    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        user.value = userData.user
        await fetchUserAvatar(userData.user.id)
      }
    }

    const goToProfile = () => router.push('/ProfilePage')
    const handleLogout = async () => {
      await supabase.auth.signOut()
      user.value = null
      router.push('/SignIn')
    }

    onMounted(() => {
      fetchUser()
    })

    return {
      leftDrawerOpen,
      user,
      userAvatar,
      currentPage,
      recentItems,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      goToProfile,
      handleLogout,
    }
  },
}
</script>

<style lang="scss" scoped>
$main-bg: #f9fafd;
$header-bg: #fff;
$drawer-bg: #fff;
$primary: #2196f3;
$primary-light: #e3f0fd;
$border: #e3e8ef;
$text: #222;
$text-light: #b0b8c1;
$shadow: 0 2px 12px rgba(33, 150, 243, 0.07);

.admin-layout {
  background: $main-bg;
}

.admin-header {
  background: $header-bg;
  color: $text;
  box-shadow: $shadow;
  .q-toolbar {
    min-height: 64px;
  }
  .q-toolbar-title {
    font-size: 1.25rem;
    letter-spacing: 0.5px;
    color: $text;
    font-weight: 700;
  }
}

.menu-btn,
.header-btn {
  color: $primary;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.1);
    background: $primary-light;
  }
}

.admin-drawer {
  background: $drawer-bg;
  border-right: 1px solid $border;
}

.drawer-list {
  padding: 16px 0;
}

.drawer-header {
  color: $text;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0 16px;
  margin-bottom: 8px;
}

.drawer-item {
  margin: 4px 8px;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: $text;
  font-weight: 500;
  &:hover {
    background: $primary-light;
    color: $primary;
    .q-icon {
      color: $primary;
    }
  }
  &.active {
    background: $primary-light;
    color: $primary;
    font-weight: 700;
    .q-icon {
      color: $primary;
    }
  }
  .q-icon {
    color: $text-light;
    font-size: 1.5rem;
    transition: color 0.2s;
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.breadcrumbs {
  margin: 0 16px;
  .q-breadcrumbs {
    font-size: 0.9rem;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .admin-header {
    .q-toolbar {
      min-height: 56px;
    }
    .q-toolbar-title {
      font-size: 1.1rem;
    }
  }
  .drawer-item {
    margin: 2px 4px;
  }
}
@media (max-width: 480px) {
  .admin-header {
    .q-toolbar {
      padding: 0 8px;
    }
  }
}
</style>
