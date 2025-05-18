<template>
  <div class="page-container">
    <NavBar class="navbar" />
    <HeroSection
      title="Search Reports"
      subtitle="Let's find the report you're looking for"
      background-image="/images/hero-bg.jpg"
    />
    <q-page-container>
      <div class="search-container q-pa-md">
        <!-- Progress Indicator -->
        <div class="progress-indicator q-mb-lg">
          <div class="progress-steps">
            <div
              v-for="(step, index) in 7"
              :key="index"
              :class="[
                'step',
                {
                  active: !reports.length && currentStep === index,
                  completed: reports.length || currentStep > index,
                  upcoming: !reports.length && currentStep < index,
                },
              ]"
              @click="goToStep(index)"
            >
              <div class="step-icon">
                <q-icon :name="getStepIcon(index)" size="24px" />
                <div v-if="reports.length || currentStep > index" class="step-check">
                  <q-icon name="check" size="16px" />
                </div>
              </div>
              <span class="step-label">{{ getStepLabel(index) }}</span>
            </div>
          </div>
        </div>

        <!-- Interactive Question Flow -->
        <div class="search-section q-mb-lg" v-if="!reports.length && !loading">
          <div class="question-flow">
            <div v-if="currentStep === 0" class="question-step">
              <h3 class="question-title">
                <q-icon name="search" size="32px" class="q-mr-md" />
                What type of report are you looking for?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-card class="option-card" clickable @click="selectReportType('missing')">
                    <q-card-section>
                      <div class="text-h6">
                        <q-icon name="person_search" size="28px" class="q-mr-sm" />
                        Missing Person Report
                      </div>
                      <div class="text-subtitle2">Search for reports about missing persons</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-6">
                  <q-card class="option-card" clickable @click="selectReportType('found')">
                    <q-card-section>
                      <div class="text-h6">
                        <q-icon name="person_add" size="28px" class="q-mr-sm" />
                        Found Person Report
                      </div>
                      <div class="text-subtitle2">Search for reports about found persons</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 1" class="question-step">
              <h3 class="question-title">
                <q-icon name="wc" size="32px" class="q-mr-md" />
                What is the gender of the person?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4" v-for="gender in genderOptions" :key="gender.value">
                  <q-card class="option-card" clickable @click="selectGender(gender.value)">
                    <q-card-section>
                      <div class="text-h6">
                        <q-icon :name="getGenderIcon(gender.value)" size="28px" class="q-mr-sm" />
                        {{ gender.label }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 2" class="question-step">
              <h3 class="question-title">
                <q-icon name="cake" size="32px" class="q-mr-md" />
                What is the approximate age?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="searchQuery.age"
                    type="number"
                    label="Approximate Age"
                    outlined
                    dense
                    clearable
                    :rules="[
                      (val) => !val || (val >= 0 && val <= 120) || 'Age must be between 0 and 120',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="cake" />
                    </template>
                  </q-input>
                  <div class="text-caption q-mt-sm">
                    <q-icon name="info" size="16px" class="q-mr-xs" />
                    Enter an approximate age or leave blank to skip
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 3" class="question-step">
              <h3 class="question-title">
                <q-icon name="event" size="32px" class="q-mr-md" />
                When approximately was the report created?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="searchQuery.date"
                    label="Approximate Date"
                    outlined
                    dense
                    clearable
                    mask="##/##/####"
                    :rules="[
                      (val) =>
                        !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Please use DD/MM/YYYY format',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="calendar_today" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="searchQuery.date" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <div class="text-caption q-mt-sm">
                    <q-icon name="info" size="16px" class="q-mr-xs" />
                    Select an approximate date or leave blank to skip
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 4" class="question-step">
              <h3 class="question-title">
                <q-icon name="place" size="32px" class="q-mr-md" />
                Where approximately was the person last seen/found?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="searchQuery.location"
                    label="Approximate Location"
                    outlined
                    dense
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_on" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="my_location" />
                    </template>
                  </q-input>
                  <div class="text-caption q-mt-sm">
                    <q-icon name="info" size="16px" class="q-mr-xs" />
                    Enter an approximate location or leave blank to skip
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 5" class="question-step">
              <h3 class="question-title">
                <q-icon name="badge" size="32px" class="q-mr-md" />
                What is the approximate name of the person?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="searchQuery.name"
                    label="Approximate Name"
                    outlined
                    dense
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                  <div class="text-caption q-mt-sm">
                    <q-icon name="info" size="16px" class="q-mr-xs" />
                    Enter an approximate name or leave blank to skip
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 6" class="question-step">
              <h3 class="question-title">
                <q-icon name="description" size="32px" class="q-mr-md" />
                Any additional details or description?
              </h3>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="searchQuery.description"
                    type="textarea"
                    label="Additional Details"
                    outlined
                    dense
                    clearable
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit" />
                    </template>
                  </q-input>
                  <div class="text-caption q-mt-sm">
                    <q-icon name="info" size="16px" class="q-mr-xs" />
                    Enter any additional details or leave blank to skip
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="row justify-end q-mt-lg" v-if="currentStep > 0 && currentStep < 6">
              <q-btn
                flat
                color="grey-7"
                label="Back"
                @click="previousStep"
                icon="arrow_back"
                class="q-mr-sm"
              />
              <q-btn
                v-if="currentStep !== 1"
                :color="hasInputForCurrentStep ? 'primary' : 'grey-7'"
                :label="hasInputForCurrentStep ? 'Next' : 'Skip'"
                @click="nextStep"
                icon-right="arrow_forward"
                :flat="!hasInputForCurrentStep"
              />
            </div>

            <!-- Search Button for Last Step -->
            <div class="row justify-end q-mt-lg" v-if="currentStep === 6">
              <q-btn
                flat
                color="grey-7"
                label="Back"
                @click="previousStep"
                icon="arrow_back"
                class="q-mr-sm"
              />
              <q-btn color="primary" label="Search" @click="handleSearch" icon-right="search" />
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section" v-if="reports.length > 0 || loading">
          <div class="row justify-between items-center">
            <div class="text-h6">Search Results</div>
            <q-btn color="primary" icon="search" label="New Search" @click="resetSearch" flat />
          </div>
          <div v-if="loading" class="loading-container">
            <q-spinner-dots color="primary" size="40px" />
            <p class="loading-text">Searching reports...</p>
          </div>
          <div v-else class="reports-list">
            <q-list bordered separator>
              <q-item
                v-for="report in reports"
                :key="report.id"
                clickable
                @click="viewReport(report)"
                class="report-item"
              >
                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon
                      :name="report.missing_person_name ? 'person_search' : 'person_add'"
                      size="24px"
                      class="q-mr-sm"
                    />
                    {{ report.missing_person_name || report.found_person_name }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-icon name="tag" size="16px" class="q-mr-xs" />
                    Report ID: {{ report.id }} | Status: {{ report.status }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-icon name="event" size="16px" class="q-mr-xs" />
                    Created: {{ formatDate(report.created_at) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-md">
                    <q-btn
                      v-if="report.reporter_contact"
                      round
                      color="primary"
                      icon="phone"
                      size="sm"
                      @click.stop="callReporter(report.reporter_contact)"
                      class="call-btn"
                    />
                    <q-img
                      v-if="report.photo_url"
                      :src="report.photo_url"
                      style="width: 80px; height: 80px; border-radius: 8px"
                      fit="cover"
                      @error="handleImageError"
                      class="report-image"
                    />
                    <q-icon v-else name="image_not_supported" size="80px" color="grey-4" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-page-container>
    <FooterComponent class="footer" />
    <ToastNotification ref="toastRef" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { supabase } from 'src/boot/supabase'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import HeroSection from 'src/components/HeroSection.vue'
import { useRouter } from 'vue-router'
import ToastNotification from '../components/ToastNotification.vue'

export default {
  name: 'SearchReports',
  components: {
    NavBar,
    FooterComponent,
    HeroSection,
    ToastNotification,
  },
  setup() {
    const loading = ref(false)
    const reports = ref([])
    const router = useRouter()
    const currentStep = ref(0)
    const toastRef = ref(null)

    const searchQuery = ref({
      reportType: null,
      gender: null,
      age: null,
      date: null,
      location: null,
      name: null,
      description: null,
    })

    const genderOptions = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ]

    const selectReportType = (type) => {
      searchQuery.value.reportType = type
      nextStep()
    }

    const selectGender = (gender) => {
      searchQuery.value.gender = gender
      nextStep()
    }

    const nextStep = () => {
      if (currentStep.value < 6) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const handleSearch = async () => {
      if (!searchQuery.value.reportType) {
        toastRef.value?.showToast('Please select a report type', 'warning')
        return
      }

      loading.value = true
      try {
        // Log the search criteria
        console.log('Search Criteria:', {
          reportType: searchQuery.value.reportType,
          gender: searchQuery.value.gender,
          age: searchQuery.value.age,
          date: searchQuery.value.date,
          location: searchQuery.value.location,
          name: searchQuery.value.name,
          description: searchQuery.value.description,
        })

        // Query missing reports with reports join
        let missingQuery = supabase.from('missing_reports').select(`
            *,
            reports!inner (
              id,
              created_at,
              reporter_contact,
              reporter_name
            )
          `)

        // Query found reports with reports join
        let foundQuery = supabase.from('found_reports').select(`
            *,
            reports!inner (
              id,
              created_at,
              reporter_contact,
              reporter_name
            )
          `)

        // Apply filters to both queries
        if (searchQuery.value.reportType) {
          if (searchQuery.value.reportType === 'missing') {
            foundQuery = foundQuery.limit(0)
          } else if (searchQuery.value.reportType === 'found') {
            missingQuery = missingQuery.limit(0)
          }
        }

        if (searchQuery.value.gender) {
          missingQuery = missingQuery.eq('gender', searchQuery.value.gender)
          foundQuery = foundQuery.eq('gender', searchQuery.value.gender)
        }

        if (searchQuery.value.age) {
          const age = parseInt(searchQuery.value.age)
          const ageRange = 5 // Allow for 5 years difference
          missingQuery = missingQuery.gte('age', age - ageRange).lte('age', age + ageRange)
          foundQuery = foundQuery
            .gte('age_estimate', age - ageRange)
            .lte('age_estimate', age + ageRange)
        }

        if (searchQuery.value.date) {
          try {
            // Parse the date from DD/MM/YYYY format
            const [day, month, year] = searchQuery.value.date.split('/')
            const searchDate = new Date(year, month - 1, day)

            // Validate if the date is valid
            if (isNaN(searchDate.getTime())) {
              throw new Error('Invalid date format')
            }

            const dateRange = 7 // Allow for 7 days difference
            const startDate = new Date(searchDate)
            startDate.setDate(startDate.getDate() - dateRange)
            const endDate = new Date(searchDate)
            endDate.setDate(startDate.getDate() + dateRange)

            // Format dates for the query
            const formatDateForQuery = (date) => {
              return date.toISOString().split('T')[0] + 'T00:00:00'
            }

            missingQuery = missingQuery
              .filter('reports.created_at', 'gte', formatDateForQuery(startDate))
              .filter('reports.created_at', 'lte', formatDateForQuery(endDate))
            foundQuery = foundQuery
              .filter('reports.created_at', 'gte', formatDateForQuery(startDate))
              .filter('reports.created_at', 'lte', formatDateForQuery(endDate))
          } catch (error) {
            console.error('Error processing date:', error)
            toastRef.value?.showToast('Invalid date format. Please use DD/MM/YYYY', 'error')
            return
          }
        }

        if (searchQuery.value.location) {
          const location = searchQuery.value.location.trim()
          missingQuery = missingQuery.ilike('last_seen_location', `%${location}%`)
          foundQuery = foundQuery.ilike('found_location', `%${location}%`)
        }

        if (searchQuery.value.name) {
          const name = searchQuery.value.name.trim()
          missingQuery = missingQuery.ilike('missing_person_name', `%${name}%`)
          foundQuery = foundQuery.ilike('found_person_name', `%${name}%`)
        }

        if (searchQuery.value.description) {
          const description = searchQuery.value.description.trim()
          missingQuery = missingQuery.ilike('description', `%${description}%`)
          foundQuery = foundQuery.ilike('description', `%${description}%`)
        }

        // Execute both queries
        const [missingResult, foundResult] = await Promise.all([missingQuery, foundQuery])

        if (missingResult.error) {
          console.error('Missing reports error:', missingResult.error)
          throw missingResult.error
        }
        if (foundResult.error) {
          console.error('Found reports error:', foundResult.error)
          throw foundResult.error
        }

        // Log the results
        console.log('Missing Results:', missingResult.data)
        console.log('Found Results:', foundResult.data)

        // Process both sets of data
        const processReports = async (reports) => {
          if (!reports) return []
          return Promise.all(
            reports.map(async (report) => {
              const processedReport = {
                ...report,
                id: report.reports.id,
                created_at: report.reports.created_at,
                reporter_contact: report.reports.reporter_contact,
                reporter_name: report.reports.reporter_name,
                status: report.status,
                name: report.missing_person_name || report.found_person_name,
              }

              if (report.photo_url) {
                try {
                  if (report.photo_url.startsWith('http')) {
                    processedReport.photo_url = report.photo_url
                  } else {
                    const {
                      data: { publicUrl },
                    } = supabase.storage.from('missingimages').getPublicUrl(report.photo_url)
                    processedReport.photo_url = publicUrl
                  }
                } catch (error) {
                  console.error('Error processing photo URL:', error)
                }
              }

              return processedReport
            }),
          )
        }

        const [processedMissing, processedFound] = await Promise.all([
          processReports(missingResult.data),
          processReports(foundResult.data),
        ])

        // Combine and sort all reports by creation date
        reports.value = [...(processedMissing || []), ...(processedFound || [])].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )

        // Log final results
        console.log('Final Processed Results:', reports.value)

        // Show success toast with result count
        toastRef.value?.showToast(`Found ${reports.value.length} reports`, 'success')
      } catch (error) {
        console.error('Error searching reports:', error)
        toastRef.value?.showToast('Failed to search reports: ' + error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    const viewReport = (report) => {
      router.push({
        path: `/ReportDetails/${report.id}`,
        query: {
          imageUrl: report.photo_url,
        },
      })
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const getStatusColor = (status) => {
      const colors = {
        active: 'primary',
        resolved: 'positive',
        pending: 'warning',
      }
      return colors[status] || 'grey'
    }

    const handleImageError = (error) => {
      console.error('Image loading error:', error)
    }

    const getStepIcon = (step) => {
      const icons = ['search', 'wc', 'cake', 'event', 'place', 'badge', 'description']
      return icons[step]
    }

    const getStepLabel = (step) => {
      const labels = ['Type', 'Gender', 'Age', 'Date', 'Location', 'Name', 'Details']
      return labels[step]
    }

    const getGenderIcon = (gender) => {
      const icons = {
        male: 'male',
        female: 'female',
        other: 'wc',
      }
      return icons[gender]
    }

    const getStatusIcon = (status) => {
      const icons = {
        active: 'check_circle',
        resolved: 'verified',
        pending: 'pending',
      }
      return icons[status]
    }

    const goToStep = (stepIndex) => {
      // Only allow going back to completed steps or the current step
      if (stepIndex <= currentStep.value) {
        currentStep.value = stepIndex
      }
    }

    const hasInputForCurrentStep = computed(() => {
      switch (currentStep.value) {
        case 2: // Age step
          return !!searchQuery.value.age
        case 3: // Date step
          return !!searchQuery.value.date
        case 4: // Location step
          return !!searchQuery.value.location
        case 5: // Name step
          return !!searchQuery.value.name
        case 6: // Description step
          return !!searchQuery.value.description
        default:
          return true
      }
    })

    const callReporter = (phoneNumber) => {
      // Remove any non-numeric characters from the phone number
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      // Create the tel: link
      window.location.href = `tel:${cleanNumber}`
    }

    const resetSearch = () => {
      reports.value = []
      currentStep.value = 0
      searchQuery.value = {
        reportType: null,
        gender: null,
        age: null,
        date: null,
        location: null,
        name: null,
        description: null,
      }
    }

    return {
      loading,
      reports,
      currentStep,
      searchQuery,
      genderOptions,
      selectReportType,
      selectGender,
      nextStep,
      previousStep,
      handleSearch,
      viewReport,
      formatDate,
      getStatusColor,
      handleImageError,
      toastRef,
      getStepIcon,
      getStepLabel,
      getGenderIcon,
      getStatusIcon,
      goToStep,
      hasInputForCurrentStep,
      callReporter,
      resetSearch,
    }
  },
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f2f0e9;
  display: flex;
  flex-direction: column;
}

.navbar {
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  background-color: transparent;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  padding: 2rem;
}

.search-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.question-flow {
  max-width: 800px;
  margin: 0 auto;
}

.question-step {
  padding: 2rem 0;
  animation: slideIn 0.4s ease-out;
}

.question-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
}

.option-card {
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  overflow: hidden;
  animation: scaleIn 0.3s ease-out;
  animation-fill-mode: both;
  background: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
  background: #f8f9fa;
}

.option-card .text-h6 {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  width: 100%;
  text-align: center;
}

.option-card .text-subtitle2 {
  text-align: center;
  width: 100%;
  color: #666;
}

.reports-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.footer {
  width: 100%;
  margin-top: auto;
}

/* Input Styles */
:deep(.q-input) {
  max-width: 100%;
}

:deep(.q-field__native) {
  padding: 12px 0;
  font-size: 16px;
}

:deep(.q-field__label) {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

:deep(.q-field--focused .q-field__label) {
  color: #333;
}

:deep(.q-field__control) {
  border-radius: 8px;
  background: #f8f9fa;
}

:deep(.q-field--focused .q-field__control) {
  background: white;
  box-shadow: 0 0 0 2px #1976d2;
}

/* List Item Styles */
:deep(.q-item) {
  padding: 1.5rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid #eee;
}

:deep(.q-item:hover) {
  background-color: #f5f5f5;
}

:deep(.q-chip) {
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 20px;
}

:deep(.q-img) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

:deep(.q-list--bordered) {
  border: none;
}

:deep(.q-item__section--side) {
  padding-left: 1.5rem;
}

:deep(.q-item__label) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

:deep(.q-item__label--caption) {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* Status Colors */
:deep(.q-chip.primary) {
  background: #e3f2fd;
  color: #1976d2;
}

:deep(.q-chip.positive) {
  background: #e8f5e9;
  color: #2e7d32;
}

:deep(.q-chip.warning) {
  background: #fff3e0;
  color: #f57c00;
}

:deep(.q-chip.negative) {
  background: #ffebee;
  color: #c62828;
}

/* Loading Animation */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  animation: pulse 2s infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #666;
  font-size: 1.1rem;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* Mobile Layout */
@media (max-width: 768px) {
  .search-container {
    padding: 1rem;
  }

  .search-section {
    padding: 1.5rem;
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .progress-indicator {
    padding: 0.35rem;
    margin: 0 0 0.35rem 0;
    border-radius: 6px;
  }

  .progress-header {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    margin-bottom: 0.25rem;
    padding: 0.15rem 0.25rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .progress-title {
    font-size: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    padding: 0.1rem 0.2rem;
  }

  .progress-title .q-icon {
    font-size: 14px;
  }

  .progress-subtitle {
    font-size: 0.6rem;
    padding: 0.1rem 0.25rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .progress-steps {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    padding: 0.15rem;
    margin: 0;
  }

  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    max-width: 35px;
    padding: 0.1rem;
  }

  .step-icon {
    width: 18px;
    height: 18px;
    border-width: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-icon .q-icon {
    font-size: 10px;
  }

  .step-check {
    width: 8px;
    height: 8px;
    top: -2px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-check .q-icon {
    font-size: 5px;
  }

  .step-label {
    font-size: 0.55rem;
    position: static;
    transform: none;
    margin-top: 0.1rem;
    text-align: center;
    line-height: 1;
  }

  .reports-list {
    margin: 0;
    border-radius: 12px;
    overflow: hidden;
  }

  :deep(.q-card) {
    border-radius: 12px;
  }

  :deep(.q-item) {
    border-radius: 12px;
  }

  :deep(.q-chip) {
    border-radius: 12px;
  }

  :deep(.q-img) {
    border-radius: 12px;
  }

  :deep(.q-field__control) {
    border-radius: 12px;
  }

  .search-container {
    padding: 1rem;
  }

  .search-section {
    padding: 1.5rem;
    margin: 0;
    border-radius: 12px;
  }

  .question-title {
    font-size: 22px;
    margin-bottom: 1.5rem;
  }

  .option-card {
    padding: 1rem;
    min-height: 100px;
  }

  .option-card .text-h6 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .option-card .text-subtitle2 {
    font-size: 0.875rem;
  }

  .reports-list {
    margin: 0;
    border-radius: 12px;
  }
}

/* Tablet Layout */
@media (min-width: 769px) and (max-width: 1024px) {
  .search-container {
    padding: 1.5rem;
  }

  .search-section {
    padding: 2rem;
  }

  .question-title {
    font-size: 24px;
  }

  .option-card {
    margin-bottom: 1.5rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .option-card:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :deep(.q-btn) {
    padding: 12px 24px;
  }
}

.progress-indicator {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 2rem 3rem;
  margin: 0;
  background: #f8f9fa;
  border-radius: 12px;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 3rem;
  right: 3rem;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
  transform: translateY(-50%);
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
}

.step:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.step.completed:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.step.active:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.step.active .step-icon {
  border-color: #1976d2;
  background: #1976d2;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.2);
}

.step.completed .step-icon {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.step.upcoming .step-icon {
  border-color: #e0e0e0;
  background: white;
  color: #999;
}

.step-check {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;
}

.step-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: #1976d2;
  font-weight: 600;
}

.step.completed .step-label {
  color: #4caf50;
}

.step.upcoming .step-label {
  color: #999;
}

.results-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.results-section .text-h6 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.reports-list {
  margin-top: 1.5rem;
}

.report-item {
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #eee;
}

.report-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.call-btn {
  transition: all 0.3s ease;
  background: #1976d2;
}

.call-btn:hover {
  transform: scale(1.1);
  background: #1565c0;
}

.report-image {
  transition: all 0.3s ease;
  border: 2px solid #eee;
}

.report-image:hover {
  transform: scale(1.05);
  border-color: #1976d2;
}

@media (max-width: 768px) {
  .progress-indicator {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .progress-steps {
    padding: 1.5rem 1rem;
    margin: 0;
  }

  .progress-steps::before {
    left: 1rem;
    right: 1rem;
  }

  .step-icon {
    width: 36px;
    height: 36px;
  }

  .step-label {
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }

  .results-section {
    padding: 1rem;
  }

  .results-section .text-h6 {
    font-size: 1.25rem;
  }
}

.mobile-progress-toggle {
  display: none;
}
</style>

<style>
/* Remove all custom notification styles */
</style>
