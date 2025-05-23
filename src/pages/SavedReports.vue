<template>
  <q-page-container>
    <div class="saved-reports">
      <NavBar class="navbar" />
      <ToastNotification ref="toast" />
      <div class="content">
        <div class="page-header">
          <h1>Saved Reports</h1>
          <div class="filters">
            <q-select
              v-model="filters.type"
              :options="reportTypeOptions"
              label="Report Type"
              outlined
              dense
              class="filter-select"
              clearable
            />
            <q-select
              v-model="filters.sortBy"
              :options="sortOptions"
              label="Sort By"
              outlined
              dense
              class="filter-select"
            />
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <q-spinner color="primary" size="50px" />
          <p>Loading saved reports...</p>
        </div>

        <div v-else-if="savedReports.length === 0" class="empty-state">
          <q-icon name="bookmark_border" size="64px" color="grey-7" />
          <h2>No Saved Reports</h2>
          <p>Reports you save will appear here</p>
          <q-btn color="primary" label="Browse Reports" to="/SearchReports" class="browse-btn" />
        </div>

        <div v-else class="reports-grid">
          <q-card
            v-for="report in filteredReports"
            :key="report.id"
            class="report-card"
            clickable
            @click="viewReport(report)"
          >
            <q-img
              v-if="report.photo_url"
              :src="report.photo_url"
              class="report-image"
              :ratio="16 / 9"
            />
            <q-img v-else src="src/assets/default-image.jpg" class="report-image" :ratio="16 / 9" />

            <q-card-section>
              <div class="text-h6 ellipsis">
                {{ report.missing_person_name || report.found_person_name }}
              </div>
              <div class="text-subtitle2">
                {{ report.report_type === 'missing' ? 'Missing Person' : 'Found Person' }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="row items-center q-gutter-sm">
                <q-chip :color="getStatusColor(report.report_status)" text-color="white" size="sm">
                  {{ report.report_status }}
                </q-chip>
                <q-chip v-if="report.age || report.age_estimate" outline size="sm">
                  {{ report.age || report.age_estimate }} years
                </q-chip>
                <q-chip v-if="report.gender" outline size="sm">
                  {{ report.gender }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                round
                icon="phone"
                @click.stop="callReporter(report.reporter_contact)"
                :disable="!report.reporter_contact"
              />
              <q-btn
                flat
                round
                icon="bookmark"
                color="primary"
                @click.stop="unsaveReport(report)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <FooterComponent class="footer" />
  </q-page-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import ToastNotification from 'src/components/ToastNotification.vue'

export default {
  name: 'SavedReports',
  components: {
    NavBar,
    FooterComponent,
    ToastNotification,
  },
  setup() {
    const router = useRouter()
    const toast = ref(null)
    const loading = ref(true)
    const savedReports = ref([])
    const filters = ref({
      type: null,
      sortBy: 'newest',
    })

    const reportTypeOptions = [
      { label: 'All Types', value: null },
      { label: 'Missing Persons', value: 'missing' },
      { label: 'Found Persons', value: 'found' },
    ]

    const sortOptions = [
      { label: 'Newest First', value: 'newest' },
      { label: 'Oldest First', value: 'oldest' },
      { label: 'Name (A-Z)', value: 'name_asc' },
      { label: 'Name (Z-A)', value: 'name_desc' },
    ]

    const fetchSavedReports = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
          router.push('/SignIn')
          return
        }

        // First, get the saved reports
        const { data: savedData, error: savedError } = await supabase
          .from('saved_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (savedError) throw savedError

        console.log('Saved reports data:', savedData)

        // Then, get the full report details for each saved report
        const reportIds = savedData.map((item) => item.report_id)
        console.log('Report IDs to fetch:', reportIds)

        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select(
            `
            id,
            report_type,
            report_status,
            reporter_name,
            reporter_contact,
            created_at,
            missing_reports!left (
              missing_person_name,
              age,
              gender,
              last_seen_location,
              last_seen_date,
              description,
              photo_url
            ),
            found_reports!left (
              found_person_name,
              age_estimate,
              gender,
              found_location,
              found_date,
              description,
              photo_url
            )
          `,
          )
          .in('id', reportIds)

        if (reportsError) throw reportsError

        console.log('Fetched reports data:', reportsData)

        // Transform and combine the data
        savedReports.value = reportsData.map((report) => {
          const savedReport = savedData.find((item) => item.report_id === report.id)
          console.log('Matching saved report:', savedReport, 'for report:', report.id)

          return {
            ...report,
            ...(report.missing_reports || {}),
            ...(report.found_reports || {}),
            saved_at: savedReport?.created_at,
          }
        })

        console.log('Final saved reports:', savedReports.value)
      } catch (error) {
        console.error('Error fetching saved reports:', error)
        toast.value.showToast('Failed to load saved reports', 'error')
      } finally {
        loading.value = false
      }
    }

    const filteredReports = computed(() => {
      let filtered = [...savedReports.value]

      // Apply type filter
      if (filters.value.type) {
        filtered = filtered.filter((report) => report.report_type === filters.value.type)
      }

      // Apply sorting
      switch (filters.value.sortBy) {
        case 'oldest':
          filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          break
        case 'name_asc':
          filtered.sort((a, b) => {
            const nameA = (a.missing_person_name || a.found_person_name || '').toLowerCase()
            const nameB = (b.missing_person_name || b.found_person_name || '').toLowerCase()
            return nameA.localeCompare(nameB)
          })
          break
        case 'name_desc':
          filtered.sort((a, b) => {
            const nameA = (a.missing_person_name || a.found_person_name || '').toLowerCase()
            const nameB = (b.missing_person_name || b.found_person_name || '').toLowerCase()
            return nameB.localeCompare(nameA)
          })
          break
        default: // 'newest'
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      return filtered
    })

    const viewReport = (report) => {
      console.log('Card clicked:', report.id)
      // Get the correct photo URL based on report type
      const photoUrl =
        report.report_type === 'missing'
          ? report.missing_reports?.photo_url
          : report.found_reports?.photo_url

      router.push({
        path: `/ReportDetails/${report.id}`,
        query: { imageUrl: photoUrl },
      })
    }

    const callReporter = (phoneNumber) => {
      if (phoneNumber) {
        window.location.href = `tel:${phoneNumber}`
      } else {
        toast.value.show('No contact number available', 'warning')
      }
    }

    const unsaveReport = async (report) => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) throw authError

        const { error } = await supabase
          .from('saved_reports')
          .delete()
          .match({
            report_id: parseInt(report.id),
            user_id: user.id,
          })

        if (error) throw error

        // Remove from local array
        savedReports.value = savedReports.value.filter((r) => r.id !== report.id)

        toast.value.showToast('Report removed from saved', 'success')
      } catch (error) {
        console.error('Error unsaving report:', error)
        toast.value.showToast('Failed to remove report from saved', 'error')
      }
    }

    const getStatusColor = (status) => {
      const colors = {
        open: 'primary',
        resolved: 'positive',
        closed: 'negative',
      }
      return colors[status] || 'grey'
    }

    onMounted(fetchSavedReports)

    return {
      loading,
      savedReports,
      filters,
      reportTypeOptions,
      sortOptions,
      filteredReports,
      viewReport,
      callReporter,
      unsaveReport,
      getStatusColor,
      toast,
    }
  },
}
</script>

