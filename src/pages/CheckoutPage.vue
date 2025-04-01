<template>
  <q-page-container>
    <Navbar />
    <div v-if="!loading">
      <CheckoutForm
        :amount="amount"
        :type="type"
      />
    </div>
    <div v-else class="flex flex-center">
      <q-spinner-dots size="40px" color="primary" />
    </div>
    <FooterComponent />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CheckoutForm from 'components/CheckoutForm.vue'
import Navbar from 'components/NavBar.vue'
import FooterComponent from 'components/Footer.vue'

export default {
  name: 'CheckoutPage',
  components: {
    CheckoutForm,
    Navbar,
    FooterComponent,
  },
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const amount = ref(0)
    const type = ref('')

    onMounted(() => {
      // Get amount and type from route query parameters
      amount.value = Number(route.query.amount) || 0
      type.value = route.query.type || 'donation'
      loading.value = false
    })

    return {
      loading,
      amount,
      type
    }
  }
}
</script> 