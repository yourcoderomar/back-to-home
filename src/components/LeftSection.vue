<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  imageSrc: String,
  altText: { type: String, default: "Image" },
  imageRight: { type: Boolean, default: false }, // Default: Image on left
  aosText: { type: String, default: "fade-right" }, 
  aosImage: { type: String, default: "fade-left" }, 
  aosDuration: { type: Number, default: 1500 }
});
</script>

<template>
  <div class="container">
    <div class="content" :class="{ 'reverse': imageRight }">
      <!-- Text Section -->
      <div class="text" :data-aos="aosText" :data-aos-duration="aosDuration">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>

      <!-- Image Section -->
      <div class="image" :data-aos="aosImage" :data-aos-duration="aosDuration">
        <img :src="imageSrc" :alt="altText" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container Styling */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 20px;
}

/* Content Box */
.content {
  display: flex;
  flex-direction: row;
  background: #49596b;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
}

/* Reverse Layout if imageRight is true */
.reverse {
  flex-direction: row-reverse;
}

/* Text Section */
.text {
  width: 50%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  margin-top: 0px;
}

.text h2 {
  font-size: 32px;
  font-weight: 800;
  color: #f2f0e9;
  margin-bottom: 10px;
}

.text p {
  font-size: 16px;
  color: #f2f0e9;
  line-height: 1.5;
}

/* Image Section */
.image {
  width: 50%;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .image,
  .text {
    width: 100%;
  }

  .image img {
    height: 250px;
  }
}
</style>
