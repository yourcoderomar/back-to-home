<template>
    <div class="quotes-container">
      <div class="quote-box" v-for="(quoteData, index) in quotes" :key="index">
        <q-icon name="fa-solid fa-quote-left" size="xl" class="quote-icon" />
        <p class="quote-text">"{{ quoteData.text }}"</p>
        <p class="author-name">- {{ quoteData.author }}</p>
      </div>
    </div>
</template>
  
<script>
export default {
  props: {
    quotes: {
      type: Array,
      required: true
    }
  }
};
</script>
  
<style scoped>
.quotes-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #49596b;
}

.quote-box {
  max-width: 400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: transparent;
  width: 100%;
}

.quote-icon {
  color: gray;
  margin-bottom: 8px;
}

.quote-text {
  font-style: italic;
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #f2f0e9;
}

.author-name {
  font-weight: bold;
  font-size: 1rem;
  color: #f2f0e9;
}
</style>