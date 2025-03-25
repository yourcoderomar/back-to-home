<template>
  <q-page-container style="background-color: #49596b;">
    <NavBar />
    
    <div class="q-pa-md plan-div" style="min-height: 300px; margin: 5vw;">
      <q-card class="card">
        <q-card-section>
          <h4 class="text-h4 text-white">My Plan</h4>
        </q-card-section>

        <q-card-section>
          <div class="current-plan q-mb-lg">
            <h5 class="text-h5 text-white q-mb-md">Current Plan</h5>
            <q-card class="plan-card">
              <q-card-section>
                <div class="text-h6">{{ currentPlan.name }}</div>
                <div class="text-subtitle2">{{ currentPlan.price }}</div>
                <div class="text-body2 q-mt-sm">{{ currentPlan.description }}</div>
                <div class="text-caption q-mt-sm">Next billing date: {{ currentPlan.nextBillingDate }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="available-plans">
            <h5 class="text-h5 text-white q-mb-md">Available Plans</h5>
            <div class="row q-col-gutter-md">
              <div v-for="plan in availablePlans" :key="plan.name" class="col-12 col-md-4">
                <q-card class="plan-card">
                  <q-card-section>
                    <div class="text-h6">{{ plan.name }}</div>
                    <div class="text-subtitle2">{{ plan.price }}</div>
                    <div class="text-body2 q-mt-sm">{{ plan.description }}</div>
                    <q-btn
                      :label="plan.name === currentPlan.name ? 'Current Plan' : 'Upgrade'"
                      :color="plan.name === currentPlan.name ? 'grey' : 'primary'"
                      class="q-mt-md full-width"
                      :disable="plan.name === currentPlan.name"
                      @click="upgradePlan(plan)"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <FooterComponent />
    <ToastNotification ref="toast" />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/boot/supabase';
import NavBar from 'src/components/NavBar.vue';
import FooterComponent from 'src/components/Footer.vue';
import ToastNotification from 'components/ToastNotification.vue';

export default {
  name: 'MyPlan',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification
  },
  setup() {
    const router = useRouter();
    const currentPlan = ref({
      name: 'Free Plan',
      price: '$0/month',
      description: 'Basic features for individual users',
      nextBillingDate: 'N/A'
    });

    const availablePlans = ref([
      {
        name: 'Free Plan',
        price: '$0/month',
        description: 'Basic features for individual users'
      },
      {
        name: 'Premium Plan',
        price: '$9.99/month',
        description: 'Advanced features with priority support'
      },
      {
        name: 'Enterprise Plan',
        price: '$29.99/month',
        description: 'Full access to all features and dedicated support'
      }
    ]);

    const fetchUserPlan = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/SignIn');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('subscription_plan, next_billing_date')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Update current plan based on user's subscription
        if (data.subscription_plan) {
          const plan = availablePlans.value.find(p => p.name === data.subscription_plan);
          if (plan) {
            currentPlan.value = {
              ...plan,
              nextBillingDate: data.next_billing_date || 'N/A'
            };
          }
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      }
    };

    const upgradePlan = async (plan) => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw authError;

        // Here you would typically integrate with a payment processor
        // For now, we'll just update the subscription in the database
        const { error } = await supabase
          .from('users')
          .update({
            subscription_plan: plan.name,
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          })
          .eq('user_id', user.id);

        if (error) throw error;

        currentPlan.value = {
          ...plan,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        this.$refs.toast.showToast('Plan upgraded successfully!', 'success');
      } catch (error) {
        console.error('Error upgrading plan:', error);
        this.$refs.toast.showToast('Failed to upgrade plan. Please try again.', 'error');
      }
    };

    onMounted(fetchUserPlan);

    return {
      currentPlan,
      availablePlans,
      upgradePlan
    };
  }
};
</script>

<style scoped>
.plan-div {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background-color: transparent;
  color: white;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: none;
}

.plan-card {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  height: 100%;
}

.text-h4, .text-h5 {
  margin-bottom: 20px;
}
</style> 