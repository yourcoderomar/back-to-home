<template>
  <div class="burger-menu-container" :class="{ 'is-visible': isVisible }">
    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="searchQuery"
        class="search-box"
        placeholder="Search..."
        dense
        standout
        @update:model-value="handleSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="search-icon" />
        </template>
      </q-input>
      <!-- Search Results Dropdown -->
      <div v-show="searchQuery" class="search-dropdown">
        <ul v-if="filteredPages.length > 0">
          <li v-for="page in filteredPages" :key="page.path" @click="navigateToPage(page.path)">
            <q-icon :name="page.icon" class="page-icon" />
            <span>{{ page.name }}</span>
          </li>
        </ul>
        <div v-else class="no-results">No results found</div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="menu-nav">
      <div class="menu-section">
        <h3 class="section-title">Main</h3>
        <ul class="menu-list">
          <li>
            <router-link to="/ReportMissing" class="menu-link">
              <q-icon name="report" class="menu-icon" />
              <span>Found</span>
            </router-link>
          </li>
          <li>
            <router-link to="/SearchMissing" class="menu-link">
              <q-icon name="search" class="menu-icon" />
              <span>Missing</span>
            </router-link>
          </li>
          <li>
            <router-link to="/SearchReports" class="menu-link">
              <q-icon name="description" class="menu-icon" />
              <span>Browse</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <h3 class="section-title">Account</h3>
        <ul class="menu-list">
          <li v-if="userPlan === 2">
            <router-link to="/matched-reports" class="menu-link">
              <q-icon name="compare_arrows" class="menu-icon" />
              <span>Matches</span>
            </router-link>
          </li>
          <li>
            <router-link to="/donate" class="menu-link highlight">
              <q-icon name="volunteer_activism" class="menu-icon" />
              <span>Support</span>
            </router-link>
          </li>
          <li>
            <router-link to="/OurPlans" class="menu-link">
              <q-icon name="card_membership" class="menu-icon" />
              <span>Subscriptions</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="menu-section">
        <h3 class="section-title">About</h3>
        <ul class="menu-list">
          <li>
            <router-link to="/AboutUs" class="menu-link">
              <q-icon name="info" class="menu-icon" />
              <span>About</span>
            </router-link>
          </li>
          <li>
            <router-link to="/contact-us" class="menu-link">
              <q-icon name="contact_support" class="menu-icon" />
              <span>Contact Us</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'BurgerMenu',
  props: {
    userPlan: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      isVisible: false,
      searchQuery: '',
      filteredPages: [],
      availablePages: [
        { name: 'About', path: '/AboutUs', icon: 'info' },
        { name: 'Subscriptions', path: '/OurPlans', icon: 'card_membership' },
        { name: 'Report', path: '/ReportMissing', icon: 'report' },
        { name: 'Find', path: '/SearchMissing', icon: 'search' },
        { name: 'Browse', path: '/SearchReports', icon: 'description' },
        { name: 'Matches', path: '/matched-reports', icon: 'compare_arrows' },
        { name: 'Support', path: '/donate', icon: 'volunteer_activism' },
        { name: 'Profile', path: '/ProfilePage', icon: 'person' },
        { name: 'Account Settings', path: '/AccountSettings', icon: 'settings' },
        { name: 'Security', path: '/Security', icon: 'security' },
      ],
    }
  },
  methods: {
    toggleMenu() {
      this.isVisible = !this.isVisible
    },
    handleSearch(value) {
      if (!value?.trim()) {
        this.filteredPages = []
        return
      }

      const query = value.toLowerCase()
      this.filteredPages = this.availablePages.filter(
        (page) =>
          page.name.toLowerCase().includes(query) || page.path.toLowerCase().includes(query),
      )
    },
    navigateToPage(path) {
      this.$router.push(path)
      this.searchQuery = ''
      this.isVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.burger-menu-container {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 0 0 24px 24px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 998;
}

.is-visible {
  max-height: calc(100vh - 70px); /* Viewport height minus navbar height */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

/* Add custom scrollbar styling */
.is-visible::-webkit-scrollbar {
  width: 8px;
}

.is-visible::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.is-visible::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.is-visible::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.search-section {
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;

  .search-box {
    width: 100%;
    background: white;
    border-radius: 12px;

    :deep(.q-field__control) {
      border-radius: 12px;
      background: white;
    }
  }
}

.menu-nav {
  padding: 16px;
}

.menu-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
  padding-left: 12px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px;
  text-decoration: none;
  color: #2c3539;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: #f8f9fa;
    color: #49596b;
    transform: translateX(4px);
  }

  &.highlight {
    background: #e3f2fd;
    color: #1976d2;

    &:hover {
      background: #bbdefb;
    }
  }
}

.menu-icon {
  margin-right: 12px;
  font-size: 1.25rem;
  color: #666;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    padding: 8px 0;
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

    &:hover {
      background-color: #f8f9fa;
    }

    .page-icon {
      color: #666;
    }
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .burger-menu-container {
    top: 60px;
  }

  .menu-link {
    padding: 10px;
  }

  .section-title {
    font-size: 0.75rem;
  }
}
</style>
