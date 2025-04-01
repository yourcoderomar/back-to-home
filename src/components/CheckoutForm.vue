<template>
  <div class="checkout-container q-pa-md">
    <HeroSection 
    title="Checkout"
    />
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
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="firstName"
                label="First Name *"
                outlined
                dense
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="lastName"
                label="Last Name *"
                outlined
                dense
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="companyName"
                label="Company Name"
                outlined
                dense
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="address"
                label="Street Address *"
                outlined
                dense
              />
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
              <q-input
                v-model="city"
                label="Town / City *"
                outlined
                dense
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="state"
                label="State / County"
                outlined
                dense
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="postcode"
                label="Postcode / ZIP *"
                outlined
                dense
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="email"
                label="Email Address *"
                outlined
                dense
                type="email"
              />
            </div>
            
            <div class="col-12 col-sm-6">
              <q-input
                v-model="phone"
                label="Phone *"
                outlined
                dense
                type="tel"
              />
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
              <q-option-group
                v-model="paymentMethod"
                :options="paymentOptions"
                type="radio"
              />
            </div>
            
            <div class="col-12 q-mt-lg">
              <q-checkbox
                v-model="termsAccepted"
                :label="type === 'donation' 
                  ? 'I confirm this is a voluntary donation and I have read the terms'
                  : 'I agree to the plan upgrade terms and conditions'"
              />
              
              <q-btn
                class="full-width q-mt-md"
                color="primary"
                :label="type === 'donation' ? 'COMPLETE DONATION' : 'UPGRADE PLAN'"
                :disable="!termsAccepted"
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
import HeroSection from './HeroSection.vue'

export default {
  name: 'CheckoutForm',
  components: {
    HeroSection
  },
  props: {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => ['donation', 'premium'].includes(value)
    }
  },
  setup(props) {
    
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
    
    const countries = ['United Kingdom', 'United States', 'Canada', 'Australia']
    
    const paymentOptions = [
      {
        label: [
          'Direct Bank Transfer',
          'Make your payment directly into our bank account.',
          'Please use your Order ID as the payment reference.',
          'Your order won\'t be shipped until the funds have cleared in our account.'
        ].join('\n'),
        value: 'bank'
      },
      {
        label: 'Cheque Payment',
        value: 'cheque'
      },
      {
        label: 'PayPal',
        value: 'paypal'
      }
    ]
    
    const handleCheckout = async () => {
      try {
        // Here you would implement the actual payment processing
        // For now, we'll just show a success message
        const orderData = {
          firstName: firstName.value,
          lastName: lastName.value,
          companyName: companyName.value,
          country: country.value,
          address: address.value,
          apartment: apartment.value,
          city: city.value,
          state: state.value,
          postcode: postcode.value,
          email: email.value,
          phone: phone.value,
          notes: notes.value,
          amount: props.amount,
          paymentMethod: paymentMethod.value,
          type: props.type
        }
        
        console.log('Order placed:', orderData)
        // You would typically send this to your backend
        
        // Show success message
        // Redirect to success page or dashboard
      } catch (error) {
        console.error('Checkout error:', error)
      }
    }
    
    return {
      firstName,
      lastName,
      companyName,
      country,
      countries,
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
      paymentOptions,
      handleCheckout
    }
  }
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.billing-info h2 {
  margin-bottom: 25px;
  color: #2C3539;
}

.cart-totals {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
}

.cart-totals h2 {
  margin-bottom: 25px;
  color: #2C3539;
}

.cart-totals h3 {
  margin: 20px 0 15px;
  color: #2C3539;
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