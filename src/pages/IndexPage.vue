<template>
  <div class="page-container">
    <!-- Video Background -->
    <div class="video-wrapper">
      <video autoplay muted loop playsinline>
        <source src="/images/bg2-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Content Overlay (NavBar + BigText) -->
    <div class="overlay-content">
      <NavBar class="navbar" />
      <BigText />
    </div>

    <!-- Other Sections (No Video Background) -->
    <q-page-container>
      <TopSection />
      <section class="q-mb-md">
        <HeroSection title="How Many Go Missing Every Day?" subtitle="" />
        <LostPeopleSection />
      </section>
      <HeroSection title="Real-Time Report" subtitle="" />
      <StatsOverview :lost="120" :connectedPercentage="45.8" :found="80"/>
      <router-view />
      <HeroSection title="Have You Seen Someone?" subtitle="" />
      <HaveYouSeen />
      <DownloadApp />
    </q-page-container>

    <FooterComponent />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import TopSection from '../components/TopSection.vue';
import HaveYouSeen from '../components/HaveYouSeen.vue';
import FooterComponent from '../components/Footer.vue';
import LostPeopleSection from 'src/components/LostPeopleSection.vue';
import HeroSection from 'src/components/HeroSection.vue';
import BigText from 'src/components/BigText.vue';
import StatsOverview from 'src/components/StatsOverview.vue';
import DownloadApp from 'src/components/DownloadApp.vue';
</script>

<style scoped>
/* Video Background - Stays Fixed */
.video-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* Covers only Nav + BigText */
  overflow: hidden;
  z-index: -1;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(80%);
}

/* Overlay Content (NavBar + BigText) */
.overlay-content {
  position: relative;
  z-index: 1000;
}

/* Fix NavBar to Stay Full Width */
.navbar {
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  background-color: transparent;
}


/* Make sure the rest of the page doesn't overlap */
.q-page-container {
  position: relative;
  z-index: 5;
  background: #f2f0e9; /* Ensure content is readable */
}
</style>
