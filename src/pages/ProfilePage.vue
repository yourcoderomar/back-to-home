<template>
  <q-page-container class="profile-container">
    <NavBar />
    <div class="profile-content">
      <!-- Back Button -->
      <q-btn flat round color="dark" icon="arrow_back" to="/" class="back-button" />
      
      <!-- User Profile Section -->
      <div class="profile-header">
        <div class="profile-info">
          <div class="name-section">
            <h1 class="user-name">{{ userData.first_name || 'Loading...' }}</h1>
            <p class="user-title">Back2Home Member</p>
          </div>
          
          <!-- Profile Actions -->
          <div class="action-buttons">
            <q-btn unelevated rounded class="action-btn" label="ACTIVE" />
            <q-btn flat round color="dark">
              <q-icon name="settings" />
            </q-btn>
            <q-btn flat round color="dark">
              <q-icon name="shield" />
            </q-btn>
          </div>
        </div>
        
        <!-- Profile Picture -->
        <div class="profile-picture">
          <ProfilePicture 
            :userId="userData.user_id" 
            :initialAvatar="userAvatar" 
            @updateAvatar="userAvatar = $event"
            class="avatar-image" 
          />
        </div>
      </div>

      <!-- Plan Section -->
      <div class="plan-section">
        <h2>Current Plan</h2>
        <div class="plan-card">
          <div class="plan-header">
            <h3>Free Plan</h3>
            <q-btn 
              unelevated 
              rounded 
              class="upgrade-btn" 
              label="Upgrade Plan" 
              @click="router.push('/MyPlan')"
            />
          </div>
          <div class="plan-features">
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" />
              <span>Basic Report Creation</span>
            </div>
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" />
              <span>Limited Search Access</span>
            </div>
            <div class="feature-item disabled">
              <q-icon name="cancel" color="grey" />
              <span>Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Management Section -->
      <div class="management-section">
        <div class="section-header">
          <h2>Profile Management</h2>
        </div>
        
        <div class="management-buttons">
          <q-btn 
            unelevated 
            rounded 
            class="management-btn" 
            @click="router.push('/AccountSettings')"
          >
            <q-icon name="edit" class="q-mr-sm" />
            Edit Profile
          </q-btn>

          <q-btn 
            unelevated 
            rounded 
            class="management-btn" 
            @click="router.push('/Security')"
          >
            <q-icon name="security" class="q-mr-sm" />
            Security Settings
          </q-btn>

          <q-btn 
            unelevated 
            rounded 
            class="management-btn logout-btn" 
            @click="logout"
          >
            <q-icon name="logout" class="q-mr-sm" />
            Logout
          </q-btn>
        </div>
      </div>
    </div>
    <FooterComponent />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "src/boot/supabase";
import ProfilePicture from "src/components/ProfilePicture.vue";
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/Footer.vue";

export default {
  components: { ProfilePicture, NavBar, FooterComponent },
  setup() {
    const router = useRouter();
    const userData = ref({});
    const userAvatar = ref("https://cdn-icons-png.flaticon.com/512/149/149071.png");

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

        if (error) throw error;

        userData.value = { first_name: data.user_first_name, user_id: data.user_id };
        userAvatar.value = data.profile_picture || userAvatar.value;
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/SignIn");
    };

    onMounted(fetchUser);

    return { 
      userData, 
      userAvatar,
      router,
      logout
    };
  }
};
</script>

<style scoped>
.profile-container {
  background-color: #f2f0e9;
  min-height: 100vh;
}

.profile-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 40px;
  margin-bottom: 40px;
}

.profile-info {
  flex: 1;
}

.user-name {
  font-size: 2.5em;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.user-title {
  color: #666;
  margin: 5px 0 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.action-btn {
  background: #00bfff;
  color: #fff;
  font-weight: 600;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  overflow: hidden;
  margin-left: 20px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plan-section {
  margin: 40px 0;
}

.plan-section h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #2c3e50;
}

.plan-card {
  background: #dad8d1;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plan-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.upgrade-btn {
  background: #00bfff;
  color: #fff;
  font-weight: 600;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
}

.feature-item.disabled {
  color: #999;
}

.management-section {
  margin: 40px 0;
}

.management-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.management-btn {
  width: 100%;
  padding: 15px;
  background: white;
  color: #2c3e50;
  font-weight: 500;
  justify-content: flex-start;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.management-btn:hover {
  background: #f8f9fa;
}

.logout-btn {
  color: #dc3545;
}

@media (max-width: 600px) {
  .profile-header {
    flex-direction: column-reverse;
    align-items: center;
    text-align: center;
  }

  .profile-picture {
    margin: 0 0 20px 0;
  }

  .action-buttons {
    justify-content: center;
  }

  .plan-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
