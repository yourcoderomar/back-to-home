<template>
  <q-page-container style="background-color: #f2f0e9;">
    <NavBar />
    
    <div class="q-pa-md settings-div" style="min-height: 300px; margin: 2rem auto;">
      <q-card class="card">
        <q-card-section class="header-section">
          <div class="row items-center q-gutter-md">
            <q-icon name="person" size="2em" color="#49596b" />
            <h4 class="text-h4 q-mb-none">Account Settings</h4>
          </div>
          <div class="text-subtitle1 q-mt-sm">Manage your account information</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="form-section">
              <h5 class="text-h5">Personal Information</h5>
              <div class="row items-center">
                <div class="col-8">
                  <q-input
                    v-model="formData.first_name"
                    label="First Name"
                    label-color="primary"
                    filled
                    :readonly="!isEditing"
                  />
                </div>
                <div class="col-4 flex justify-center">
                  <q-btn
                    flat
                    round
                    color="#49596b"
                    icon="edit"
                    @click="toggleEdit"
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col-8">
                  <q-input
                    v-model="formData.last_name"
                    label="Last Name"
                    label-color="primary"
                    filled
                    :readonly="!isEditing"
                  />
                </div>
                <div class="col-4 flex justify-center">
                  <q-btn
                    flat
                    round
                    color="#49596b"
                    icon="edit"
                    @click="toggleEdit"
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col-12">
                  <q-input
                    v-model="formData.email"
                    label="Email"
                    type="email"
                    label-color="primary"
                    filled
                    readonly
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col-8">
                  <q-input
                    v-model="formData.phone"
                    label="Phone"
                    label-color="primary"
                    filled
                    :readonly="!isEditing"
                  />
                </div>
                <div class="col-4 flex justify-center">
                  <q-btn
                    flat
                    round
                    color="#49596b"
                    icon="edit"
                    @click="toggleEdit"
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col-8">
                  <q-input
                    v-model="formData.national_id"
                    label="National ID"
                    label-color="primary"
                    filled
                    :readonly="!isEditing"
                  />
                </div>
                <div class="col-4 flex justify-center">
                  <q-btn
                    flat
                    round
                    color="#49596b"
                    icon="edit"
                    @click="toggleEdit"
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col-8">
                  <q-input
                    v-model="formData.dob"
                    label="Date of Birth"
                    type="date"
                    label-color="primary"
                    filled
                    :readonly="!isEditing"
                  />
                </div>
                <div class="col-4 flex justify-center">
                  <q-btn
                    flat
                    round
                    color="#49596b"
                    icon="edit"
                    @click="toggleEdit"
                  />
                </div>
              </div>

              <div class="row justify-end q-gutter-sm q-mt-lg">
                <q-btn 
                  v-if="isEditing"
                  label="Cancel" 
                  class="cancel q-px-lg"
                  @click="cancelEdit"
                />
                <q-btn 
                  v-if="isEditing"
                  label="Save Changes"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/boot/supabase';
import NavBar from 'src/components/NavBar.vue';
import FooterComponent from 'src/components/Footer.vue';
import ToastNotification from 'components/ToastNotification.vue';

export default {
  name: 'AccountSettings',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification
  },
  setup() {
    const router = useRouter();
    const isEditing = ref(false);
    const toast = ref(null);
    const formData = ref({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      national_id: '',
      dob: ''
    });

    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
    };

    const cancelEdit = () => {
      isEditing.value = false;
      // Reset form data to original values
      fetchUserData();
    };

    const handleClickOutside = (event) => {
      if (isEditing.value) {
        const form = document.querySelector('.form-section');
        if (form && !form.contains(event.target)) {
          cancelEdit();
        }
      }
    };

    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/SignIn');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('user_first_name, user_last_name, phone_number, user_national_id, user_dob')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        formData.value = {
          first_name: data.user_first_name || '',
          last_name: data.user_last_name || '',
          email: user.email || '',
          phone: data.phone_number || '',
          national_id: data.user_national_id || '',
          dob: data.user_dob || ''
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.value?.showToast('Failed to load user data', 'error');
      }
    };

    const onSubmit = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          toast.value?.showToast('Authentication error. Please sign in again.', 'error');
          router.push('/SignIn');
          return;
        }

        // Update user profile data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_first_name: formData.value.first_name,
            user_last_name: formData.value.last_name,
            phone_number: formData.value.phone,
            user_national_id: formData.value.national_id,
            user_dob: formData.value.dob
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        isEditing.value = false;
        toast.value?.showToast('Settings updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating settings:', error);
        toast.value?.showToast(error.message || 'Failed to update settings. Please try again.', 'error');
      }
    };

    onMounted(() => {
      fetchUserData();
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      formData,
      onSubmit,
      isEditing,
      toggleEdit,
      cancelEdit,
      toast
    };
  }
};
</script>

<style scoped>
.settings-div {
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
  position: relative;
  background-color: #f2f0e9;
  border-radius: 10px;
  padding: 20px;
  z-index: 1;
}

.text-h4, .text-h5 {
  margin-bottom: 20px;
  color: #49596b;
}

:deep(.q-field__label) {
  color: #49596b;
}

:deep(.q-field__native) {
  color: #49596b;
}

:deep(.q-field__control::before) {
  border-bottom: none !important;
}

:deep(.q-field--readonly .q-field__native) {
  color: #666;
}

.cancel {
  background-color: #ff4444;
  color: white;
  border-radius: 12px;
}
</style> 