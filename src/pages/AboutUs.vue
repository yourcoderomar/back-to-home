<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FooterComponent from 'src/components/Footer.vue'
import NavBar from 'src/components/NavBar.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from 'src/boot/supabase'

const aboutText =
  'Back2Home is a dedicated platform created by graduating students to address the critical issue of missing persons. What started as an academic project has evolved into a powerful tool that combines advanced technology with compassionate service to help reunite families.'

const teamText =
  'Our team consists of dedicated individuals who bring diverse skills and unwavering commitment to the mission of finding missing persons. Together, we work to make every search count and every reunion possible.'

const teamMembers = ref([
  {
    name: 'Team Member 1',
    image: '/images/omar2.jpg',
  },
  {
    name: 'Team Member 2',
    image: '/images/omar.jpg',
  },
  {
    name: 'Team Member 3',
    image: '/images/omar.jpg',
  },
  {
    name: 'Team Member 4',
    image: '/images/omar.jpg',
  },
  {
    name: 'Team Member 5',
    image: '/images/omar.jpg',
  },
  {
    name: 'Team Member 6',
    image: '/images/omar.jpg',
  },
])

const stats = ref({
  totalReports: 0,
  resolvedCases: 0,
  totalEntries: 0,
  activeUsers: 0,
})

const fetchStats = async () => {
  try {
    // Get total reports
    const { data: reportsData, error: reportsError } = await supabase.from('reports').select('id')

    if (reportsError) throw reportsError

    // Get resolved cases
    const { data: resolvedData, error: resolvedError } = await supabase
      .from('reports')
      .select('id')
      .eq('report_status', 'resolved')

    if (resolvedError) throw resolvedError

    // Get total database entries (reports + missing_reports + found_reports)
    const { count: missingCount, error: missingError } = await supabase
      .from('missing_reports')
      .select('*', { count: 'exact', head: true })

    if (missingError) throw missingError

    const { count: foundCount, error: foundError } = await supabase
      .from('found_reports')
      .select('*', { count: 'exact', head: true })

    if (foundError) throw foundError

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Update stats
    stats.value = {
      totalReports: reportsData?.length || 0,
      resolvedCases: resolvedData?.length || 0,
      totalEntries: (missingCount || 0) + (foundCount || 0),
      activeUsers: totalUsers || 0,
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

<template>
  <q-page-container>
    <NavBar />

    <!-- About Section -->
    <div class="about-section" id="about">
      <h1 class="page-title" data-aos="fade-down">ABOUT US.</h1>

      <div class="content-block">
        <p class="large-text" data-aos="fade-up" data-aos-delay="100">
          {{ aboutText }}
        </p>
      </div>

      <!-- Full Width Image -->
      <div class="full-width-image" data-aos="zoom-in">
        <img src="/images/1.jpg" alt="Team working together" />
      </div>

      <!-- Quote Section -->
      <div class="quote-section">
        <div class="quote-container" data-aos="fade-right">
          <blockquote>
            "Our work does make sense only if it is a faithful witness of his time."
          </blockquote>
          <cite>Jean-Philippe Nuel, Director</cite>
        </div>
        <div class="quote-image" data-aos="fade-left">
          <img src="/images/5.jpg" alt="Working on wall" />
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="team-section" id="team">
      <h2 class="section-title" data-aos="fade-down">THE TEAM.</h2>

      <div class="team-description">
        <p class="large-text" data-aos="fade-up" data-aos-delay="100">
          {{ teamText }}
        </p>
      </div>

      <!-- Team Grid -->
      <div class="team-grid">
        <div
          v-for="(member, index) in teamMembers"
          :key="index"
          class="team-member"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <img :src="member.image" :alt="member.name" />
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <div
          v-for="(stat, index) in [
            'Missing reports handled',
            'Cases resolved',
            'Database entries',
            'Total users',
          ]"
          :key="index"
          class="stat-item"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <h3>
            {{
              [stats.totalReports, stats.resolvedCases, stats.totalEntries, stats.activeUsers][
                index
              ]
            }}
          </h3>
          <p>{{ stat }}</p>
        </div>
      </div>
    </div>

    <FooterComponent />
  </q-page-container>
</template>

<style scoped>
.simple-nav {
  padding: 20px 40px;
  border-bottom: 1px solid #eee;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
}

.nav-links a.active {
  font-weight: 600;
}

.page-title {
  font-size: 4rem;
  font-weight: 800;
  margin: 60px 40px;
}

.content-block {
  padding: 0 40px;
  max-width: 800px;
}

.large-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #666;
}

.full-width-image {
  margin: 60px 0;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.full-width-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quote-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 60px 40px;
}

.quote-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

blockquote {
  font-size: 2rem;
  font-style: italic;
  line-height: 1.4;
  margin: 0 0 20px 0;
}

cite {
  font-style: normal;
  color: #666;
}

.quote-image {
  height: 400px;
}

.quote-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 60px 40px 30px;
}

.team-description {
  padding: 0 40px;
  max-width: 800px;
  margin-bottom: 60px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.team-member {
  aspect-ratio: 1;
  overflow: hidden;
}

.team-member img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 80px 40px;
  background: #f8f9fa;
  margin-top: 80px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.stat-item p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title,
  .section-title {
    font-size: 2.5rem;
    margin: 40px 20px;
  }

  .content-block,
  .team-description {
    padding: 0 20px;
  }

  .quote-section {
    grid-template-columns: 1fr;
    padding: 40px 20px;
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 20px;
  }

  .statistics {
    grid-template-columns: 1fr 1fr;
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
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
</style>
