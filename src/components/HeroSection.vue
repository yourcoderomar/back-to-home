<template>
  <div class="hero-container" data-aos="fade-up" data-aos-duration="1200">
    <div class="hero-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <q-btn v-if="buttonText" color="primary" size="lg" :label="buttonText" :to="buttonLink" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ReusableHero",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: null
    },
    buttonLink: {
      type: String,
      default: "#"
    },
    backgroundGradient: {
      type: String,
      default: "linear-gradient(135deg, #2c2c2c, #121212)"
    }
  }
};
</script>

<style scoped>
.hero-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #2C3539;
  padding: 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
}

.hero-content h1 {
  font-size: 5vw; /* Responsive font size based on viewport width */
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero-content p {
  font-size: 2.5vw; /* Responsive font size */
  margin-bottom: 2rem;
  opacity: 0.8;
}

/* Media queries for better scaling */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 5vw;
  }
  
  .hero-content p {
    font-size: 2vw;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 6vw;
  }
  
  .hero-content p {
    font-size: 2.5vw;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 8vw;
  }
  
  .hero-content p {
    font-size: 3vw;
  }
}
</style>
