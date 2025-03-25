<template>
  <q-page class="flex flex-center column">
    <!-- 🖼️ Image Carousel -->
    <div class="carousel-wrapper">
      <div class="carousel-track">
        <div v-for="(image, index) in loopedImages" :key="index" class="carousel-item">
          <img :src="image" alt="Slide Image" class="carousel-image" />
        </div>
      </div>
    </div>

    <!-- 📝 Paragraph + Button -->
    <div class="text-container">
      <p class="carousel-text">If you saw someone please provide a tip!</p>
      <q-btn class="submit" label="Provide a tip" />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "/images/missing3.jpg",
        "/images/missing3.jpg",
        "/images/missing3.jpg",
        "/images/missing3.jpg",
        "/images/missing3.jpg",
      ],
    };
  },
  computed: {
    loopedImages() {
      return [...this.images, ...this.images]; // Duplicate images for seamless looping
    },
  },
};
</script>

<style scoped>
/* 🌟 Carousel Container */
.carousel-wrapper {
  width: 100vw;
  height: 40vh; /* Increased height */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 🔄 Scrolling Track */
.carousel-track {
  display: flex;
  width: 200%;
  animation: scroll-desktop 20s linear infinite;
  gap: 1rem;
}

/* 📸 Image Containers */
.carousel-item {
  flex: 1 0 calc(25% - 1rem); /* Larger images on desktop */
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  max-height: 500px; /* Increased max height */
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

/* 📜 Text & Button Section */
.text-container {
  text-align: center;
  margin: 1.2rem;
}

.carousel-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.8rem;
}


/* 🖥️ Default Animation */
@keyframes scroll-desktop {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 📱 Mobile: Show 1-2 images & Increase Speed */
@media (max-width: 900px) {
  .carousel-track {
    animation: scroll-mobile 10s linear infinite;
  }
  .carousel-item {
    flex: 1 0 calc(50% - 1rem);
  }
}

@media (max-width: 600px) {
  .carousel-track {
    animation: scroll-mobile 6s linear infinite;
  }
  .carousel-item {
    flex: 1 0 calc(100% - 1rem);
  }

  /* Adjusted spacing for smaller screens */
  .text-container {
    margin-top: 1.5rem;
  }

  .carousel-image {
    max-height: 250px; /* Smaller image size for mobile */
  }
}

/* 📱 Faster Scrolling Animation */
@keyframes scroll-mobile {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
