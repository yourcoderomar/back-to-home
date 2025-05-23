<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'

// Lazy load the loading spinner component
const LoadingSpinner = defineAsyncComponent(() => import('./components/LoadingScreen.vue'))

const isLoading = ref(true)

onMounted(() => {
  // Use requestAnimationFrame for smoother loading
  requestAnimationFrame(() => {
    // Reduce loading time to 1.5 seconds
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  })
})
</script>

<template>
  <q-layout>
    <Suspense>
      <!-- Show loading spinner while loading -->
      <template #default>
        <LoadingSpinner v-if="isLoading" />
      </template>

      <!-- Show app content only after loading -->
      <template #fallback>
        <div class="loading-placeholder">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </Suspense>

    <div v-show="!isLoading" class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </q-layout>
</template>

<style scoped>
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.app-content {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.app-content:not([v-cloak]) {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
