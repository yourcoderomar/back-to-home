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
          @learn-more="handleLearnMore(plan)"
        />
      </div>

      <!-- Call to Action Section -->
      <div class="cta-section">
        <h2 ref="ctaHeading">Not sure which plan is best for you?</h2>
        <p ref="ctaParagraph" style="opacity: 0;">Contact us and we'll help you choose the right plan!</p>
        <q-btn size="lg" label="Get in Touch" to="/contact" class="btn" />
      </div>

      <HeroSection title="FAQ" subtitle="" style="border-bottom: 0px;"/>
      <FAQ :faqs="faqData" class="q-mt-xl" style="margin-top: 0px;"/>
    </q-page-container>
    <FooterComponent />
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import NavBar from "../components/NavBar.vue";
import FooterComponent from "../components/Footer.vue";
import PlanCard from "../components/PlanCard.vue";
import HeroSection from "src/components/HeroSection.vue";
import FAQ from "src/components/FAQ.vue";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default {
  name: "OurPlans",
  components: {
    NavBar,
    FooterComponent,
    PlanCard,
    HeroSection,
    FAQ,
  },
  data() {
    return {
      plans: [
        {
          title: "Starter",
          price: 0,
          features: ["Basic Analytics", "Limited Access", "Community Support"],
        },
        {
          title: "Pro",
          price: 350,
          features: ["Advanced Analytics", "Priority Support", "Custom Reports"],
        },
      ],
      faqData: [
        {
          question: "What are the differences between the two plans?",
          answer:
            "The Basic plan offers limited searches and basic features, while the Premium plan provides unlimited searches, AI analysis, and real-time alerts.",
        },
        {
          question: "Can I switch between plans?",
          answer: "Yes! You can upgrade anytime from your account settings.",
        },
        {
          question: "How does the AI-powered search work?",
          answer:
            "Our AI compares uploaded images with database records to find potential matches faster.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Yes, we use encrypted storage and security protocols to keep your information safe.",
        },
      ],
    };
  },
  mounted() {
    gsap.fromTo(
      this.$refs.ctaHeading,
      { text: "" },
      {
        duration: 3,
        text: "Not sure which plan is best for you?",
        ease: "power3.out",
        scrollTrigger: {
          trigger: this.$refs.ctaHeading,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none"
        },
        onComplete: () => {
          gsap.to(this.$refs.ctaParagraph, { opacity: 1, duration: 1 });
        }
      }
    );
  },
  methods: {
    handleLearnMore(plan) {
      console.log("Learn more about:", plan);
    },
  },
};
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
  color: #6B7280;
  border-radius: 12px;
  position: relative;
  max-width: 800px;
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #2C3539;
  margin-bottom: 10px;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.8;
}
</style>