<style scoped>
.saved-reports {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.page-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 24px;
}

.page-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 24px;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-select {
  min-width: 200px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.report-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #49596b;
}

.report-image {
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e0e0e0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #666;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-state h2 {
  margin: 16px 0 8px;
  color: #2c3e50;
  font-weight: 600;
}

.empty-state p {
  margin-bottom: 24px;
  color: #666;
}

.browse-btn {
  padding: 12px 32px;
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
  font-size: 16px;
}

:deep(.q-card__section) {
  padding: 16px;
}

:deep(.q-card__section + .q-card__section) {
  padding-top: 0;
}

:deep(.text-h6) {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

:deep(.text-subtitle2) {
  color: #666;
  font-size: 14px;
}

:deep(.q-chip) {
  font-size: 12px;
  height: 24px;
}

:deep(.q-card__actions) {
  padding: 8px 16px;
  border-top: 1px solid #e0e0e0;
}

:deep(.q-btn) {
  font-size: 16px;
}

:deep(.q-btn .q-icon) {
  font-size: 24px;
}

/* Add specific styles for notification button */
:deep(.notification-btn) {
  font-size: 16px !important;
}

:deep(.notification-btn .q-icon) {
  font-size: 32px !important;
}

@media (max-width: 768px) {
  .saved-reports {
    padding: 20px;
  }

  .content {
    padding: 20px;
    border-radius: 12px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 24px;
  }
}
</style>
