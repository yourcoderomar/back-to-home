<template>
  <div class="card-container">
    <div class="card-content">
      <div class="card-header">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Features List -->
      <ul class="card-features" v-if="features.length">
        <li v-for="(feature, index) in features" :key="index" class="feature-item">
          ✔ {{ feature }}
        </li>
      </ul>

      <div class="card-price">
        <p>
          <span class="price">${{ price }}</span>
          <span class="price-period"> /mo </span>
        </p>
      </div>
    </div>

    <div class="card-footer">
      <button @click="learnMore" class="card-button">Get started</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanCard',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    features: {
      type: Array,
      required: true
    }
  },
  methods: {
    learnMore() {
      this.$emit('learn-more');
    }
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  background-color: #49596b;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeIn 0.5s ease;
  margin: 20px;
}

.card-container:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card-content {
  padding: 1.5rem 1.5rem 1rem;
  text-align: left;
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.875rem;
  font-weight: 500;
  color: #f2f0e9;
}

.card-subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #a0aec0;
}

/* Features List */
.card-features {
  margin-top: 1rem;
  padding-left: 1rem;
  list-style: none;
}

.feature-item {
  font-size: 0.95rem;
  color: #f2f0e9;
  margin-bottom: 0.5rem;
}

.card-price {
  margin-top: 1.5rem;
}

.price {
  font-size: 3rem;
  font-weight: 300;
  color: #f2f0e9;
}

.price-period {
  font-size: 1rem;
  font-weight: 500;
  color: #a0aec0;
}

.card-footer {
  padding: 1.5rem;
  text-align: center;
}

.card-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1.5rem;
  background-color: #f2f0e9;
  color: #49596b;
  border: 2px solid #f2f0e9;
  border-radius: 9999px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.card-button:hover {
  background-color: #49596B;
  color: #f2f0e9;
  border-color: #f2f0e9;
}
</style>
