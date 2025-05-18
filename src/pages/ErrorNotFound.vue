<template>
  <div
    class="fullscreen text-white text-center q-pa-md flex flex-center"
    style="background: #49596b"
  >
    <div class="error-container">
      <div class="error-icon">
        <q-icon name="home" size="15rem" color="#00bfff" />
      </div>

      <div class="text-h2 q-mt-lg" style="opacity: 0.8">Page Not Found</div>

      <div class="text-h5 q-mt-md" style="opacity: 0.6">
        Looks like you've wandered away from home
      </div>

      <q-btn
        class="q-mt-xl"
        style="background: #ffffff; color: #49596b"
        unelevated
        to="/"
        label="Back to Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
//
</script>

<style scoped>
.error-container {
  max-width: 600px;
  margin: 0 auto;
}

.error-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
