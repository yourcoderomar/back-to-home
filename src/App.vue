<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from './components/LoadingScreen.vue';

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000); // Adjust as needed
});
</script>

<template>
  <q-layout>
    <!-- Show loading spinner while loading -->
    <LoadingSpinner v-if="isLoading" />

    <!-- Show app content only after loading -->
    <div v-if="!isLoading" class="app-content">
      <router-view />
    </div>
  </q-layout>
</template>

<style scoped>
/* Prevent animations before loading finishes */
.app-content {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

/* Apply animations after loading */
.app-content:not([v-cloak]) {
  opacity: 1;
}
</style>
