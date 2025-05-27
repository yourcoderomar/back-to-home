<template>
  <div class="checkout-container q-pa-md">
    <HeroSection title="Checkout" />
    <ToastNotification ref="toastRef" />

    <!-- Thank You Dialog -->
    <q-dialog v-model="showThankYouDialog" persistent>
      <q-card class="thank-you-dialog">
        <q-card-section class="dialog-header text-center">
          <div class="text-h4 text-weight-bold text-primary">Thank You!</div>
          <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
        </q-card-section>

        <q-card-section class="dialog-content text-center">
          <div class="heart-container">
            <q-icon name="favorite" color="primary" size="5rem" class="animated-heart" />
            <div class="heart-glow"></div>
          </div>
          <p class="thank-you-message">
            Thank you for your generous donation!
            <span class="highlight">Your support helps us continue our mission.</span>
          </p>
        </q-card-section>

        <q-card-actions align="center" class="dialog-actions">
          <q-btn
            color="primary"
            label="Go to Home"
            @click="goToHome"
            v-close-popup
            class="home-button"
            unelevated
          >
            <template v-slot:prepend>
              <q-icon name="home" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row q-col-gutter-md">
      <!-- Left Side - Billing Info -->
      <div class="col-12 col-md-8">
        <div class="billing-info">
          <h2 class="text-h5">BILLING INFO</h2>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="country"
                :options="countries"
                label="Country *"
                outlined
                dense
                :rules="[(val) => !!val || 'Country is required']"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="firstName"
                label="First Name *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'First name is required',
                  (val) => val.length >= 2 || 'First name must be at least 2 characters',
                  (val) => /^[a-zA-Z\s]*$/.test(val) || 'First name can only contain letters',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="lastName"
                label="Last Name *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Last name is required',
                  (val) => val.length >= 2 || 'Last name must be at least 2 characters',
                  (val) => /^[a-zA-Z\s]*$/.test(val) || 'Last name can only contain letters',
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="companyName"
                label="Company Name"
                outlined
                dense
                :rules="[
                  (val) => !val || val.length >= 2 || 'Company name must be at least 2 characters',
                  (val) =>
                    !val ||
                    /^[a-zA-Z0-9\s]*$/.test(val) ||
                    'Company name can only contain letters, numbers and spaces',
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="address"
                label="Street Address *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Address is required',
                  (val) => val.length >= 5 || 'Address must be at least 5 characters',
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="apartment"
                label="Apartment, suite, unit etc. (optional)"
                outlined
                dense
                :rules="[
                  (val) => !val || val.length >= 2 || 'Apartment must be at least 2 characters',
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="city"
                label="Town / City *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'City is required',
                  (val) => val.length >= 2 || 'City must be at least 2 characters',
                  (val) => /^[a-zA-Z\s]*$/.test(val) || 'City can only contain letters',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="state"
                label="State / County"
                outlined
                dense
                :rules="[
                  (val) => !val || val.length >= 2 || 'State must be at least 2 characters',
                  (val) => !val || /^[a-zA-Z\s]*$/.test(val) || 'State can only contain letters',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="postcode"
                label="Postcode / ZIP *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Postcode is required',
                  (val) => /^\d{5}$/.test(val) || 'Postcode must be 5 digits',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="email"
                label="Email Address *"
                outlined
                dense
                type="email"
                :rules="[
                  (val) => !!val || 'Email is required',
                  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="phone"
                label="Phone *"
                outlined
                dense
                type="tel"
                :rules="[
                  (val) => !!val || 'Phone is required',
                  (val) =>
                    /^01[0125][0-9]{8}$/.test(val) || 'Please enter a valid Egyptian phone number',
                ]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Order Summary -->
      <div class="col-12 col-md-4">
        <div class="cart-totals bg-grey-2">
          <h2 class="text-h5">SUMMARY</h2>

          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <div class="row justify-between">
                <span>{{ type === 'donation' ? 'Donation Amount' : 'Plan Upgrade Amount' }}</span>
                <span>EGP {{ amount }}</span>
              </div>
              <div class="row justify-between">
                <span>Processing Fee</span>
                <span>Free</span>
              </div>
              <div class="row justify-between text-weight-bold q-mb-lg">
                <span>Total Amount</span>
                <span>EGP {{ amount }}</span>
              </div>
            </div>

            <div class="col-12">
              <h3 class="text-subtitle1">PAYMENT METHOD</h3>
              <q-option-group v-model="paymentMethod" :options="paymentOptions" type="radio" />
            </div>

            <div class="col-12 q-mt-lg">
              <q-checkbox
                v-model="termsAccepted"
                :label="
                  type === 'donation'
                    ? 'I confirm this is a voluntary donation and I have read the terms'
                    : 'I agree to the plan upgrade terms and conditions'
                "
              />

              <q-btn
                class="full-width q-mt-md"
                color="primary"
                :label="type === 'donation' ? 'COMPLETE DONATION' : 'UPGRADE PLAN'"
                :disable="!termsAccepted || isProcessing"
                :loading="isProcessing"
                @click="handleCheckout"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import HeroSection from './HeroSection.vue'
