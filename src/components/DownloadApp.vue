<template>
  <q-section class="download-section">
    <q-container>
      <q-row class="items-center no-wrap full-width">
        <!-- Left Side: Text & Buttons -->
        <q-col class="content">
          <h2>Download Now!</h2>
          <p>Get the best experience with our mobile app. Download now!</p>
        </q-col>

        <!-- Right Side: Mobile Image -->
        <q-col class="image-container">
          <q-img src="images/mobile.jpg" alt="Mobile App" class="mobile-image" />
        </q-col>
      </q-row>
    </q-container>
  </q-section>
</template>

<style scoped>
.download-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.full-width {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.content {
  width: 50%;
  padding-right: 2rem;
  padding-left: 5vw;
}

.content h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
  color: #2c3539;
}

.content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  color: #49596b;
}

.image-container {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.mobile-image {
  max-width: 80%;
  height: auto;
}

.buttons-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-start;
}

.playstore-button {
  display: flex;
  align-items: center;
  border: 2px solid #49596b;
  border-radius: 9999px;
  background-color: #49596b;
  padding: 0.625rem 1.5rem;
  color: #fff;
  transition: all 0.2s ease;
}

.playstore-button:hover {
  background-color: transparent;
  color: #49596b;
}

.icon {
  height: 1.5rem;
  width: 1.5rem;
}

.texts {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.text-1 {
  font-size: 0.75rem;
}

.text-2 {
  font-weight: 600;
}

@media (max-width: 768px) {
  .full-width {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .content,
  .image-container {
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
