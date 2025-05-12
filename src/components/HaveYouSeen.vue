<template>
  <q-page class="flex flex-center column">
    <!-- 🖼️ Image Carousel -->
    <div class="carousel-wrapper">
      <div v-if="loading" class="loading-state">
        <q-spinner color="primary" size="3em" />
        <p>Loading images...</p>
      </div>
      <div v-else-if="images.length === 0" class="no-images">
        <p>No images available</p>
      </div>
      <div v-else class="carousel-container">
        <div class="carousel-track">
          <!-- First set of images -->
          <div v-for="(image, index) in images" :key="'first-' + index" class="carousel-item">
            <img
              :src="image"
              alt="Missing Person"
              class="carousel-image"
              @error="handleImageError"
            />
          </div>
          <!-- Duplicate set of images for seamless loop -->
          <div v-for="(image, index) in images" :key="'second-' + index" class="carousel-item">
            <img
              :src="image"
              alt="Missing Person"
              class="carousel-image"
              @error="handleImageError"
            />
          </div>
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
import { ref, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'

export default {
  setup() {
    const images = ref([])
    const loading = ref(true)
    const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

    const fetchImages = async () => {
      try {
        console.log('Starting to fetch images...')
        const { data: files, error } = await supabase.storage.from('missingimages').list()

        if (error) {
          console.error('Error fetching images:', error)
          return
        }

        console.log('Files found:', files)

        if (!files || files.length === 0) {
          console.log('No files found in the bucket')
          return
        }

        const imageUrls = await Promise.all(
          files
            .filter((file) => !file.name.startsWith('.'))
            .map(async (file) => {
              const {
                data: { publicUrl },
              } = supabase.storage.from('missingimages').getPublicUrl(file.name)
              console.log('Generated URL for:', file.name, publicUrl)
              return publicUrl
            }),
        )

        console.log('All image URLs:', imageUrls)
        images.value = imageUrls
      } catch (error) {
        console.error('Error in fetchImages:', error)
      } finally {
        loading.value = false
      }
    }

    const handleImageError = (event) => {
      console.error('Image failed to load:', event.target.src)
      event.target.src = defaultImage
    }

    onMounted(() => {
      console.log('Component mounted, fetching images...')
      fetchImages()
    })

    return {
      images,
      loading,
      handleImageError,
    }
  },
}
</script>

<style scoped>
/* 🌟 Carousel Container */
.carousel-wrapper {
  width: 100vw;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.loading-state,
.no-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #666;
}

/* 🔄 Scrolling Track */
.carousel-track {
  display: flex;
  animation: scroll 30s linear infinite;
  gap: 1rem;
  padding: 0 1rem;
}

/* 📸 Image Containers */
.carousel-item {
  flex: 0 0 auto;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
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

/* 🖥️ Animation */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 📱 Mobile: Show 1-2 images & Increase Speed */
@media (max-width: 900px) {
  .carousel-item {
    width: 250px;
    height: 250px;
  }
  .carousel-track {
    animation: scroll 20s linear infinite;
  }
}

@media (max-width: 600px) {
  .carousel-item {
    width: 200px;
    height: 200px;
  }
  .carousel-track {
    animation: scroll 15s linear infinite;
  }
  .text-container {
    margin-top: 1.5rem;
  }
}
</style>
