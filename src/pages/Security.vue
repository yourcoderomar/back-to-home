<template>
  <q-page-container style="background-color: #f2f0e9;">
    <NavBar />
    
    <div class="q-pa-md security-div" style="min-height: 300px; margin: 2rem auto;">
      <q-card class="card">
        <q-card-section class="header-section">
          <div class="row items-center q-gutter-md">
            <q-icon name="security" size="2em" color="#49596b" />
            <h4 class="text-h4 q-mb-none">Security Settings</h4>
          </div>
          <div class="text-subtitle1 q-mt-sm">Manage your account security</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <div class="form-section">
              <h5 class="text-h5">Change Password</h5>
              
              <div class="col-12">
                <q-input
                  v-model="formData.currentPassword"
                  label="Current Password"
                  type="password"
                  :rules="[val => !!val || 'Current password is required']"
                  filled
                  bg-color="white"
                  label-color="primary"
                  lazy-rules="ondemand"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="formData.newPassword"
                  label="New Password"
                  type="password"
                  :rules="[
                    val => !!val || 'New password is required',
                    val => val.length >= 6 || 'Password must be at least 6 characters'
                  ]"
                  filled
                  bg-color="white"
                  label-color="primary"
                  lazy-rules="ondemand"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="formData.confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  :rules="[
                    val => !!val || 'Please confirm your new password',
                    val => val === formData.newPassword || 'Passwords do not match'
                  ]"
                  filled
                  bg-color="white"
                  label-color="primary"
                  lazy-rules="ondemand"
                />
              </div>

              <div class="row justify-end q-gutter-sm q-mt-lg">
                <q-btn 
                  label="Update Password"
                  type="submit"
                  class="submit q-px-lg"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <FooterComponent />
    <ToastNotification ref="toast" />
  </q-page-container>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/boot/supabase';
import NavBar from 'src/components/NavBar.vue';
import FooterComponent from 'src/components/Footer.vue';
import ToastNotification from 'components/ToastNotification.vue';

export default {
  name: 'SecuritySettings',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification
  },
  setup() {
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const formData = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const onSubmit = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw authError;

        // Check if new password is different from current password
        if (formData.value.currentPassword === formData.value.newPassword) {
          proxy.$refs.toast.showToast('New password must be different from current password', 'error');
          return;
        }

        // First verify the current password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: formData.value.currentPassword
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            proxy.$refs.toast.showToast('Current password is incorrect', 'error');
          } else {
            throw signInError;
          }
          return;
        }

        // Update password using Supabase Auth
        const { error: updateError } = await supabase.auth.updateUser({
          password: formData.value.newPassword
        });

        if (updateError) {
          if (updateError.message.includes('New password should be different from the old password')) {
            proxy.$refs.toast.showToast('New password must be different from current password', 'error');
          } else {
            throw updateError;
          }
          return;
        }

        // Clear form
        formData.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        proxy.$refs.toast.showToast('Password updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating password:', error);
        proxy.$refs.toast.showToast('Failed to update password. Please try again.', 'error');
      }
    };

    onMounted(async () => {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/SignIn');
      }
    });

    return {
      formData,
      onSubmit
    };
  }
};
</script>

<style scoped>
.security-div {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background-color: #f2f0e9;
  color: #49596b;
  border-radius: 15px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-section {
  border-bottom: 1px solid rgba(73, 89, 107, 0.1);
  padding-bottom: 20px;
}

.form-section {
  background-color: #f2f0e9;
  border-radius: 10px;
  padding: 20px;
}

.text-h4, .text-h5, .text-h6 {
  margin-bottom: 20px;
  color: #49596b;
}

:deep(.q-field__label) {
  color: #49596b;
}

:deep(.q-field__native) {
  color: #49596b;
}

.submit {
  background-color: #49596b;
  color: white;
}
</style> 