import ToastNotification from './ToastNotification.vue'

export default {
  name: 'CheckoutForm',
  components: {
    HeroSection,
    ToastNotification,
  },
  props: {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['donation', 'premium'].includes(value),
    },
  },
  setup(props) {
    const router = useRouter()
    const toastRef = ref(null)
    const showThankYouDialog = ref(false)

    const goToHome = () => {
      router.push('/')
    }

    const showToast = (message, type) => {
      if (toastRef.value) {
        toastRef.value.showToast(message, type)
      }
    }

    const firstName = ref('')
    const lastName = ref('')
    const companyName = ref('')
    const country = ref('Egypt')
    const address = ref('')
    const apartment = ref('')
    const city = ref('')
    const state = ref('')
    const postcode = ref('')
    const email = ref('')
    const phone = ref('')
    const termsAccepted = ref(false)
    const paymentMethod = ref('bank')
    const isProcessing = ref(false)

    const countries = ['Egypt', 'United Kingdom', 'United States', 'Canada', 'Australia']

    const paymentOptions = [
      {
        label: [
          'Direct Bank Transfer',
          'Make your payment directly into our bank account.',
          'Please use your Order ID as the payment reference.',
          "Your order won't be shipped until the funds have cleared in our account.",
        ].join('\n'),
        value: 'bank',
      },
      {
        label: 'Cheque Payment',
        value: 'cheque',
      },
      {
        label: 'PayPal',
        value: 'paypal',
      },
    ]

    const handleCheckout = async () => {
      if (!termsAccepted.value) {
        showToast('Please accept the terms and conditions', 'error')
        return
      }

      isProcessing.value = true

      try {
        // Get current user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError) {
          throw new Error('Authentication error: ' + authError.message)
        }
        if (!user) {
          throw new Error('User not authenticated')
        }

        // Create payment record
        const paymentData = {
          user_id: user.id,
          amount: props.amount,
          payment_type: props.type,
          payment_method: paymentMethod.value,
          status: 'pending',
          billing_info: {
            first_name: firstName.value,
            last_name: lastName.value,
            company: companyName.value,
            country: country.value,
            address: address.value,
            apartment: apartment.value,
            city: city.value,
            state: state.value,
            postcode: postcode.value,
            email: email.value,
            phone: phone.value,
          },
        }

        console.log('Creating payment with data:', paymentData)

        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert([paymentData])
          .select()
          .single()

        if (paymentError) {
          console.error('Payment creation error:', paymentError)
          throw new Error('Failed to create payment record: ' + paymentError.message)
        }

        if (!payment) {
          throw new Error('No payment record was created')
        }

        // Process payment based on selected method
        let paymentSuccess = false
        switch (paymentMethod.value) {
          case 'bank':
            // For bank transfer, we'll just mark it as pending
            paymentSuccess = true
            break
          case 'cheque':
            // For cheque, we'll just mark it as pending
            paymentSuccess = true
            break
          case 'paypal':
            // Here you would integrate with PayPal API
            // For now, we'll simulate a successful payment
            paymentSuccess = true
            break
        }

        if (paymentSuccess) {
          // Update payment status
          const { error: updateError } = await supabase
            .from('payments')
            .update({ status: 'completed' })
            .eq('id', payment.id)

          if (updateError) {
            console.error('Payment status update error:', updateError)
            throw new Error('Failed to update payment status: ' + updateError.message)
          }

          // If this is a plan upgrade, update the user's plan
          if (props.type === 'premium') {
            const { error: planError } = await supabase
              .from('users')
              .update({
                user_plan: 2, // Assuming 2 is the ID for pro plan
                plan_start_date: new Date().toISOString(),
              })
              .eq('user_id', user.id)

            if (planError) {
              console.error('Plan update error:', planError)
              throw new Error('Failed to update user plan: ' + planError.message)
            }

            showToast('Plan upgrade successful! Welcome to Pro!', 'success')
            // Redirect to profile page only for plan upgrades
            router.push('/ProfilePage')
          } else {
            // For donations, show the thank you dialog
            showThankYouDialog.value = true
          }
        }
      } catch (error) {
        console.error('Checkout error:', error)
        showToast(error.message || 'An error occurred during checkout. Please try again.', 'error')
      } finally {
        isProcessing.value = false
      }
    }

    return {
      firstName,
      lastName,
      companyName,
      country,
      address,
      apartment,
      city,
      state,
      postcode,
      email,
      phone,
      termsAccepted,
      paymentMethod,
      isProcessing,
      countries,
      paymentOptions,
      handleCheckout,
      toastRef,
      showThankYouDialog,
      goToHome,
    }
  },
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.billing-info {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.billing-info h2 {
  margin-bottom: 25px;
  color: #2c3539;
}

.cart-totals {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.cart-totals h2 {
  margin-bottom: 25px;
  color: #2c3539;
}

.cart-totals h3 {
  margin: 20px 0 15px;
  color: #2c3539;
}

.row.justify-between {
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.row.justify-between:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .checkout-container {
    margin: 20px auto;
    padding: 0 15px;
  }

  .billing-info,
  .cart-totals {
    padding: 20px;
  }
}

.thank-you-dialog {
  min-width: 350px;
  max-width: 500px;
  border-radius: 24px;
  overflow: hidden;
  animation: dialogFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dialog-header {
  background: white;
  padding: 24px;
  color: var(--q-primary);
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dialog-header .text-h4 {
  margin: 0;
  font-size: 2rem;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #666;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(90deg);
  color: var(--q-primary);
}

.dialog-content {
  padding: 32px 24px;
  position: relative;
}

.heart-container {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.animated-heart {
  animation: heartBeat 1.5s ease-in-out infinite;
  display: inline-block;
  filter: drop-shadow(0 0 8px rgba(var(--q-primary-rgb), 0.3));
}

.heart-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(var(--q-primary-rgb), 0.2) 0%, transparent 70%);
  animation: glowPulse 2s ease-in-out infinite;
  border-radius: 50%;
}

.thank-you-message {
  font-size: 1.2rem;
  color: #2c3539;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 400px;
  animation: messageFadeIn 0.5s ease-out 0.3s both;
}

.highlight {
  color: var(--q-primary);
  font-weight: 500;
}

.home-button {
  min-width: 180px;
  font-weight: 500;
  font-size: 1.1rem;
  border-radius: 12px;
  padding: 12px 24px;
  transition: all 0.3s ease;
  background: var(--q-primary);
  color: white;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.3);
}

.home-button:active {
  transform: translateY(0);
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.2);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
}

@keyframes glowPulse {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes messageFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-actions {
  padding: 24px;
  background: rgba(0, 0, 0, 0.02);
}

/* Add CSS variable for primary color RGB values */
:root {
  --q-primary-rgb: 25, 118, 210; /* Replace with your primary color RGB values */
}
</style>
