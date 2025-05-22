<template>
  <q-page-container>
    <NavBar />
    <q-page class="q-pa-md">
      <div class="row q-col-gutter-xl items-center justify-center contact-main-row q-mt-lg q-mb-lg">
        <!-- Left: Heading -->
        <div class="col-12 col-md-5" data-aos="fade-right" data-aos-duration="1000">
          <h1 class="text-h3 text-h2-md text-bold">Contact Us</h1>
          <p class="text-body2 text-body1-md q-mb-lg">
            If you have questions or need any general information, please complete this form to
            request the information you need. It will be an honor to help you.
          </p>
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 col-sm-6" data-aos="fade-up" data-aos-delay="100">
              <div class="text-subtitle2 text-bold q-mb-xs">CONTACT US</div>
              <div class="text-body2">
                Back2Home<br />
                Cairo, Egypt<br />
                +20 123 456 7890
              </div>
            </div>
            <div class="col-12 col-sm-6" data-aos="fade-up" data-aos-delay="200">
              <div class="text-subtitle2 text-bold q-mb-xs">EMAIL SUPPORT</div>
              <div class="text-body2">
                support@back2home.com<br />
                info@back2home.com<br />
                Available 24/7
              </div>
            </div>
          </div>
        </div>
        <!-- Right: Feedback Form -->
        <div class="col-12 col-md-7" data-aos="fade-left" data-aos-duration="1000">
          <q-card class="q-pa-lg q-pa-xl-md contact-form-card">
            <q-card-section>
              <div class="text-h5 text-bold">Send us Feedback</div>
              <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                <q-input
                  v-model="form.title"
                  label="Feedback Title"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Title is required']"
                />
                <q-input
                  v-model="form.details"
                  label="Feedback Details"
                  type="textarea"
                  outlined
                  dense
                  rows="4"
                  :rules="[(val) => !!val || 'Details are required']"
                />
                <div class="row justify-end q-mt-md">
                  <q-btn label="Send" type="submit" color="primary" :loading="loading" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
    <FooterComponent />
    <ToastNotification ref="toast" />
  </q-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FooterComponent from 'src/components/Footer.vue'
import NavBar from 'src/components/NavBar.vue'
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'
import ToastNotification from 'components/ToastNotification.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()
const form = ref({
  title: '',
  details: '',
})
const loading = ref(false)
const userId = ref(null)
const toast = ref(null)

onMounted(async () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
  })

  // Get current user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    toast.value?.showToast('Please sign in to submit feedback', 'error')
    router.push('/SignIn')
    return
  }
  userId.value = user.id
})

const onSubmit = async () => {
  if (!userId.value) {
    toast.value?.showToast('Please sign in to submit feedback', 'error')
    router.push('/SignIn')
    return
  }

  loading.value = true
  try {
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          feedback_title: form.value.title,
          feedback_details: form.value.details,
          user_id: userId.value,
        },
      ])
      .select()

    if (error) {
      console.error('Error submitting feedback:', error)
      throw new Error(error.message || 'Failed to submit feedback')
    }

    // Show success message first
    toast.value?.showToast('Feedback sent successfully!', 'success')

    // Clear form fields after showing success message
    setTimeout(() => {
      form.value = { title: '', details: '' }
    }, 100)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    toast.value?.showToast(error.message || 'Failed to send feedback. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-main-row {
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.contact-form-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  width: 100%;
}

/* Mobile-first responsive styles */
@media (max-width: 600px) {
  .contact-main-row {
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
    min-height: auto;
    padding: 0 16px;
  }

  .contact-form-card {
    margin-top: 1rem;
  }
}

/* Tablet and desktop styles */
@media (min-width: 601px) {
  .text-h2-md {
    font-size: 2.5rem;
  }

  .text-body1-md {
    font-size: 1.1rem;
  }
}
</style>
