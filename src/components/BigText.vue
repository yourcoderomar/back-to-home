<template>
  <div class="fullscreen-text">
    <span class="glow-text" :class="{ 'fully-visible': isFullyVisible }">
      <span 
        v-for="(char, index) in splitText" 
        :key="index" 
        class="char" 
        :class="{ 'glow-hover': hoveredIndex === index }"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @mouseenter="hoveredIndex = index" 
        @mouseleave="hoveredIndex = null"
      >
        {{ char === " " ? '\u00A0' : char }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "WE NEVER STOP CARING.",
      isFullyVisible: false, // Controls full-text appearance
      hoveredIndex: null, // Tracks hovered letter index
    };
  },
  computed: {
    splitText() {
      return this.text.split(""); // Splits text into individual characters
    }
  },
  mounted() {
    setTimeout(() => {
      this.isFullyVisible = true;
    }, this.text.length * 100 + 500); 
  }
};
</script>

<style scoped>
/* Import a tall font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

/* Fullscreen text settings */
.fullscreen-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  color: #f2f0e9;
  font-family: 'Anton', sans-serif; /* Use a tall font */
  font-size: 14vh; /* Maximum height */
  font-weight: bold;
  text-align: center;
  line-height: 1; /* Prevent extra spacing */
  letter-spacing: -0.02em; /* Reduce spacing */
  overflow: hidden;
  padding-bottom: 30vh; /* Moves text upwards */

}

/* Initial text appearance */
.glow-text {
  display: inline-block;
  opacity: 0.3;
  transition: opacity 0.8s ease-in-out;
  cursor: default;
}

/* Make full text appear after animations */
.glow-text.fully-visible {
  opacity: 1;
}

/* Letter animation */
.char {
  display: inline-block;
  opacity: 0;
  transform: scale(0.5);
  animation: popIn 0.4s forwards ease-out;
  transition: text-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
}

/* Stronger hover glow effect */
.char.glow-hover {
  text-shadow: 0 0 30px rgba(44, 53, 57, 1), 
               0 0 50px rgba(44, 53, 57, 0.9);
  transform: scale(1.3);
}

/* Smooth pop-in animation */
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}



/* ✅ Responsive Typography */
@media (max-width: 1200px) {
  .fullscreen-text {
    font-size: 13vh;
    padding-bottom: 15vh;
  }
}

@media (max-width: 992px) {
  .fullscreen-text {
    font-size: 12vh;
    padding-bottom: 12vh;
  }
}

@media (max-width: 768px) {
  .fullscreen-text {
    font-size: 8vh;
    padding-bottom: 10vh;
  }
}

@media (max-width: 480px) {
  .fullscreen-text {
    font-size: 4vh;
    padding-bottom: 5vh;
  }
}
</style>
