<template>
  <q-page-container class="donation-page">
    <NavBar />

    <div class="donation-container">
      <HeroSection
        title="Support Our Mission"
        subtitle="Your donation helps us reunite more families and find missing loved ones"
      />

      <div class="donation-form">
        <h2 class="section-title">Choose a donation amount</h2>

        <div class="amount-options">
          <div
            v-for="amount in donationAmounts"
            :key="amount.value"
            class="amount-option"
            :class="{ selected: selectedAmount === amount.value }"
            @click="selectedAmount = amount.value"
          >
            <div class="amount">EGP{{ amount.value }}</div>
            <div class="description">{{ amount.description }}</div>
          </div>

          <div class="custom-amount">
            <q-input
              v-model="customAmount"
              label="Enter custom amount"
              prefix="EGP"
              type="number"
              :rules="[(val) => val > 0 || 'Please enter a valid amount']"
              @update:model-value="selectedAmount = Number(customAmount)"
            />
          </div>
        </div>

        <h2 class="section-title q-mt-xl">Choose a donation frequency</h2>

        <div class="frequency-options">
          <q-btn-toggle
            v-model="frequency"
            spread
            no-caps
            rounded
            unelevated
            :options="[
              { label: 'Monthly', value: 'monthly' },
              { label: 'One time', value: 'one-time' },
            ]"
          />
        </div>

        <div class="donation-summary q-mt-lg">
          <p class="text-h6">
            You selected: EGP{{ selectedAmount }}
            {{ frequency === 'monthly' ? 'monthly' : 'one-time' }} donation
          </p>
        </div>

        <div class="action-buttons">
          <q-btn label="Cancel" flat color="grey" class="q-mr-md" @click="$router.go(-1)" />
          <q-btn
            label="Proceed to Checkout"
            color="primary"
            unelevated
            rounded
            :disable="!selectedAmount"
            @click="proceedToCheckout"
          />
        </div>
      </div>
    </div>

    <FooterComponent />
  </q-page-container>
</template>

<script>
import { ref } from 'vue'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import HeroSection from 'src/components/HeroSection.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'DonationPage',
  components: {
    NavBar,
    FooterComponent,
    HeroSection,
  },
  setup() {
    const selectedAmount = ref(10)
    const customAmount = ref('')
    const frequency = ref('monthly')
    const router = useRouter()

    const donationAmounts = [
      {
        value: 50,
        description: 'Help us maintain our search database and infrastructure',
      },
      {
        value: 100,
        description: 'Support our outreach programs and awareness campaigns',
      },
      {
        value: 200,
        description: 'Enable us to expand our search capabilities and reach',
      },
    ]

    const proceedToCheckout = () => {
      router.push({
        name: 'Checkout',
        query: {
          amount: selectedAmount.value,
          type: 'donation',
        },
      })
    }

    return {
      selectedAmount,
      customAmount,
      frequency,
      donationAmounts,
      proceedToCheckout,
    }
  },
}
</script>

<style scoped>
.donation-page {
  background-color: #f2f0e9;
  min-height: 100vh;
}

.donation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.donation-form {
  max-width: 800px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3539;
  margin-bottom: 30px;
  text-align: center;
}

.amount-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.amount-option {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.amount-option:hover {
  border-color: #00bfff;
  transform: translateY(-2px);
}

.amount-option.selected {
  border-color: #00bfff;
  background: rgba(0, 191, 255, 0.05);
}

.amount {
  font-size: 1.8em;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.description {
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
}

.custom-amount {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
}

.frequency-options {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.donation-summary {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 600px) {
  .donation-form {
    padding: 20px;
  }

  .amount-options {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .q-btn {
    width: 100%;
  }
}
</style>
