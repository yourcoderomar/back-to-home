<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" class="menu-btn" />
        <q-toolbar-title class="text-weight-bold">Admin Dashboard</q-toolbar-title>
        <q-btn flat round dense icon="notifications" class="header-btn">
          <q-badge color="red" floating>2</q-badge>
        </q-btn>
        <q-btn flat round dense icon="person" class="header-btn" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="admin-drawer" :width="280">
      <q-list padding class="drawer-list">
        <q-item-label header class="drawer-header">Navigation</q-item-label>

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

        <q-item
          clickable
          v-ripple
          to="/admin/settings"
          class="drawer-item"
          :class="{ active: $route.path === '/admin/settings' }"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
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
import { ref } from 'vue'

export default {
  name: 'AdminLayout',
  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
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
