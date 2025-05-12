<template>
  <q-page-container class="cta-page">
    <NavBar />

    <div class="plans-container">
      <HeroSection title="My Plan" subtitle="" />

      <div class="current-plan q-mb-xl">
        <h2 class="section-title">Current Plan</h2>
        <div class="plan-card">
          <div class="plan-header">
            <h3>{{ currentPlan.plan_name === 'pro' ? 'Pro Plan' : 'Free Plan' }}</h3>
            <div class="plan-price" v-if="currentPlan.plan_price > 0">
              ${{ currentPlan.plan_price }}/month
            </div>
          </div>
          <div class="plan-features">
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" />
              <span>File Missing Person Reports</span>
            </div>
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" />
              <span>Basic Search Access</span>
            </div>
            <div class="feature-item" :class="{ disabled: currentPlan.plan_name === 'free' }">
              <q-icon
                :name="currentPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                :color="currentPlan.plan_name === 'pro' ? 'positive' : 'grey'"
              />
              <span>Advanced Search Filters</span>
            </div>
            <div class="feature-item" :class="{ disabled: currentPlan.plan_name === 'free' }">
              <q-icon
                :name="currentPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                :color="currentPlan.plan_name === 'pro' ? 'positive' : 'grey'"
              />
              <span>Priority Support (24/7)</span>
            </div>
            <div class="feature-item" :class="{ disabled: currentPlan.plan_name === 'free' }">
              <q-icon
                :name="currentPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                :color="currentPlan.plan_name === 'pro' ? 'positive' : 'grey'"
              />
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div class="available-plans">
        <h2 class="section-title">Available Plans</h2>
        <div class="row q-col-gutter-md">
          <div v-for="plan in availablePlans" :key="plan.plan_id" class="col-12 col-md-4">
            <div class="plan-card">
              <div class="plan-header">
                <h3>{{ plan.plan_name === 'pro' ? 'Pro Plan' : 'Free Plan' }}</h3>
                <div class="plan-price" v-if="plan.plan_price > 0">
                  ${{ plan.plan_price }}/month
                </div>
                <q-btn
                  v-if="
                    plan.plan_name !== currentPlan.plan_name &&
                    plan.plan_price > currentPlan.plan_price
                  "
                  unelevated
                  rounded
                  class="upgrade-btn"
                  label="Upgrade"
                  @click="upgradePlan(plan)"
                />
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <q-icon name="check_circle" color="positive" />
                  <span>File Missing Person Reports</span>
                </div>
                <div class="feature-item">
                  <q-icon name="check_circle" color="positive" />
                  <span>Basic Search Access</span>
                </div>
                <div class="feature-item" :class="{ disabled: plan.plan_name === 'free' }">
                  <q-icon
                    :name="plan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                    :color="plan.plan_name === 'pro' ? 'positive' : 'grey'"
                  />
                  <span>Advanced Search Filters</span>
                </div>
                <div class="feature-item" :class="{ disabled: plan.plan_name === 'free' }">
                  <q-icon
                    :name="plan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                    :color="plan.plan_name === 'pro' ? 'positive' : 'grey'"
                  />
                  <span>Priority Support (24/7)</span>
                </div>
                <div class="feature-item" :class="{ disabled: plan.plan_name === 'free' }">
                  <q-icon
                    :name="plan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                    :color="plan.plan_name === 'pro' ? 'positive' : 'grey'"
                  />
                  <span>Analytics Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="delete-subscription q-mt-xl">
      <q-btn
        v-if="currentPlan.plan_name === 'pro'"
        unelevated
        rounded
        class="delete-btn"
        label="Delete Subscription"
        @click="confirmDelete"
      />
    </div>

    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete your subscription? You will be moved to the free
            plan.</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="onCancelDelete" />
          <q-btn flat label="Delete" color="negative" v-close-popup @click="onConfirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <FooterComponent />
    <ToastNotification ref="toast" />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import ToastNotification from 'components/ToastNotification.vue'
import HeroSection from 'src/components/HeroSection.vue'

