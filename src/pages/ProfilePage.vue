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
            <p class="user-title">Back2Home {{ userPlan.plan_name === 'pro' ? 'Pro' : '' }} Member</p>
          </div>
          
          <!-- Profile Actions -->
          <div class="action-buttons">
            <q-btn unelevated rounded class="action-btn" :label="userPlan.plan_name.toUpperCase()" />
            <q-btn flat round color="dark"
            @click="router.push('/AccountSettings')"
            >
              <q-icon name="settings" />
            </q-btn>
            <q-btn flat round color="dark"
            @click="router.push('/Security')"
            >
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
            <h3>{{ userPlan.plan_name === 'pro' ? 'Pro Plan' : 'Free Plan' }}</h3>
            <q-btn 
              v-if="userPlan.plan_name === 'free'"
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
            <div class="feature-item" :class="{ disabled: userPlan.plan_name === 'free' }">
              <q-icon :name="userPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'" :color="userPlan.plan_name === 'pro' ? 'positive' : 'grey'" />
              <span>Advanced Analytics</span>
            </div>
            <div class="feature-item" :class="{ disabled: userPlan.plan_name === 'free' }">
              <q-icon :name="userPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'" :color="userPlan.plan_name === 'pro' ? 'positive' : 'grey'" />
              <span>Priority Support</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Management Section -->
      <div class="management-section">

        
        <div class="management-buttons">


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
    const userPlan = ref({
      plan_name: "free",
      plan_price: 0,
      plan_role: "free_user",
      plan_id: 1
    });

    const fetchUser = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          router.push("/SignIn");
          return;
        }

        // Get user data with plan information
        const { data, error } = await supabase
          .from("users")
          .select(`
            user_first_name,
            profile_picture,
            user_id,
            user_plan,
            plan:plan (
              plan_name,
              plan_price,
              plan_role
            )
          `)
          .eq("user_id", authUser.user.id)
          .single();

        if (error) throw error;

        userData.value = { first_name: data.user_first_name, user_id: data.user_id };
        userAvatar.value = data.profile_picture || userAvatar.value;
        
        // Set user's plan from the database
        if (data.plan) {
          userPlan.value = {
            plan_id: data.plan_id,
            plan_name: data.plan.plan_name,
            plan_price: data.plan.plan_price,
            plan_role: data.plan.plan_role
          };
        }
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
      userPlan,
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
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.plan-section h2 {
  font-size: 1.8em;
  margin-bottom: 25px;
  color: #2c3e50;
  font-weight: 700;
}

.plan-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  border: 2px solid #e0e0e0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.plan-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5em;
  font-weight: 700;
}

.upgrade-btn {
  background: linear-gradient(45deg, #00bfff, #0099ff);
  color: #fff;
  font-weight: 600;
  padding: 10px 25px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,191,255,0.3);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #2c3e50;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(0,0,0,0.02);
}

.feature-item.disabled {
  color: #999;
}

.feature-item i {
  font-size: 1.2em;
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

  .plan-section {
    padding: 20px;
    margin: 20px 0;
  }

  .plan-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .plan-card {
    padding: 20px;
  }

  .upgrade-btn {
    width: 100%;
  }
}
</style>
