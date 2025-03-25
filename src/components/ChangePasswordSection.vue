<template>
    <div>
      <!-- Button to open modal -->
      <q-btn class="submit" label="Change Password" @click="showModal = true" />
  
      <!-- Modal Dialog -->
      <q-dialog v-model="showModal">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Change Password</div>
          </q-card-section>
  
          <q-card-section>
            <q-input v-model="oldPasswordLocal" type="password" label="Old Password" filled />
            <q-input v-model="newPasswordLocal" type="password" label="New Password" filled />
            <q-input v-model="confirmPasswordLocal" type="password" label="Confirm Password" filled />
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="negative" @click="showModal = false" />
            <q-btn color="primary" label="Change Password" @click="changePassword" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { supabase } from "src/boot/supabase";
  
  export default {
    setup() {
      const showModal = ref(false);
      const oldPasswordLocal = ref("");
      const newPasswordLocal = ref("");
      const confirmPasswordLocal = ref("");
  
      const changePassword = async () => {
        if (newPasswordLocal.value !== confirmPasswordLocal.value) {
          alert("New password and confirmation do not match.");
          return;
        }
  
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPasswordLocal.value,
          });
  
          if (error) throw error;
  
          alert("Password updated successfully!");
          oldPasswordLocal.value = "";
          newPasswordLocal.value = "";
          confirmPasswordLocal.value = "";
          showModal.value = false; // Close modal after success
        } catch (error) {
          console.error("Password update error:", error);
          alert("Failed to update password.");
        }
      };
  
      return {
        showModal,
        oldPasswordLocal,
        newPasswordLocal,
        confirmPasswordLocal,
        changePassword,
      };
    },
  };
  </script>
  
  <style scoped>
  .q-card {
    width: 400px;
  }
  </style>
  