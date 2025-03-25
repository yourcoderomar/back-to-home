<template>
  <div>
    <!-- Loading Screen (Visible Until Page Loads) -->
    <div class="loading" v-if="isLoading">
      <svg width="64px" height="48px">
        <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
        <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
      </svg>
    </div>

    <!-- Main Content (Appears Only After Loading) -->
    <div v-if="!isLoading" class="animated-content">
      <slot></slot> <!-- Your page content goes here -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: Boolean,
    };
  },
  mounted() {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";

    // Hide loading animation when the page finishes loading
    const hideLoading = () => {
      this.isLoading = false;
      document.body.style.overflow = ""; // Re-enable scrolling
    };

    // Event listener for full page load
    window.addEventListener("load", hideLoading);

    // Fallback timeout (max wait time: 3 seconds)
    setTimeout(hideLoading, 3000);
  }
};
</script>

<style scoped>
/* LOADING SCREEN */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f0e99e;
  z-index: 9999;
}

.loading svg polyline {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loading svg polyline#back {
  stroke: #98a2af;
}

.loading svg polyline#front {
  stroke: #2C3539;
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: dash_682 1.4s linear infinite;
}

@keyframes dash_682 {
  72.5% {
    opacity: 0;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* ANIMATED CONTENT (Hidden Until Loading Completes) */
.animated-content {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
