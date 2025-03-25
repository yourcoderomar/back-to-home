<template>
  <q-page-container class="flex flex-center">
    <q-card class="q-pa-lg shadow-2" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Complete Your Profile</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="nationalId" label="National ID" filled />
        <q-input v-model="firstName" label="First Name" filled />
        <q-input v-model="lastName" label="Last Name" filled />
        <q-input v-model="dob" label="Date of Birth" type="date" filled />
        <q-input v-model="phoneNumber" label="Phone Number" filled />
        <q-btn label="Save" color="primary" @click="saveProfile" class="full-width q-mt-md" />
      </q-card-section>
    </q-card>
  </q-page-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { insertUserData, getUserData } from "src/services/authService";

export default {
  setup() {
    const router = useRouter();
    const nationalId = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const dob = ref("");
    const phoneNumber = ref("");

    onMounted(async () => {
      const userData = await getUserData();
      if (userData) {
        // If user data already exists, redirect to home
        router.push("/");
      }
    });

    const saveProfile = async () => {
      await insertUserData({
        nationalId: nationalId.value,
        firstName: firstName.value,
        lastName: lastName.value,
        dob: dob.value,
        phoneNumber: phoneNumber.value,
      });

      // Redirect to home after saving
      router.push("/");
    };

    return { nationalId, firstName, lastName, dob, phoneNumber, saveProfile };
  },
};
</script>
