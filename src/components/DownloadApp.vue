<template>
  <q-section class="download-section">
    <q-container>
      <q-row class="items-center no-wrap full-width">
        <!-- Left Side: Text & Buttons -->
        <q-col class="content">
          <h2>Download Now!</h2>
          <p>
            Get the best experience with our mobile app. Download now on iOS and Android.
          </p>
          <div class="q-mt-md">
            <div class="buttons-container">
                <q-btn class="playstore-button" unelevated>
                  <q-icon class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                    </svg>
                  </q-icon>
                  <div class="texts">
                    <span class="text-1">GET IT ON</span>
                    <span class="text-2">Google Play</span>
                  </div>
                </q-btn>

                <q-btn class="playstore-button" unelevated>
                  <q-icon class="icon">
                    <svg fill="currentcolor" viewBox="-52.01 0 560.035 560.035" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                      <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"/>
                    </svg>
                  </q-icon>
                  <div class="texts">
                    <span class="text-1">GET IT ON</span>
                    <span class="text-2">App Store</span>
                  </div>
                </q-btn>
              </div>
          </div>
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

.content h2{
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;  
  color: #2C3539;
}

.content p{
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
  .content, .image-container {
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
