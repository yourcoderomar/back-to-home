<template>
  <q-page class="flex flex-center">
    <div class="container">
      <!-- Area 1: Clickable (Navigation) -->
      <router-link to="/OurPlans" class="area area-1 link" :data-aos="aosAnimation.area1" :data-aos-delay="aosDelay.area1">
        <div class="placeholder">
          <h1>Plans</h1>
          <p>Choose Wisely</p>
        </div>
        <img src="images/missing3.jpg" alt="Plan image" />
      </router-link>

      <!-- Area 2: Clickable (Navigation) -->
      <router-link to="/ReportMissing" class="area area-2 link" :data-aos="aosAnimation.area2" :data-aos-delay="aosDelay.area2">
        <div class="placeholder">
          <h1>Report</h1>
          <p>Missing Person</p>
        </div>
        <img src="images/missing3.jpg" alt="Plans image" />
      </router-link>

      <!-- Area 3: Clickable (Navigation) -->
      <router-link to="SearchMissing" class="area area-3 link" :data-aos="aosAnimation.area3" :data-aos-delay="aosDelay.area3">
        <div class="placeholder">
          <h1>Search</h1>
          <p>Missing Person</p>
        </div>
        <img src="images/missing3.jpg" alt="Recently found image" />
      </router-link>
    </div>
  </q-page>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";

export default {
  data() {
    return {
      aosAnimation: {
        area1: "fade-up",
        area2: "fade-up",
        area3: "fade-up",
      },
      aosDelay: {
        area1: "0",
        area2: "0",
        area3: "0",
      },
    };
  },
  mounted() {
    AOS.init(); // Initialize AOS
    this.updateAOS();
    window.addEventListener("resize", this.updateAOS);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateAOS);
  },
  methods: {
    updateAOS() {
      if (window.innerWidth <= 768) {
        this.aosAnimation = {
          area1: "fade-left",
          area2: "fade-right",
          area3: "fade-left",
        };
      } else {
        this.aosAnimation = {
          area1: "fade-up",
          area2: "fade-up",
          area3: "fade-up",
        };
      }

      // Ensure AOS is available before calling refresh
      this.$nextTick(() => {
        if (typeof AOS !== "undefined" && AOS.refresh) {
          AOS.refresh();
        } else {
          console.error("AOS is not initialized properly.");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/TopSection.scss";

.link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    box-shadow: 6px 6px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(-3px);
  }
}
</style>
