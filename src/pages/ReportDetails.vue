<template>
  <q-page-container>
    <div class="report-details">
      <NavBar class="navbar" />

      <div class="content">
        <div v-if="report" class="grid-container">
          <!-- Name Section -->
          <div class="Name">
            <q-btn @click="goBack" label="Back" class="back-button submit" />
            <h1 class="report-title">{{ report.missing_person_name || report.found_person_name }}</h1>
          </div>

          <!-- Image Section -->
          <div class="img">
            <q-img v-if="imageUrl" :src="imageUrl" class="report-image" />
          </div>

          <!-- Details Section -->
          <div class="details">
            <p class="report-id"><strong>Report ID:</strong> {{ report.id }}</p>
            <p class="report-created"><strong>Created:</strong> {{ formatDate(report.created_at) }}</p>
            <p class="report-status"><strong>Status:</strong> {{ report.report_status }}</p>
            <p class="report-reporter-name"><strong>Reporter Name:</strong> {{ report.reporter_name }}</p>
            <p class="report-reporter-contact"><strong>Reporter Contact:</strong> {{ report.reporter_contact }}</p>
            <p class="report-updated"><strong>Updated At:</strong> {{ formatDate(report.updated_at) }}</p>

            <div v-if="report.report_type === 'missing'">
              <p><strong>Age:</strong> {{ report.age }}</p>
              <p><strong>Gender:</strong> {{ report.gender }}</p>
              <p><strong>Last Seen Location:</strong> {{ report.last_seen_location }}</p>
              <p><strong>Last Seen Date:</strong> {{ formatDate(report.last_seen_date) }}</p>
              <p><strong>Description:</strong> {{ report.description }}</p>
            </div>

            <div v-if="report.report_type === 'found'">
              <p><strong>Age Estimate:</strong> {{ report.age_estimate }}</p>
              <p><strong>Gender:</strong> {{ report.gender }}</p>
              <p><strong>Found Location:</strong> {{ report.found_location }}</p>
              <p><strong>Found Date:</strong> {{ formatDate(report.found_date) }}</p>
              <p><strong>Description:</strong> {{ report.description }}</p>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="loading-container">
            <q-spinner color="primary" size="50px" />
            <p>Loading report details...</p>
          </div>
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
          .select('id, report_type, created_at, report_status, reporter_name, reporter_contact, updated_at') // Fetch all necessary fields
          .eq('id', id)
          .single();

        if (reportError) throw reportError;

        console.log('Report Data:', reportData); // Debugging line

        // Determine which table to query based on the report type
        const tableName = reportData.report_type === 'missing' ? 'missing_reports' : 'found_reports';
        const nameField = reportData.report_type === 'missing' ? 'missing_person_name' : 'found_person_name';
        const foreignKey = reportData.report_type === 'missing' ? 'missing_report_id' : 'found_report_id';

        // Fetch the report details from the appropriate table
        const { data, error } = await supabase
          .from(tableName)
          .select(`${nameField}, age, gender, last_seen_location, last_seen_date, description${reportData.report_type === 'found' ? ', age_estimate, found_location, found_date' : ''}`) // Conditionally fetch fields without trailing comma
          .eq(foreignKey, id)
          .single();

        if (error) throw error;

        console.log('Fetched Data:', data); // Debugging line

        // Merge the report data with the details from the subtype table
        report.value = { ...reportData, ...data }; // This will include all necessary fields
      } catch (error) {
        console.error('Error fetching report details:', error);
      } finally {
        loading.value = false; // Set loading to false after fetching
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
.report-title {
  color: #f2f0e9;
  font-size: 5vw;
  font-weight: 600;
}
.report-details {
  padding: 20px;
}
.back-button {
  top: -65px; 
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
  grid-template-areas:
    "Name img"
    "details details";
  padding: 20px;
}

.Name {
  grid-area: Name;
  background-color: #49596b;
  border-radius: 8px;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  grid-area: img;
  display: flex;
  justify-content: center;
}

.report-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.details {
  grid-area: details;
  padding: 10px;
  background-color: #49596b;
  border-radius: 8px;
}

.navbar {
  margin-bottom: 20px;
}

.footer {
  margin-top: 20px;
}

.back-button {
  margin-bottom: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>