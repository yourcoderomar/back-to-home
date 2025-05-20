<template>
  <q-page-container>
    <div class="report-details">
      <NavBar class="navbar" />
      <ToastNotification ref="toast" />
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

              <!-- Add Action Buttons -->
              <div class="action-buttons">
                <q-btn
                  class="action-btn call-btn"
                  icon="phone"
                  label="Call Reporter"
                  @click="callReporter"
                  :disable="!report.reporter_contact"
                />
                <q-btn
                  v-if="isProUser"
                  class="action-btn save-btn"
                  :icon="isSaved ? 'bookmark' : 'bookmark_border'"
                  :label="isSaved ? 'Unsave Report' : 'Save Report'"
                  @click="toggleSaveReport"
                />
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import ToastNotification from 'src/components/ToastNotification.vue'

export default {
  name: 'ReportDetails',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const reportId = ref(route.params.id)
    const report = ref(null)
    const imageUrl = ref(route.query.imageUrl)
    const loading = ref(true)
    const isSaved = ref(false)
    const isProUser = ref(false)
    const toast = ref(null)

    const checkUserPlan = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          router.push('/SignIn')
          return
        }

        const { data, error } = await supabase
          .from('users')
          .select('user_plan, plan:plan(plan_name)')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        isProUser.value = data.plan.plan_name === 'pro'
      } catch (error) {
        console.error('Error checking user plan:', error)
      }
    }

    const fetchReportDetails = async (id) => {
      try {
        // Fetch the report type and necessary fields from the reports table
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select(
            'id, report_type, created_at, report_status, reporter_name, reporter_contact, updated_at',
          )
          .eq('id', id)
          .single()

        if (reportError) throw reportError

        let detailsData = null
        let detailsError = null

        // Fetch details based on report type
        if (reportData.report_type === 'missing') {
          const { data, error } = await supabase
            .from('missing_reports')
            .select(
              'missing_person_name, age, gender, last_seen_location, last_seen_date, description',
            )
            .eq('missing_report_id', id)
            .single()
          detailsData = data
          detailsError = error
        } else if (reportData.report_type === 'found') {
          const { data, error } = await supabase
            .from('found_reports')
            .select(
              'found_person_name, age_estimate, gender, found_location, found_date, description',
            )
            .eq('found_report_id', id)
            .single()
          detailsData = data
          detailsError = error
        }

        if (detailsError && detailsError.code !== 'PGRST116') {
          console.error('Error fetching report details:', detailsError)
        }

        // Combine all the data
        report.value = {
          ...reportData,
          ...(detailsData || {}),
        }
      } catch (error) {
        console.error('Error fetching report details:', error)
      } finally {
        loading.value = false
      }
    }

    const callReporter = () => {
      if (report.value?.reporter_contact) {
        window.location.href = `tel:${report.value.reporter_contact}`
      } else {
        toast.value.show('No contact number available', 'warning')
      }
    }

    const toggleSaveReport = async () => {
      if (!isProUser.value) {
        toast.value.show('This feature is only available for Pro users', 'warning')
        return
      }

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) throw authError

        if (!isSaved.value) {
          // Save the report
          const { error } = await supabase.from('saved_reports').insert([
            {
              user_id: user.id,
              report_id: reportId.value,
              report_type: report.value.missing_person_name ? 'missing' : 'found',
              created_at: new Date().toISOString(),
            },
          ])

          if (error) throw error

          isSaved.value = true
          toast.value.show('Report saved successfully!', 'success')
        } else {
          // Unsave the report
          const { error } = await supabase.from('saved_reports').delete().match({
            report_id: reportId.value,
            user_id: user.id,
          })

          if (error) throw error

          isSaved.value = false
          toast.value.show('Report removed from saved', 'success')
        }
      } catch (error) {
        console.error('Error toggling save status:', error)
        toast.value.show('Failed to update save status', 'error')
      }
    }

    const checkIfSaved = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) return

        const { data, error } = await supabase
          .from('saved_reports')
          .select('*')
          .match({
            report_id: reportId.value,
            user_id: user.id,
          })
          .single()

        if (error && error.code !== 'PGRST116') throw error
        isSaved.value = !!data
      } catch (error) {
        console.error('Error checking save status:', error)
      }
    }

    onMounted(() => {
      fetchReportDetails(reportId.value)
      checkUserPlan()
      checkIfSaved()
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const goBack = () => {
      window.history.back() // Go back to the previous page
    }

    return {
      report,
      imageUrl,
      formatDate,
      goBack,
      loading,
      callReporter,
      toggleSaveReport,
      isSaved,
      isProUser,
      toast,
    }
  },
}
</script>

<style scoped>
.report-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

.modern-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.modern-container:hover {
  transform: translateY(-4px);
}

.left-section {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.right-section {
  padding: 40px;
  position: relative;
  background: white;
}

.back-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f8f9fa;
  border-radius: 50%;
  padding: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e9ecef;
  transform: scale(1.1);
}

.title {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 700;
  line-height: 1.2;
}

.report-id {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 24px;
  font-weight: 500;
}

.status-chip {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 32px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-chip.open {
  background: #e8f5e9;
  color: #2e7d32;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.1);
}

.status-chip.closed {
  background: #ffebee;
  color: #c62828;
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.1);
}

.details-section {
  margin-top: 32px;
}

.details-section h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 8px;
}

.details-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #3498db;
  border-radius: 2px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description {
  margin-bottom: 32px;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
}

.description p {
  color: #495057;
  line-height: 1.8;
  font-size: 15px;
}

.reporter-info {
  padding-top: 24px;
  border-top: 2px solid #e9ecef;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.loading-container p {
  margin-top: 16px;
  color: #6c757d;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #e9ecef;
}

.action-btn {
  flex: 1;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.call-btn {
  background: #4caf50;
  color: white;
}

.call-btn:hover {
  background: #43a047;
  transform: translateY(-2px);
}

.save-btn {
  background: #2196f3;
  color: white;
}

.save-btn:hover {
  background: #1e88e5;
  transform: translateY(-2px);
}

.save-btn[aria-label='Unsave Report'] {
  background: #ffa726;
}

.save-btn[aria-label='Unsave Report']:hover {
  background: #fb8c00;
}

.action-btn:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .report-details {
    padding: 20px;
  }

  .modern-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .left-section {
    padding: 20px;
  }

  .right-section {
    padding: 24px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 28px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>

<style>
/* Remove all custom notification styles */
</style>
