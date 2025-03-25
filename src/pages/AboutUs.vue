<script setup lang="ts">
import FooterComponent from 'src/components/Footer.vue';
import HeroSection from 'src/components/HeroSection.vue';
import LeftSection from 'src/components/LeftSection.vue';
import NavBar from 'src/components/NavBar.vue';
import RightSection from 'src/components/RightSection.vue';
</script>

<template>
  <q-page-container>
    <NavBar/>
    <HeroSection title="About Us" subtitle=""/>
    <div class="header-container">
      <div class="header-text" data-aos="fade-right" data-aos-duration="1500">
        <h1>Who Are We?</h1>
        <p>We are a team of graduating students using technology to help find missing people. What started as a project has become a mission to make a real impact. By combining our skills in software development and data analytics, we aim to create a practical and innovative solution for a safer society.</p>
      </div>
      <div class="header-image" data-aos="fade-left" data-aos-duration="1500">
        <img src="images/who-are-we.jpg" alt="Header Image" />
      </div>
    </div>
    <div class="bg-2">
    <LeftSection 
  title="Our Mission"
  description="Our mission is to leverage technology to efficiently track, manage, and reunite missing individuals with their loved ones."
  imageSrc="images/search.jpg"
  altText="Mission Image"
  :imageRight="true"
  aosText="fade-left"
  aosImage="fade-right"
  :aosDuration="2000"
/>
    </div>

    <div class="bg">
      <RightSection 
        title="Our Vision"
        description="Our vision is to create a world where no missing person goes unnoticed. Through advanced technology and seamless collaboration, we aim to build an intelligent ERP system that transforms search and recovery efforts, empowering families, organizations, and authorities with real-time insights. We envision a future where every lost individual is quickly and safely reunited with their loved ones, making communities more secure and connected."
        imageSrc="images/search.jpg"
        altText="Search Image"
      />
    </div>
    <FooterComponent/>
  </q-page-container>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #49596b;
  color: #f2f0e9;
  padding: 40px;
  gap: 20px;
}

/* Ensure proper text scaling */
.header-text {
  flex: 1;
  padding-right: 2vw;
}

.header-container h1 {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
}

.header-text p {
  font-size: clamp(1rem, 2.5vw, 1.6rem);
}

.header-image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.header-image img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .header-text {
    padding-right: 0;
  }

  .header-image {
    justify-content: center;
  }

  .header-image img {
    max-width: 80%;
  }
}


.bg {
  background-color: #49596b;
  padding: 5vw;
}

.bg-2{
  min-height: 70vh;
  display: grid;
  place-items: center; /* Centers both vertically and horizontally */
}
</style>
