<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from 'src/boot/supabase'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import HeroSection from 'src/components/HeroSection.vue'
import ToastNotification from 'components/ToastNotification.vue'
import MatchedReportDetailsDialog from 'components/dialogs/MatchedReportDetailsDialog.vue'

const matchedReports = ref([])
const loading = ref(true)
const error = ref(null)
const currentUser = ref(null)
const toast = ref(null)
const showDetailsDialog = ref(false)
const selectedReport = ref(null)

// Fetch matched reports for the current user
const fetchMatchedReports = async () => {
  try {
    loading.value = true
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    currentUser.value = user

    const { data, error: fetchError } = await supabase
      .from('matched_reports')
      .select(
        `
        id,
        missing_report_id,
        found_report_id,
        missing_reporter_id,
        found_reporter_id,
        match_confidence,
        status,
        missing_image_path,
        found_image_path,
        created_at,
        missing_reports:missing_report_id (
          missing_person_name
        ),
        found_reports:found_report_id (
          found_person_name
        )
      `,
      )
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw new Error('Failed to fetch matched reports')
    }

    matchedReports.value = data || []
  } catch (err) {
    error.value = err.message
    if (toast.value) {
      toast.value.showToast('Failed to load matched reports', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Filter reports based on user role
const filteredReports = computed(() => {
  return matchedReports.value
})

// Watch for changes in matchedReports
watch(
  matchedReports,
  (newValue) => {
    console.log('matchedReports changed:', newValue)
  },
  { deep: true },
)

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'resolved':
      return 'positive'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'negative'
    default:
      return 'grey'
  }
}

// Function to show report details
const showReportDetails = (report) => {
  selectedReport.value = report
  showDetailsDialog.value = true
}

onMounted(() => {
  fetchMatchedReports()
})
</script>

<template>
  <div>
    <q-page-container>
      <NavBar />
      <HeroSection title="Matched Reports" />
      <q-page padding>
        <!-- Page Title -->
        <div class="row">
          <div class="col-12">
            <div class="text-h5">
              Your Matched Reports
              <q-icon name="compare_arrows" size="2rem" color="primary" class="q-ml-sm" />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="row justify-center q-pa-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-negative q-pa-md">
          {{ error }}
        </div>

        <!-- No Results -->
        <div
          v-if="!loading && !error && (!filteredReports || filteredReports.length === 0)"
          class="no-results-container"
        >
          <q-icon name="compare_arrows" size="8rem" color="grey-7" class="q-mb-xl" />
          <h2 class="text-h4 q-mb-xl">No Matched Reports</h2>
          <p class="text-subtitle1 q-mb-xl">We haven't found any matches for your reports yet.</p>
          <q-btn
            color="primary"
            label="Browse Reports"
            to="/SearchReports"
            class="browse-btn"
            size="lg"
          />
        </div>

        <!-- Matched Reports List -->
        <div v-if="filteredReports && filteredReports.length > 0" class="row q-col-gutter-md">
          <div v-for="report in filteredReports" :key="report.id" class="col-12 col-md-6 col-lg-4">
            <q-card class="matched-report-card">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between">
                  <div class="text-h6">
                    {{ report.missing_reports?.missing_person_name || 'Unknown Person' }}
                  </div>
                  <q-badge :color="getStatusColor(report.status)" :label="report.status" />
                </div>
              </q-card-section>

              <q-card-section class="q-pa-lg">
                <div class="row q-col-gutter-lg">
                  <!-- Missing Person Image -->
                  <div class="col-6">
                    <q-img
                      v-if="report.missing_image_path"
                      :src="report.missing_image_path"
                      :ratio="1"
                      class="rounded-borders"
                      spinner-color="primary"
                      spinner-size="24px"
                    />
                    <div v-else class="placeholder-image">
                      <q-icon name="person" size="4rem" color="grey-7" />
                    </div>
                    <div class="text-center q-mt-md text-subtitle2 person-label">
                      {{ report.missing_reports?.missing_person_name || 'Unknown Missing Person' }}
                    </div>
                  </div>

                  <!-- Found Person Image -->
                  <div class="col-6">
                    <q-img
                      v-if="report.found_image_path"
                      :src="report.found_image_path"
                      :ratio="1"
                      class="rounded-borders"
                      spinner-color="primary"
                      spinner-size="24px"
                    />
                    <div v-else class="placeholder-image">
                      <q-icon name="person" size="4rem" color="grey-7" />
                    </div>
                    <div class="text-center q-mt-md text-subtitle2 person-label">
                      {{ report.found_reports?.found_person_name || 'Unknown Found Person' }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-lg">
                <div class="text-subtitle2">Match Details</div>
                <q-list dense class="q-gutter-y-md">
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Match Confidence</q-item-label>
                      <q-item-label class="text-weight-medium"
                        >{{ report.match_confidence }}%</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Matched On</q-item-label>
                      <q-item-label class="text-weight-medium">{{
                        formatDate(report.created_at)
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-lg">
                <q-btn
                  flat
                  color="primary"
                  label="View Details"
                  @click="showReportDetails(report)"
                  class="q-px-lg"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <!-- Details Dialog -->
        <MatchedReportDetailsDialog v-model="showDetailsDialog" :report="selectedReport" />
      </q-page>
      <FooterComponent />
      <ToastNotification ref="toast" />
    </q-page-container>
  </div>
</template>

<style scoped>
/* Container styling */
.q-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: #f2f0e9;
}

/* Grid container */
.row.q-col-gutter-md {
  margin: -12px;
}

.row.q-col-gutter-md > div {
  padding: 12px;
}

/* Card styling */
.matched-report-card {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  background: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.matched-report-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #49596b, #00bfff);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.matched-report-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.matched-report-card:hover::before {
  opacity: 1;
}

.matched-report-card .q-card-section {
  padding: 24px;
}

.matched-report-card .text-h6 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #49596b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.matched-report-card .q-badge {
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.matched-report-card .q-img {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-bottom: 8px;
}

.matched-report-card .q-img:hover {
  transform: scale(1.02);
}

.matched-report-card .person-label {
  font-size: 1rem;
  font-weight: 600;
  color: #49596b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.matched-report-card .text-subtitle2 {
  font-weight: 600;
  color: #49596b;
  font-size: 1.2rem;
  position: relative;
  padding-bottom: 12px;
}

.matched-report-card .q-item {
  padding: 12px 0;
  transition: background-color 0.2s ease;
}

.matched-report-card .q-item:hover {
  background-color: #f2f0e9;
  border-radius: 8px;
}

.matched-report-card .q-item__label {
  font-size: 1.1rem;
  color: #49596b;
}

.matched-report-card .q-item__label--caption {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.matched-report-card .q-btn {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 10px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.matched-report-card .q-btn:hover {
  background: #f2f0e9;
  transform: translateY(-2px);
}

/* Page title styling */
.text-h5 {
  font-weight: 700;
  color: #49596b;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f2f0e9;
  position: relative;
}

.text-h5::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: #00bfff;
}

/* Loading spinner styling */
.q-spinner-dots {
  margin: 40px 0;
  color: #49596b;
}

/* No results container styling */
.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 40px 0;
  text-align: center;
}

.no-results-container .text-h4 {
  color: #49596b;
  font-weight: 700;
  margin: 0;
  font-size: 2.5rem;
  line-height: 1.3;
}

.no-results-container .text-subtitle1 {
  color: #666;
  font-size: 1.3rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.no-results-container .browse-btn {
  padding: 16px 40px;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  margin-top: 16px;
}

.no-results-container .browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Error message styling */
.text-negative {
  background: #ffebee;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 4px solid #f44336;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .q-page {
    padding: 20px 12px;
  }

  .matched-report-card .q-card-section {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .q-page {
    padding: 16px 8px;
  }

  .matched-report-card {
    border-radius: 12px;
  }

  .matched-report-card .q-card-section {
    padding: 12px;
  }

  .matched-report-card .text-h6 {
    font-size: 1.1rem;
  }
}

.placeholder-image {
  width: 100%;
  aspect-ratio: 1;
  background-color: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
</style>
