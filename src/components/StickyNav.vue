<template>
    <div v-show="showStickyNav" class="sticky-nav">
      <router-link to="/section-home" class="logo-link">
        <img src="/images/logo.png" alt="Logo" class="logo" />
      </router-link>
  
      <div class="nav-buttons">
        <div class="search-container">
          <q-icon name="search" class="search-icon" />
          <q-input v-model="searchQuery" class="search-box" placeholder="Search..." dense standout />
        </div>
  
        <router-link to="/donation" class="donate-btn">
          <q-icon name="monetization_on" /> Donation
        </router-link>
  
        <router-link to="/SupportUS" class="nav-link">Report a missing person</router-link>
        <router-link to="/missingperson" class="nav-link">Search for a missing person</router-link>
        <router-link to="/aboutus" class="nav-link">About us</router-link>
  
        <!-- Notification Icon -->
        <q-btn flat round dense class="icon-btn">
          <q-icon name="notifications" size="24px" />
        </q-btn>
  
        <!-- User Icon -->
      <q-btn flat round dense class="icon-btn">
        <q-icon name="person" size="24px" />
      </q-btn>
      </div>
    </div>
  </template>
  

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const searchQuery = ref("");
    const showStickyNav = ref(false);

    const handleScroll = () => {
      showStickyNav.value = window.scrollY > 100; // Show navbar when scrolled 100px
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      searchQuery,
      showStickyNav
    };
  }
};
</script>

<style lang="scss" scoped>

$link-color: #49596b;
$white: #f2f0e9;
$black: black;
$gray: rgb(90, 90, 90);

.sticky-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: $white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  transition: transform 0.3s ease-in-out;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-box {
  width: 200px;
}

.donate-btn {
  background: $link-color;
  color: $white;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  
}

.donate-btn:hover{
    background-color: $white;
    color: $link-color;
}

.nav-link {
  color: #2C3539;
  text-decoration: none;
}

.nav-link:hover {
  color: $link-color;
}

@media (max-width: 1024px) {
  .sticky-nav {
    display: none;
  }
}

</style>
