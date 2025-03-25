<template>
  <div class="page-container">
    <NavBar class="navbar" />
    <HeroSection 
      title="Search Reports"
      subtitle="Find and filter all types of reports"
      background-image="/images/hero-bg.jpg"
    />
    <q-page-container>
      <div class="search-container q-pa-md">
        <!-- Filters Section -->
        <div class="filters-section q-mb-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.reportType"
                :options="reportTypes"
                label="Report Type"
                outlined
                dense
                emit-value
                map-options
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                label="Status"
                outlined
                dense
                emit-value
                map-options
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filters.dateRange"
                label="Date Range"
                outlined
                dense
                clearable
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filters.dateRange" range>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="filters.search"
                label="Search by ID or Description"
                outlined
                dense
                clearable
                @update:model-value="handleSearch"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section">
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
          <div v-else-if="reports.length === 0" class="text-center q-pa-md">
            <q-icon name="search_off" size="48px" color="grey-5" class="q-mb-sm" />
            <p class="text-h6 text-grey-7">No reports found</p>
            <p class="text-subtitle1 text-grey-6">Try adjusting your filters</p>
          </div>
          <div v-else class="reports-list">
            <q-list bordered separator>
              <q-item v-for="report in reports" :key="report.id" clickable @click="viewReport(report)">
                <q-item-section>
                  <q-item-label class="text-h6">{{ report.missing_person_name || report.found_person_name }}</q-item-label>
                  <q-item-label caption>
                    Report ID: {{ report.id }} | Status: {{ report.status }}
                  </q-item-label>
                  <q-item-label caption>
                    Created: {{ formatDate(report.created_at) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-md">
                    <q-chip
                      :color="getStatusColor(report.status)"
                      text-color="white"
                    >
                      {{ report.status }}
                    </q-chip>
                    <q-img
                      v-if="report.photo_url"
                      :src="report.photo_url"
                      style="width: 80px; height: 80px; border-radius: 8px;"
                      fit="cover"
                      @error="handleImageError"
                    />
                    <q-icon
                      v-else
                      name="image_not_supported"
                      size="80px"
                      color="grey-4"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-page-container>
    <FooterComponent class="footer" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { supabase } from 'src/boot/supabase';
import NavBar from 'src/components/NavBar.vue';
import FooterComponent from 'src/components/Footer.vue';
import HeroSection from 'src/components/HeroSection.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'SearchReports',
  components: {
    NavBar,
    FooterComponent,
    HeroSection
  },
  setup() {
    const $q = useQuasar();
    const loading = ref(false);
    const reports = ref([]);
    const router = useRouter();

    const filters = ref({
      reportType: null,
      status: null,
      dateRange: null,
      search: ''
    });

    const reportTypes = [
      { label: 'Missing Person', value: 'missing' },
      { label: 'Found Person', value: 'found' }
    ];

    const statusOptions = [
      { label: 'Active', value: 'active' },
      { label: 'Resolved', value: 'resolved' },
      { label: 'Pending', value: 'pending' }
    ];

    const handleSearch = async () => {
      loading.value = true;
      try {
        console.log('Starting search with filters:', filters.value);

        // Query missing reports with reports join
        let missingQuery = supabase
          .from('missing_reports')
          .select(`
            *,
            reports!inner (
              id,
              created_at
            )
          `);

        // Query found reports with reports join
        let foundQuery = supabase
          .from('found_reports')
          .select(`
            *,
            reports!inner (
              id,
              created_at
            )
          `);

        // Apply filters to both queries
        if (filters.value.reportType) {
          console.log('Applying report type filter:', filters.value.reportType.value);
          if (filters.value.reportType.value === 'missing') {
            foundQuery = foundQuery.limit(0); // Don't get found reports
          } else if (filters.value.reportType.value === 'found') {
            missingQuery = missingQuery.limit(0); // Don't get missing reports
          }
        }

        if (filters.value.status) {
          console.log('Applying status filter:', filters.value.status.value);
          missingQuery = missingQuery.eq('status', filters.value.status.value);
          foundQuery = foundQuery.eq('status', filters.value.status.value);
        }

        if (filters.value.dateRange) {
          console.log('Applying date range filter:', filters.value.dateRange);
          const [startDate, endDate] = filters.value.dateRange.split(' to ');
          missingQuery = missingQuery.gte('created_at', startDate).lte('created_at', endDate);
          foundQuery = foundQuery.gte('created_at', startDate).lte('created_at', endDate);
        }

        if (filters.value.search) {
          console.log('Applying search filter:', filters.value.search);
          missingQuery = missingQuery.or(`description.ilike.%${filters.value.search}%`);
          foundQuery = foundQuery.or(`description.ilike.%${filters.value.search}%`);
        }

        console.log('Executing queries...');
        // Execute both queries
        const [missingResult, foundResult] = await Promise.all([
          missingQuery,
          foundQuery
        ]);

        console.log('Missing Reports Result:', missingResult);
        console.log('Found Reports Result:', foundResult);

        if (missingResult.error) {
          console.error('Missing Reports Error:', missingResult.error);
          throw missingResult.error;
        }
        if (foundResult.error) {
          console.error('Found Reports Error:', foundResult.error);
          throw foundResult.error;
        }

        // Process both sets of data
        const processReports = async (reports) => {
          if (!reports) {
            console.log('No reports to process');
            return [];
          }
          console.log('Processing reports:', reports);
          return Promise.all(reports.map(async (report) => {
            const processedReport = {
              ...report,
              id: report.reports.id,
              created_at: report.reports.created_at,
              status: report.reports.status,
              name: report.missing_person_name || report.found_person_name
            };

            if (report.photo_url) {
              try {
                console.log('Processing photo URL for report:', processedReport);
                const { data: signedUrl } = await supabase.storage
                  .from('missingimages')
                  .createSignedUrl(report.photo_url, 3600);
                processedReport.photo_url = signedUrl.signedUrl;
              } catch (error) {
                console.error('Error processing photo URL:', error);
              }
            }

            return processedReport;
          }));
        };

        const [processedMissing, processedFound] = await Promise.all([
          processReports(missingResult.data),
          processReports(foundResult.data)
        ]);

        console.log('Processed Missing Reports:', processedMissing);
        console.log('Processed Found Reports:', processedFound);

        // Combine and sort all reports by creation date
        reports.value = [...(processedMissing || []), ...(processedFound || [])].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        console.log('Final Combined Reports:', reports.value);
      } catch (error) {
        console.error('Error searching reports:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to search reports'
        });
      } finally {
        loading.value = false;
      }
    };

    const viewReport = (report) => {
      // Navigate to the ReportDetails page with the report ID and image URL
      router.push({ 
        path: `/ReportDetails/${report.id}`, 
        query: { 
          imageUrl: report.photo_url // Pass the image URL as a query parameter
        } 
      });
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    const getStatusColor = (status) => {
      const colors = {
        active: 'primary',
        resolved: 'positive',
        pending: 'warning'
      };
      return colors[status] || 'grey';
    };

    const exportResults = () => {
      // Implement export functionality
      console.log('Export reports:', reports.value);
    };

    const handleImageError = (error) => {
      console.error('Image loading error:', error);
      // You can add additional error handling here if needed
    };

    onMounted(() => {
      handleSearch();
    });

    return {
      loading,
      reports,
      filters,
      reportTypes,
      statusOptions,
      handleSearch,
      viewReport,
      formatDate,
      getStatusColor,
      exportResults,
      handleImageError,
      NavBar,
      FooterComponent
    };
  }
};
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
  padding-top: 2rem;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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

:deep(.q-field__native) {
  padding: 8px 0;
}


:deep(.q-field__label) {
  font-size: 14px;
  color: #666;
}

:deep(.q-field--focused .q-field__label) {
  color: #333;
}

:deep(.q-item) {
  padding: 16px;
  transition: all 0.3s ease;
}

:deep(.q-item:hover) {
  background-color: #f5f5f5;
}

:deep(.q-chip) {
  font-weight: 500;
  padding: 4px 12px;
}

:deep(.q-img) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.q-list--bordered) {
  border: none;
}

:deep(.q-item__section--side) {
  padding-left: 16px;
}

:deep(.q-item__label) {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

:deep(.q-item__label--caption) {
  color: #666;
  font-size: 13px;
}



:deep(.filters-section .q-field--focused) {
  border-color: #00bfff;
}
</style> 