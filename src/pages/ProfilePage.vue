<template>
  <q-page-container style="background-color: #49596b;">
    <NavBar />

    <div class=" q-pa-md Profile-div" style="min-height: 300px; margin: 5vw;">
      <q-card class="card text-center">

                <ProfilePicture 
          :userId="userData.user_id" 
          :initialAvatar="userAvatar" 
          @updateAvatar="userAvatar = $event" 
        />

        
        <!-- 🆕 Greeting Message -->
        <q-card-section>
          <h4 v-if="userData.first_name" class="greeting-text">
            Hello, {{ userData.first_name }} 👋
          </h4>
          <q-spinner v-else color="white" size="2em" />
        </q-card-section>


        <!-- 🆕 Styled Navigation List -->
        <q-card-section>
          <ul class="profile-menu">
            <li>
              <router-link to="/AccountSettings">
                <q-icon name="settings" class="menu-icon" /> Account Settings
              </router-link>
            </li>
            <li>
              <router-link to="/MyPlan">
                <q-icon name="list" class="menu-icon" /> My Plan
              </router-link>
            </li>
            <li>
              <router-link to="/Security">
                <q-icon name="shield" class="menu-icon" /> Security
              </router-link>
            </li>
            <li class="logout">
              <a href="#" @click.prevent="logout">
                <q-icon name="logout" class="menu-icon" /> Logout
              </a>
            </li>
          </ul>
        </q-card-section>

      </q-card>
    </div>

    <FooterComponent /> 
  </q-page-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "src/boot/supabase";
import NavBar from "src/components/NavBar.vue";
import ProfilePicture from "src/components/ProfilePicture.vue";
import FooterComponent from "src/components/Footer.vue";

export default {
  components: { NavBar, ProfilePicture, FooterComponent },
  setup() {
    const router = useRouter();
    const userData = ref({});
    const userAvatar = ref("https://cdn-icons-png.flaticon.com/512/149/149071.png");

    // ✅ Fetch user data
    const fetchUser = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          router.push("/SignIn");
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("user_first_name, profile_picture, user_id")
          .eq("user_id", authUser.user.id)
          .single();

        if (error) {
          console.error("Fetch Error:", error);
          return;
        }

        userData.value = { first_name: data.user_first_name };
        userAvatar.value = data.profile_picture || userAvatar.value;
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    // ✅ Logout function
    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/SignIn");
    };

    onMounted(fetchUser);

    return { userData, userAvatar, logout };
  },
};
</script>

<style scoped>
.card {
  background-color: transparent;
  color: white;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: none;
  
}

.greeting-text {
  margin-bottom: 0px;
}
.profile-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  margin: 20px auto;
}

.profile-menu li {
  padding: 12px 15px;
  border-radius: 8px;
  transition: background 0.3s;
}

.profile-menu li a {
  display: flex;
  align-items: center;
  color: white;
  font-size: 1.2em;
  text-decoration: none;
  font-weight: 500;
}

.profile-menu li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  margin-right: 10px;
  font-size: 1.4em;
}

.logout a {
  color: red;
}
</style>
