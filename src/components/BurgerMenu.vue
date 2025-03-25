<template>
  <div class="burger-menu-container" :class="{ 'is-visible': isVisible }">
    <ul class="burger-menu">
      <li>
        <div class="search-container">
          <q-input v-model="searchQuery" class="search-box" placeholder="Search..." dense standout>
            <template v-slot:prepend>
              <q-icon name="search" class="search-icon" />
            </template>
          </q-input>
        </div>
      </li>
      <ul class="burger-menu">
        <li><router-link to="/ReportMissing">Report a Missing Person</router-link></li>
        <li><router-link to="/SearchMissing">Search for a Missing Person</router-link></li>
        <li><router-link to="/SearchMissing">Search for a Missing Person</router-link></li>

        <li>
          <router-link to="/donation">Donate</router-link></li>
        <li><router-link to="/OurPlans">Our Plans</router-link></li>
        <li><router-link to="/AboutUs">About Us</router-link></li>
        <li><router-link to="/Contact">Contact Us</router-link></li>
      </ul>

    </ul>
  </div>
</template>

<script>
export default {
  name: "BurgerMenu",
  data() {
    return {
      isVisible: false,
      searchQuery: "",
    };
  },
  methods: {
    toggleMenu() {
      this.isVisible = !this.isVisible;
    },
  },
  
};
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




</style>
