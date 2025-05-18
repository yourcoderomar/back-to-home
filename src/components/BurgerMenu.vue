<template>
  <div class="burger-menu-container" :class="{ 'is-visible': isVisible }">
    <ul class="burger-menu">
      <li>
        <div class="search-container">
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
                {{ page.name }}
              </li>
            </ul>
            <div v-else class="no-results">No results found</div>
          </div>
        </div>
      </li>
      <ul class="burger-menu">
        <li><router-link to="/ReportMissing">Report a Missing Person</router-link></li>
        <li><router-link to="/SearchMissing">Search for a Missing Person</router-link></li>
        <li><router-link to="/SearchReports">Search Reports</router-link></li>

        <li>
          <router-link to="/donation">Donate</router-link>
        </li>
        <li><router-link to="/OurPlans">Our Plans</router-link></li>
        <li><router-link to="/AboutUs">About Us</router-link></li>
        <li><router-link to="/Contact">Contact Us</router-link></li>
      </ul>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BurgerMenu',
  data() {
    return {
      isVisible: false,
      searchQuery: '',
      filteredPages: [],
      availablePages: [
        { name: 'About Us', path: '/AboutUs', icon: 'info' },
        { name: 'Plans', path: '/OurPlans', icon: 'card_membership' },
        { name: 'Report Missing', path: '/ReportMissing', icon: 'report' },
        { name: 'Search Missing', path: '/SearchMissing', icon: 'search' },
        { name: 'Reports', path: '/SearchReports', icon: 'description' },
        { name: 'Donate', path: '/donate', icon: 'monetization_on' },
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
  top: 70px; /* Directly under navbar */
  left: 0;
  width: 100%;
  background: #f2f0e9;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.5);
  border-radius: 0 0 16px 16px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  z-index: 998;
}

.is-visible {
  max-height: 700px; /* Adjust as needed */
}

.burger-menu {
  list-style: none;
  padding: 10px;
  margin: 0;
}

.burger-menu li {
  padding: 12px 20px;
  border-bottom: 1px solid #ddd;
}

.burger-menu li a {
  text-decoration: none;
  color: #2c3539;
  font-weight: 600;
}

.burger-menu li a:hover {
  color: #49596b;
}

.donate-item {
  text-align: center;
  margin-top: 10px;
}

.search-container {
  position: relative;
  width: 100%;
  padding: 10px;
}

.search-box {
  width: 100%;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 10px;
  right: 10px;
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
</style>
