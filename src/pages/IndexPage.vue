<template>
  <div class="page-container">
    <!-- Video Background -->
    <div class="video-wrapper">
      <video autoplay muted loop playsinline>
        <source src="/images/bg2-video.webm" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Content Overlay (NavBar + BigText) -->
    <div class="overlay-content">
      <NavBar class="navbar" />
      <BigText data-aos="fade-down" data-aos-duration="1000" />
    </div>

    <!-- Other Sections (No Video Background) -->
    <q-page-container>
      <TopSection data-aos="fade-up" data-aos-duration="1000" />
      <section class="q-mb-md">
        <HeroSection
          title="How Many Go Missing Every Day?"
          subtitle=""
          data-aos="fade-right"
          data-aos-duration="800"
        />
        <LostPeopleSection data-aos="fade-up" data-aos-delay="200" data-aos-duration="800" />
      </section>
      <HeroSection
        title="Real-Time Report"
        subtitle=""
        data-aos="fade-left"
        data-aos-duration="800"
      />
      <StatsOverview
        :lost="stats.lost"
        :connectedPercentage="stats.connectedPercentage"
        :found="stats.found"
        data-aos="zoom-in"
        data-aos-duration="1000"
      />
      <router-view />
      <HeroSection
        title="Have You Seen Someone?"
        subtitle=""
        data-aos="fade-right"
        data-aos-duration="800"
      />
      <HaveYouSeen data-aos="fade-up" data-aos-delay="200" data-aos-duration="800" />
      <DownloadApp data-aos="fade-up" data-aos-duration="1000" />
    </q-page-container>

    <FooterComponent />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import TopSection from '../components/TopSection.vue'
import HaveYouSeen from '../components/HaveYouSeen.vue'
import FooterComponent from '../components/Footer.vue'
import LostPeopleSection from 'src/components/LostPeopleSection.vue'
import HeroSection from 'src/components/HeroSection.vue'
import BigText from 'src/components/BigText.vue'
import StatsOverview from 'src/components/StatsOverview.vue'
import DownloadApp from 'src/components/DownloadApp.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from 'src/boot/supabase'

const stats = ref({
  lost: 0,
  found: 0,
  connectedPercentage: 0,
})

const fetchStats = async () => {
  try {
    // Get total missing reports
    const { data: missingData, error: missingError } = await supabase
      .from('reports')
      .select('id')
      .eq('report_type', 'missing')

    if (missingError) throw missingError

    // Get total found reports
    const { data: foundData, error: foundError } = await supabase
      .from('reports')
      .select('id')
      .eq('report_type', 'found')

    if (foundError) throw foundError

    // Get resolved reports
    const { data: resolvedData, error: resolvedError } = await supabase
      .from('reports')
      .select('id')
      .eq('report_status', 'resolved')

    if (resolvedError) throw resolvedError

    const totalMissing = missingData?.length || 0
    const totalFound = foundData?.length || 0
    const totalResolved = resolvedData?.length || 0

    // Calculate statistics
    stats.value = {
      lost: totalMissing,
      found: totalFound,
      connectedPercentage: totalMissing > 0 ? (totalResolved / totalMissing) * 100 : 0,
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
    anchorPlacement: 'top-bottom',
  })

  // Fetch initial stats
  fetchStats()

  // Set up real-time subscription for reports table
  const reportsSubscription = supabase
    .channel('reports-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
      fetchStats() // Refresh stats when reports change
    })
    .subscribe()

  // Cleanup subscription on component unmount
  return () => {
    reportsSubscription.unsubscribe()
  }
})
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

/* Add smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Ensure animations work properly */
[data-aos] {
  pointer-events: none;
}

[data-aos].aos-animate {
  pointer-events: auto;
}

/* Add some spacing between sections for better animation visibility */
section {
  margin-bottom: 2rem;
}
</style>
