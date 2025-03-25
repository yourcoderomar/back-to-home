<template>
  <q-page-container>
    <div class="report-details">
      <NavBar class="navbar" />

      <div class="content">
        <div v-if="report" class="modern-container">
          <!-- Left Section with Image -->
          <div class="left-section">
            <q-img v-if="imageUrl" :src="imageUrl" class="product-image" />
          </div>

          <!-- Right Section with Details -->
          <div class="right-section">
            <q-btn flat icon="arrow_back" @click="goBack" class="back-button" color="dark" />
            
            <h1 class="title">{{ report.missing_person_name || report.found_person_name }}</h1>
            <p class="report-id">Report #{{ report.id }}</p>
            
            <div class="status-chip" :class="report.report_status.toLowerCase()">
              {{ report.report_status }}
            </div>

            <div class="details-section">
              <template v-if="report.missing_person_name">
                <h3>Missing Person Details</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Age:</span>
                    <span>{{ report.age }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Gender:</span>
                    <span>{{ report.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Last Seen:</span>
                    <span>{{ formatDate(report.last_seen_date) }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="label">Location:</span>
                    <span>{{ report.last_seen_location }}</span>
                  </div>
                </div>
              </template>

              <template v-if="report.found_person_name">
                <h3>Found Person Details</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Age Estimate:</span>
                    <span>{{ report.age_estimate }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Gender:</span>
                    <span>{{ report.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Found Date:</span>
                    <span>{{ formatDate(report.found_date) }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="label">Location:</span>
                    <span>{{ report.found_location }}</span>
                  </div>
                </div>
              </template>

              <div class="description">
                <h3>Description</h3>
                <p>{{ report.description }}</p>
              </div>

              <div class="reporter-info">
                <h3>Reporter Information</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Name:</span>
                    <span>{{ report.reporter_name }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Contact:</span>
                    <span>{{ report.reporter_contact }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="loading-container">
          <q-spinner color="primary" size="50px" />
          <p>Loading report details...</p>
        </div>
      </div>
    </div>
    <FooterComponent class="footer" />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute
import { supabase } from 'src/boot/supabase'; // Import your Supabase instance
import NavBar from 'src/components/NavBar.vue'; // Import NavBar
import FooterComponent from 'src/components/Footer.vue'; // Import Footer

export default {
  name: 'ReportDetails',
  components: {
    NavBar,
    FooterComponent
  },
  setup() {
    const route = useRoute(); // Get the route instance
    const reportId = ref(route.params.id); // Get the report ID from the route
    const report = ref(null); // Initialize report as null
    const imageUrl = ref(route.query.imageUrl); // Get the image URL from the query
    const loading = ref(true); // Loading state

    const fetchReportDetails = async (id) => {
      try {
        // Fetch the report type and necessary fields from the reports table
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('id, report_type, created_at, report_status, reporter_name, reporter_contact, updated_at')
          .eq('id', id)
          .single();

        if (reportError) throw reportError;

        // Fetch both missing and found report details
        const { data: missingData, error: missingError } = await supabase
          .from('missing_reports')
          .select('missing_person_name, age, gender, last_seen_location, last_seen_date, description')
          .eq('missing_report_id', id)
          .single();

        if (missingError && missingError.code !== 'PGRST116') {
          console.error('Error fetching missing report:', missingError);
        }

        const { data: foundData, error: foundError } = await supabase
          .from('found_reports')
          .select('found_person_name, age_estimate, gender, found_location, found_date, description')
          .eq('found_report_id', id)
          .single();

        if (foundError && foundError.code !== 'PGRST116') {
          console.error('Error fetching found report:', foundError);
        }

        // Combine all the data
        report.value = {
          ...reportData,
          ...(missingData || {}),
          ...(foundData || {})
        };

      } catch (error) {
        console.error('Error fetching report details:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchReportDetails(reportId.value); // Fetch the report details
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    const goBack = () => {
      window.history.back(); // Go back to the previous page
    };

    return {
      report,
      imageUrl, // Include imageUrl in the return object
      formatDate,
      goBack,
      loading
    };
  }
};
</script>

<style scoped>
.report-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.modern-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.left-section {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}

.product-image {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  border-radius: 8px;
}

.right-section {
  padding: 40px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  right: 20px;
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.report-id {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.status-chip {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 30px;
}

.status-chip.open {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-chip.closed {
  background: #ffebee;
  color: #c62828;
}

.details-section {
  margin-top: 30px;
}

.details-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.description {
  margin-bottom: 30px;
}

.description p {
  color: #666;
  line-height: 1.6;
}

.reporter-info {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .modern-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .left-section {
    padding: 20px;
  }

  .right-section {
    padding: 20px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>