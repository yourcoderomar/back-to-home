<template>
  <div>
    <NavBar />
    <q-page-container class="cta-page">
      <HeroSection title="Choose the Right Plan for You." subtitle="" />

      <div class="plans-container">
        <PlanCard
          v-for="(plan, index) in plans"
          :key="index"
          :title="plan.title"
          :price="plan.price"
          :features="plan.features"
          :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
          :showGetStarted="
            (plan.title.toLowerCase() === 'pro' && userPlan.plan_name !== 'pro') ||
            (plan.title.toLowerCase() === 'starter' && userPlan.plan_name === 'pro')
          "
          :isCurrentPlan="plan.title.toLowerCase() === userPlan.plan_name"
          :loading="loading"
          @learn-more="handleLearnMore(plan)"
        />
      </div>

      <!-- Call to Action Section -->
      <div class="cta-section">
        <h2 ref="ctaHeading">Not sure which plan is best for you?</h2>
        <p ref="ctaParagraph" style="opacity: 0">
          Contact us and we'll help you choose the right plan!
        </p>
        <q-btn size="lg" label="Get in Touch" to="/contact-us" class="btn" />
      </div>

      <HeroSection title="FAQ" subtitle="" style="border-bottom: 0px" />
      <FAQ :faqs="faqData" class="q-mt-xl" style="margin-top: 0px" />
    </q-page-container>
    <FooterComponent />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import NavBar from '../components/NavBar.vue'
import FooterComponent from '../components/Footer.vue'
import PlanCard from '../components/PlanCard.vue'
import HeroSection from 'src/components/HeroSection.vue'
import FAQ from 'src/components/FAQ.vue'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

export default {
  name: 'OurPlans',
  components: {
    NavBar,
    FooterComponent,
    PlanCard,
    HeroSection,
    FAQ,
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const userPlan = ref({
      plan_name: 'free',
      plan_price: 0,
      plan_role: 'free_user',
      plan_id: 1,
    })

    const plans = [
      {
        title: 'Starter',
        price: 0,
        features: ['Basic Analytics', 'Limited Access', 'Community Support', 'Limited Reports'],
      },
      {
        title: 'Pro',
        price: 400,
        features: [
          'Advanced Analytics',
          'Priority Support',
          'Community Support',
          'AI-powered search',
        ],
      },
    ]

    const faqData = [
      {
        question: 'What are the differences between the two plans?',
        answer:
          'The Basic plan offers limited searches and basic features, while the Premium plan provides unlimited searches, AI analysis, and real-time alerts.',
      },
      {
        question: 'Can I switch between plans?',
        answer: 'Yes! You can upgrade anytime from your account settings.',
      },
      {
        question: 'How does the AI-powered search work?',
        answer:
          'Our AI compares uploaded images with database records to find potential matches faster.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes, we use encrypted storage and security protocols to keep your information safe.',
      },
    ]

    const fetchUserPlan = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser?.user) {
          router.push('/SignIn')
          return
        }

        // Get user data with plan information
        const { data, error } = await supabase
          .from('users')
          .select(
            `
            user_plan,
            plan:plan (
              plan_name,
              plan_price,
              plan_role
            )
          `,
          )
          .eq('user_id', authUser.user.id)
          .single()

        if (error) throw error

        // Set user's plan from the database
        if (data.plan) {
          userPlan.value = {
            plan_id: data.user_plan,
            plan_name: data.plan.plan_name,
            plan_price: data.plan.plan_price,
            plan_role: data.plan.plan_role,
          }
        }
      } catch (err) {
        console.error('Error fetching user plan:', err)
      }
    }

    const handleLearnMore = async (plan) => {
      loading.value = true
      try {
        if (plan.price > 0) {
          router.push({
            name: 'Checkout',
            query: {
              amount: plan.price,
              type: 'premium',
            },
          })
        } else {
          // For free plan, redirect to profile if user is not already on free plan
          if (userPlan.value.plan_name !== 'free') {
            router.push('/ProfilePage')
          }
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await fetchUserPlan()

      // Create a timeline for better control
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        },
      })

      // Add animations to the timeline
      tl.fromTo(
        '.cta-section h2',
        { text: '' },
        {
          duration: 2,
          text: 'Not sure which plan is best for you?',
          ease: 'power3.out',
        },
      ).to(
        '.cta-section p',
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut',
        },
        '-=0.5', // Start slightly before the previous animation ends
      )
    })

    return {
      plans,
      faqData,
      userPlan,
      handleLearnMore,
      loading,
    }
  },
}
</script>

<style scoped>
.plans-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 60px;
  gap: 20px;
}

/* Call-to-Action Section */
.cta-page {
  padding-bottom: 50px;
  background-color: #f2f0e9;
}

.cta-section {
  text-align: center;
  margin: 50px auto;
  padding: 40px;
  color: #6b7280;
  border-radius: 12px;
  position: relative;
  max-width: 800px;
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3539;
  margin-bottom: 10px;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.8;
}
</style>
