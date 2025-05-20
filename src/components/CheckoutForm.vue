<template>
  <div class="checkout-container q-pa-md">
    <HeroSection title="Checkout" />
    <ToastNotification ref="toastRef" />
    <div class="row q-col-gutter-md">
      <!-- Left Side - Billing Info -->
      <div class="col-12 col-md-8">
        <div class="billing-info">
          <h2 class="text-h5">BILLING INFO</h2>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select v-model="country" :options="countries" label="Country *" outlined dense />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="firstName" label="First Name *" outlined dense />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="lastName" label="Last Name *" outlined dense />
            </div>

            <div class="col-12">
              <q-input v-model="companyName" label="Company Name" outlined dense />
            </div>

            <div class="col-12">
              <q-input v-model="address" label="Street Address *" outlined dense />
            </div>

            <div class="col-12">
              <q-input
                v-model="apartment"
                label="Apartment, suite, unit etc. (optional)"
                outlined
                dense
              />
            </div>

            <div class="col-12">
              <q-input v-model="city" label="Town / City *" outlined dense />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="state" label="State / County" outlined dense />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="postcode" label="Postcode / ZIP *" outlined dense />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="email" label="Email Address *" outlined dense type="email" />
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="phone" label="Phone *" outlined dense type="tel" />
            </div>

            <div class="col-12">
              <q-input
                v-model="notes"
                label="Order Notes"
                type="textarea"
                outlined
                dense
                hint="Notes about your order, e.g. special notes for delivery."
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
                <span>${{ amount }}</span>
              </div>
              <div class="row justify-between">
                <span>Processing Fee</span>
                <span>Free</span>
              </div>
              <div class="row justify-between text-weight-bold q-mb-lg">
                <span>Total Amount</span>
                <span>${{ amount }}</span>
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

    const showToast = (message, type) => {
      if (toastRef.value) {
        toastRef.value.showToast(message, type)
      }
    }

    const firstName = ref('')
    const lastName = ref('')
    const companyName = ref('')
    const country = ref('United Kingdom')
    const address = ref('')
    const apartment = ref('')
    const city = ref('')
    const state = ref('')
    const postcode = ref('')
    const email = ref('')
    const phone = ref('')
    const notes = ref('')
    const termsAccepted = ref(false)
    const paymentMethod = ref('bank')
    const isProcessing = ref(false)

    const countries = ['United Kingdom', 'United States', 'Canada', 'Australia']

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
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
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
                notes: notes.value,
              },
            },
          ])
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
          }

          showToast(
            props.type === 'premium'
              ? 'Plan upgrade successful! Welcome to Pro!'
              : 'Thank you for your donation!',
            'success',
          )

          // Redirect to profile page
          router.push('/ProfilePage')
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
      notes,
      termsAccepted,
      paymentMethod,
      isProcessing,
      countries,
      paymentOptions,
      handleCheckout,
      toastRef,
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
</style>
