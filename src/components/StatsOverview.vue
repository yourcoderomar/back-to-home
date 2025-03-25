<template>
  <section ref="sectionRef" class="stats-container">
    <div class="stats-box fade-in" :class="{ 'show': isVisible }">
      <p class="stats-number">{{ animatedLost.toFixed(0) }}</p>
      <p class="stats-label">People Lost</p>
    </div>

    <div class="stats-box fade-in delay" :class="{ 'show': isVisible }">
      <p class="stats-number">{{ animatedPercentage.toFixed(1) }}%</p>
      <p class="stats-label">Reunited (%)</p>
    </div>

    <div class="stats-box fade-in delay" :class="{ 'show': isVisible }">
      <p class="stats-number">{{ animatedFound.toFixed(0) }}</p>
      <p class="stats-label">People Found</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  lost: { type: Number, required: true },
  connectedPercentage: { type: Number, required: true },
  found: { type: Number, required: true }
});

const sectionRef = ref(null);
const isVisible = ref(false);
const hasAnimated = ref(false);
const animatedLost = ref(0);
const animatedPercentage = ref(0);
const animatedFound = ref(0);
const duration = 2500;

const animateNumbers = () => {
  const startTime = performance.now();

  const updateNumbers = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    animatedLost.value = progress * props.lost;
    animatedPercentage.value = progress * props.connectedPercentage;
    animatedFound.value = progress * props.found;

    if (progress < 1) {
      requestAnimationFrame(updateNumbers);
    }
  };

  requestAnimationFrame(updateNumbers);
};

onMounted(() => {
  const observer = new IntersectionObserver((entries, observerInstance) => {
    if (entries[0].isIntersecting && !hasAnimated.value) {
      isVisible.value = true;
      hasAnimated.value = true;
      animateNumbers();
      observerInstance.disconnect();
    }
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<style scoped>
.stats-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30vh;
  background-color: #f2f0e9;
  padding: 20px;
  gap: 15px;
}

.stats-box {
  text-align: center;
  flex: 1;
  color: #49596b;
}

.stats-number {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
  margin-bottom: 0px;
}

.stats-label {
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  font-weight: bold;
}

/* Reduce font size on mobile without changing layout */
@media (max-width: 768px) {
  .stats-number {
    font-size: 1.5rem;
  }

  .stats-label {
    font-size: 0.7rem;
  }
}

/* Fade-in Animation */
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