export default {
  name: 'MyPlan',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification,
    HeroSection,
  },
  setup() {
    const router = useRouter()
    const toast = ref(null)
    const currentPlan = ref({
      plan_name: 'free',
      plan_price: 0,
      plan_role: 'free_user',
      plan_id: 1,
    })

    const availablePlans = ref([])
    const showConfirmDialog = ref(false)

    const showToast = (message, type) => {
      if (toast.value) {
        toast.value.showToast(message, type)
      }
    }

    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plan')
          .select('*')
          .order('plan_price', { ascending: true })

        if (error) {
          console.error('Error fetching plans:', error)
          showToast('Failed to load plans. Please try again.', 'error')
          return
        }
        availablePlans.value = data
      } catch (error) {
        console.error('Error fetching plans:', error)
        showToast('Failed to load plans. Please try again.', 'error')
      }
    }

    const fetchUserPlan = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          router.push('/SignIn')
          return
        }

        // First get the user's plan_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_plan')
          .eq('user_id', user.id)
          .single()

        if (userError) {
          console.error('Error fetching user data:', userError)
          return
        }

        // Then get the plan details
        const { data: planData, error: planError } = await supabase
          .from('plan')
          .select('*')
          .eq('plan_id', userData.user_plan)
          .single()

        if (planError) {
          console.error('Error fetching plan data:', planError)
          return
        }

        if (planData) {
          currentPlan.value = {
            plan_id: planData.plan_id,
            plan_name: planData.plan_name,
            plan_price: planData.plan_price,
            plan_role: planData.plan_role,
          }
        }
      } catch (error) {
        console.error('Error fetching user plan:', error)
        showToast('Failed to load your plan. Please try again.', 'error')
      }
    }

    const upgradePlan = async (plan) => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) throw authError

        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_plan: plan.plan_id,
          })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error updating plan:', updateError)
          showToast('Failed to update plan. Please try again.', 'error')
          return
        }

        // Update local state
        currentPlan.value = plan

        // Show success message
        showToast('Plan updated successfully!', 'success')
      } catch (error) {
        console.error('Error updating plan:', error)
        showToast('Failed to update plan. Please try again.', 'error')
      }
    }

    const deleteSubscription = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) throw authError

        // Get the free plan ID
        const { data: freePlan, error: planError } = await supabase
          .from('plan')
          .select('plan_id')
          .eq('plan_name', 'free')
          .single()

        if (planError) {
          console.error('Error fetching free plan:', planError)
          return
        }

        // Update user to free plan
        const { error: updateError } = await supabase
          .from('users')
          .update({
            user_plan: freePlan.plan_id,
          })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Error deleting subscription:', updateError)
          showToast('Failed to delete subscription. Please try again.', 'error')
          return
        }

        // Update local state
        currentPlan.value = {
          plan_id: freePlan.plan_id,
          plan_name: 'free',
          plan_price: 0,
          plan_role: 'free_user',
        }

        // Show success message
        showToast('Subscription deleted successfully!', 'success')
      } catch (error) {
        console.error('Error deleting subscription:', error)
        showToast('Failed to delete subscription. Please try again.', 'error')
      }
    }

    const confirmDelete = () => {
      showConfirmDialog.value = true
    }

    const onConfirmDelete = () => {
      showConfirmDialog.value = false
      deleteSubscription()
    }

    const onCancelDelete = () => {
      showConfirmDialog.value = false
    }

    onMounted(async () => {
      await Promise.all([fetchPlans(), fetchUserPlan()])
    })

    return {
      currentPlan,
      availablePlans,
      upgradePlan,
      confirmDelete,
      toast,
      showConfirmDialog,
      onConfirmDelete,
      onCancelDelete,
    }
  },
}
</script>

<style scoped>
.cta-page {
  padding-bottom: 50px;
  background-color: #f2f0e9;
  min-height: 100vh;
}

.plans-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3539;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #00bfff;
  border-radius: 2px;
}

.plan-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #00bfff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.plan-card:hover::before {
  opacity: 1;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.plan-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: linear-gradient(45deg, #2c3e50, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upgrade-btn {
  background: linear-gradient(45deg, #00bfff, #0099cc);
  color: #fff;
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 30px;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
}

.upgrade-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 191, 255, 0.4);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex-grow: 1;
  padding: 10px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #2c3e50;
  font-size: 1.1em;
  font-weight: 500;
  padding: 10px 0;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

.feature-item.disabled {
  color: #999;
  opacity: 0.7;
}

.feature-item .q-icon {
  font-size: 1.4em;
  transition: all 0.3s ease;
  background: rgba(0, 191, 255, 0.1);
  padding: 8px;
  border-radius: 50%;
}

.feature-item:hover .q-icon {
  transform: scale(1.1) rotate(5deg);
  background: rgba(0, 191, 255, 0.2);
}

.current-plan {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.current-plan .plan-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.available-plans {
  width: 100%;
}

.available-plans .row {
  margin: 0 -15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.available-plans .col-12 {
  display: flex;
  justify-content: center;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .plans-container {
    padding: 30px 15px;
  }
}

@media (max-width: 992px) {
  .section-title {
    font-size: 2.2rem;
  }

  .plan-header h3 {
    font-size: 1.6em;
  }
}

@media (max-width: 768px) {
  .plans-container {
    gap: 30px;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .plan-card {
    padding: 25px;
  }

  .feature-item {
    font-size: 1em;
  }
}

@media (max-width: 600px) {
  .plans-container {
    padding: 20px 10px;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }

  .plan-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .upgrade-btn {
    width: 100%;
    padding: 10px 20px;
  }

  .plan-card {
    padding: 20px;
  }

  .feature-item {
    font-size: 0.95em;
    padding: 8px 0;
  }

  .feature-item .q-icon {
    font-size: 1.2em;
    padding: 6px;
  }

  .available-plans .row {
    margin: 0;
  }

  .available-plans .col-12 {
    padding: 0 10px;
  }

  .delete-btn {
    width: 100%;
    max-width: 400px;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.6rem;
  }

  .plan-header h3 {
    font-size: 1.4em;
  }

  .feature-item {
    font-size: 0.9em;
  }

  .upgrade-btn {
    font-size: 0.8em;
    padding: 8px 16px;
  }
}

.plan-price {
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
  background: linear-gradient(45deg, #2c3e50, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.delete-subscription {
  display: flex;
  justify-content: center;
  width: 100%;
}

.delete-btn {
  background: linear-gradient(45deg, #ff4444, #cc0000);
  color: #fff;
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 30px;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
}
</style>
