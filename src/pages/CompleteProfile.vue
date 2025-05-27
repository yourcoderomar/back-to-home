<template>
  <q-page-container class="flex flex-center bg-grey-2" style="min-height: 100vh">
    <q-card class="q-pa-lg shadow-2" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary">Complete Your Profile</div>
        <div class="text-subtitle2 text-grey-7 q-mb-lg">
          Please fill in your details to continue
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input
          v-model="nationalId"
          label="National ID"
          filled
          class="q-mb-sm"
          :rules="[
            (val) => !!val || 'National ID is required',
            (val) => val.length === 14 || 'National ID must be exactly 14 digits',
            (val) => /^\d+$/.test(val) || 'National ID must contain only numbers',
          ]"
          maxlength="14"
        >
          <template v-slot:prepend>
            <q-icon name="badge" />
          </template>
        </q-input>

        <q-input
          v-model="firstName"
          label="First Name"
          filled
          class="q-mb-sm"
          :rules="[(val) => !!val || 'First name is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          v-model="lastName"
          label="Last Name"
          filled
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Last name is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          v-model="dob"
          label="Date of Birth"
          type="date"
          filled
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Date of birth is required']"
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input>

        <q-input
          v-model="phoneNumber"
          label="Phone Number"
          filled
          class="q-mb-sm"
          :rules="[(val) => !!val || 'Phone number is required']"
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>

        <q-btn
          label="Save Profile"
          color="primary"
          @click="saveProfile"
          class="full-width q-mt-lg"
          size="lg"
          :loading="loading"
        />
      </q-card-section>
    </q-card>
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { insertUserData, getUserData } from 'src/services/authService'

export default {
  setup() {
    const router = useRouter()
    const nationalId = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const dob = ref('')
    const phoneNumber = ref('')
    const loading = ref(false)

    onMounted(async () => {
      const userData = await getUserData()
      if (userData) {
        // If user data already exists, redirect to home
        router.push('/')
      }
    })

    const saveProfile = async () => {
      loading.value = true
      try {
        await insertUserData({
          nationalId: nationalId.value,
          firstName: firstName.value,
          lastName: lastName.value,
          dob: dob.value,
          phoneNumber: phoneNumber.value,
        })
        // Redirect to home after saving
        router.push('/')
      } catch (error) {
        console.error('Error saving profile:', error)
      } finally {
        loading.value = false
      }
    }

    return { nationalId, firstName, lastName, dob, phoneNumber, saveProfile, loading }
  },
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.q-input {
  transition: all 0.3s ease;
}

.q-input:hover {
  transform: translateY(-2px);
}
</style>
