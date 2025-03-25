<template>
  <section ref="sectionRef" class="lost-people-section q-pa-lg row items-center">
    <!-- Left: Image with AOS animation -->
    <div class="col-md-6 col-12 flex flex-center">
      <q-img src="images/search.jpg" class="image-style" data-aos="fade-right" data-aos-duration="1000" />
    </div>

    <!-- Right: Text & Number -->
    <div class="col-md-6 col-12 text-container">
      <div class="text-h5 text-bold fade-in" :class="{ 'show': isVisible }">
        Every day, approximately
        <span class="text-primary">{{ animatedNumber.toFixed(0) }}</span>
        people go missing in Egypt.
      </div>
      <p class="fade-in delay" :class="{ 'show': isVisible }">
        Many of these cases involve children, elderly individuals, and those suffering from memory disorders. Raising awareness and community efforts can help reunite families.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

const animatedNumber = ref(0);
const targetNumber = ref(50); // Adjust the number based on research
const duration = 4000; // 2 seconds animation
const isVisible = ref(false);
const sectionRef = ref(null);

const startAnimation = () => {
  const startTime = performance.now();
  const initialNumber = animatedNumber.value;

  const updateNumber = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration;
      animatedNumber.value = initialNumber + (targetNumber.value - initialNumber) * progress;
      requestAnimationFrame(updateNumber);
    } else {
      animatedNumber.value = targetNumber.value;
    }
  };

  requestAnimationFrame(updateNumber);
};

// Trigger animation and fade-in effect when section becomes visible
onMounted(() => {
  AOS.init();

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      startAnimation();
    }
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
.lost-people-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 300px;
}

.image-style {
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Text Fade-in Animation */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease-out, transform 1s ease-out;
}

.fade-in.show {
  opacity: 1;
  transform: translateY(0);
}

.delay {
  transition-delay: 0.3s;
}
</style>
