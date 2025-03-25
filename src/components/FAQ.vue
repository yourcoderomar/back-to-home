<template>
    <q-list bordered separator class="q-pa-md">
      <q-expansion-item
        v-for="(faq, index) in faqs"
        :key="index"
        expand-separator
        :label="faq.question"
        class="faq-item"
      >
        <q-card style="background-color: #0000001a;">
          <q-card-section>
            <p>{{ faq.answer }}</p>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </template>
  
  <script setup>
  defineProps({
    faqs: Array
  });
  </script>

<style scoped>
.faq-item {
color: #49596B;    
}


</style>
  