<script setup lang="ts">
import { ref } from 'vue';
import FooterComponent from 'src/components/Footer.vue';
import NavBar from 'src/components/NavBar.vue';

const aboutText = "Back2Home is a dedicated platform created by graduating students to address the critical issue of missing persons. What started as an academic project has evolved into a powerful tool that combines advanced technology with compassionate service to help reunite families.";

const teamText = "Our team consists of dedicated individuals who bring diverse skills and unwavering commitment to the mission of finding missing persons. Together, we work to make every search count and every reunion possible.";

const teamMembers = ref([
  {
    name: 'Team Member 1',
    image: '/images/search.jpg'
  },
  {
    name: 'Team Member 2',
    image: '/images/search.jpg'
  },
  {
    name: 'Team Member 3',
    image: '/images/search.jpg'
  }
]);
</script>

<template>
  <q-page-container>
    <NavBar />

    <!-- About Section -->
    <div class="about-section" id="about">
      <h1 class="page-title">ABOUT US.</h1>
      
      <div class="content-block">
        <p class="large-text">
          {{ aboutText }}
        </p>
      </div>

      <!-- Full Width Image -->
      <div class="full-width-image">
        <img src="/images/search.jpg" alt="Team working together" />
      </div>

      <!-- Quote Section -->
      <div class="quote-section">
        <div class="quote-container">
          <blockquote>
            "Our work does make sense only if it is a faithful witness of his time."
          </blockquote>
          <cite>Jean-Philippe Nuel, Director</cite>
        </div>
        <div class="quote-image">
          <img src="/images/search.jpg" alt="Working on wall" />
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="team-section" id="team">
      <h2 class="section-title">THE TEAM.</h2>
      
      <div class="team-description">
        <p class="large-text">
          {{ teamText }}
        </p>
      </div>

      <!-- Team Grid -->
      <div class="team-grid">
        <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
          <img :src="member.image" :alt="member.name" />
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics">
        <div class="stat-item">
          <h3>600</h3>
          <p>Missing reports handled</p>
        </div>
        <div class="stat-item">
          <h3>700</h3>
          <p>Cases resolved</p>
        </div>
        <div class="stat-item">
          <h3>1.2</h3>
          <p>Million database entries</p>
        </div>
        <div class="stat-item">
          <h3>110</h3>
          <p>Active volunteers</p>
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
}

.team-member {
  aspect-ratio: 1;
  overflow: hidden;
}

.team-member img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .statistics {
    grid-template-columns: 1fr 1fr;
    padding: 40px 20px;
  }
}
</style>
