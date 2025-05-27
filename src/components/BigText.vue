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
        {{ char === ' ' ? '\u00A0' : char }}
      </span>
    </span>
    <p class="subtitle" :class="{ 'fully-visible': isFullyVisible }">
      Humanity Starts With <span class="bold-text">Back-To-Home</span>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: 'WE NEVER STOP CARING.',
      isFullyVisible: false, // Controls full-text appearance
      hoveredIndex: null, // Tracks hovered letter index
    }
  },
  computed: {
    splitText() {
      return this.text.split('') // Splits text into individual characters
    },
  },
  mounted() {
    setTimeout(
      () => {
        this.isFullyVisible = true
      },
      this.text.length * 100 + 500,
    )
  },
}
</script>

<style scoped>
/* Import a tall font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,100;0,400;1,400&display=swap');

/* Fullscreen text settings */
.fullscreen-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  color: #f2f0e9;
  font-family: 'Anton', sans-serif; /* Use a tall font */
  font-size: clamp(2rem, 14vw, 14vh); /* Responsive font size */
  font-weight: bold;
  text-align: center;
  line-height: 1; /* Prevent extra spacing */
  letter-spacing: -0.02em; /* Reduce spacing */
  overflow: hidden;
  padding-bottom: clamp(5vh, 30vw, 30vh); /* Responsive padding */
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
  transition:
    text-shadow 0.3s ease-in-out,
    transform 0.2s ease-in-out;
}

/* Stronger hover glow effect */
.char.glow-hover {
  text-shadow:
    0 0 30px rgba(44, 53, 57, 1),
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

.subtitle {
  font-size: clamp(1.5rem, 4vw, 4vh);
  margin-top: clamp(1rem, 2vw, 2vh);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-in-out;
  font-weight: 100;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  text-align: center;
  padding: 0 1rem;
  max-width: 90vw;
}

.subtitle.fully-visible {
  opacity: 1;
  transform: translateY(0);
}

.bold-text {
  font-weight: 700;
  color: #ffffff;
  display: inline-block;
}

/* ✅ Responsive Typography */
@media (max-width: 1200px) {
  .fullscreen-text {
    font-size: clamp(2rem, 13vw, 13vh);
    padding-bottom: clamp(4vh, 15vw, 15vh);
  }
  .subtitle {
    font-size: clamp(1.2rem, 3.5vw, 3.5vh);
  }
}

@media (max-width: 992px) {
  .fullscreen-text {
    font-size: clamp(1.8rem, 12vw, 12vh);
    padding-bottom: clamp(3vh, 12vw, 12vh);
  }
  .subtitle {
    font-size: clamp(1.1rem, 3vw, 3vh);
  }
}

@media (max-width: 768px) {
  .fullscreen-text {
    font-size: clamp(1.5rem, 8vw, 8vh);
    padding-bottom: clamp(2vh, 10vw, 10vh);
  }
  .subtitle {
    font-size: clamp(1rem, 2.5vw, 2.5vh);
    margin-top: 1.5vh;
  }
}

@media (max-width: 480px) {
  .fullscreen-text {
    font-size: clamp(1.2rem, 4vw, 4vh);
    padding-bottom: clamp(1vh, 5vw, 5vh);
  }
  .subtitle {
    font-size: clamp(0.9rem, 2vw, 2vh);
    margin-top: 1vh;
  }
}

/* Add support for very small screens */
@media (max-width: 320px) {
  .fullscreen-text {
    font-size: clamp(1rem, 3vw, 3vh);
    padding-bottom: clamp(0.8vh, 3vw, 3vh);
  }
  .subtitle {
    font-size: clamp(0.8rem, 1.8vw, 1.8vh);
    margin-top: 0.8vh;
  }
}
</style>
