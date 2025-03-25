<template>
  <header :class="{ 'navbar': true, 'transparent-nav': isTransparent }">
    <!-- Logo -->
    <router-link to="/" class="logo-link">
      <img src="/images/logo.png" alt="Logo" class="logo" />
    </router-link>

    <!-- Navigation Buttons -->
    <nav class="nav-buttons">
      <div class="show-on-desktop">
        <div class="search-container">
          <q-icon name="search" class="search-icon" />
          <q-input v-model="searchQuery" class="search-box" placeholder="Search..." dense standout />
        </div>
        <router-link to="/AboutUs" class="nav-link">About us</router-link>
        <router-link to="/OurPlans" class="nav-link">Plans</router-link>
        <router-link to="/ReportMissing" class="nav-link">Report</router-link>
        <router-link to="/SearchMissing" class="nav-link">Search</router-link>
        <router-link to="/SearchReports" class="nav-link">Reports</router-link>
        <router-link to="/donation" class="donate-btn">
          <q-icon name="monetization_on" /> Donate
        </router-link>
      </div>
    </nav>

    <!-- Icons -->
    <div class="icon-container">
      <NotificationComponent />

      <!-- Profile Dropdown -->
      <q-btn-dropdown v-if="user" flat round dense class="icon-btn">
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

      <!-- Sign In / Sign Up Dropdown -->
      <q-btn-dropdown v-else flat round dense class="icon-btn">
        <template v-slot:label>
          <q-icon name="person" size="32px" style="color: #2C3539;" />
        </template>
        <q-list>
          <q-item clickable v-close-popup @click="goToSignIn">
            <q-item-section>Sign In</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="goToSignUp">
            <q-item-section>Sign Up</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <!-- Burger Menu (Mobile) -->
      <div v-if="$q.screen.lt.md" class="burger-icon" @click="toggleMenu" :class="{ 'is-menu-open': isMenuOpen }">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <BurgerMenu ref="burgerMenu" @menuToggled="isMenuOpen = $event" />
    </div>
  </header>

  <main class="page-content"></main>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "src/boot/supabase";
import BurgerMenu from "./BurgerMenu.vue";
import NotificationComponent from "./NotificationComponent.vue";

export default {
  components: {
    BurgerMenu,
    NotificationComponent,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref("");
    const isTransparent = ref(false);
    const burgerMenu = ref(null);
    const isMenuOpen = ref(false);
    const user = ref(null);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const userAvatar = ref(defaultAvatar);

    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        user.value = userData.user;
        fetchUserAvatar(userData.user.id);
      }
    };

    const fetchUserAvatar = async (userId) => {
      const { data } = await supabase.from("users").select("profile_picture").eq("user_id", userId).single();
      userAvatar.value = data?.profile_picture || defaultAvatar;
    };

    const goToProfile = () => router.push("/ProfilePage");
    const goToSignIn = () => router.push("/SignIn");
    const goToSignUp = () => router.push("/SignUp");

    const handleLogout = async () => {
      await supabase.auth.signOut();
      user.value = null;
      userAvatar.value = defaultAvatar;
      router.push("/SignIn");
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
      burgerMenu.value?.toggleMenu();
    };

    const handleScroll = () => {
      isTransparent.value = ["/", "/SignIn", "/SignUp"].includes(route.path) && window.scrollY < window.innerHeight * 0.5;
    };

    onMounted(() => {
      fetchUser();
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      searchQuery,
      isTransparent,
      user,
      userAvatar,
      goToProfile,
      goToSignIn,
      goToSignUp,
      handleLogout,
      isMenuOpen,
      burgerMenu,
      toggleMenu,
    };
  },
};
</script>


<style lang="scss" scoped>
$link-color: #49596b;
$white: #f2f0e9;
$black: black;
$gray: rgb(90, 90, 90);

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
  transition: background 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
}

/* Push content down to avoid overlap */
.page-content {
  margin-top: 50px;
  padding: 20px;
}

.logo-link {
  display: flex;
  align-items: center;
  margin: 10px;
}

.logo {
  height: 50px;
  width: auto;
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
  color: #2c3539;
  text-decoration: none;
  font-weight: 800;
}

.donate-btn:hover {
  background-color: $white;
  color: $link-color;
}

.nav-link {
  color: #2c3539;
  text-decoration: none;
  font-weight: 800;
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
  background-color: #2C3539;
  border-radius: 3px;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.icon-container {
  display: flex; /* Ensures horizontal layout */
  align-items: center; /* Aligns items vertically */
  gap: 10px; /* Adds spacing between icons */
}


</style>
