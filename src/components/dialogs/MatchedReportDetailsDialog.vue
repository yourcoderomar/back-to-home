<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="matched-report-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Match Details</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <!-- Missing Person Section -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">Missing Person</div>
            <q-img
              :src="report.missing_image_path"
              :ratio="1"
              class="rounded-borders"
              spinner-color="primary"
              spinner-size="24px"
            />
            <div class="text-center q-mt-sm text-weight-medium">
              {{ report.missing_reports?.missing_person_name || 'Unknown Person' }}
            </div>
            <div class="text-center q-mt-sm">
              <q-btn
                flat
                color="primary"
                label="View Missing Report"
                @click="viewMissingReport"
                class="full-width"
              />
            </div>
          </div>

          <!-- Found Person Section -->
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">Found Person</div>
            <q-img
              :src="report.found_image_path"
              :ratio="1"
              class="rounded-borders"
              spinner-color="primary"
              spinner-size="24px"
            />
            <div class="text-center q-mt-sm text-weight-medium">
              {{ report.found_reports?.found_person_name || 'Unknown Person' }}
            </div>
            <div class="text-center q-mt-sm">
              <q-btn
                flat
                color="primary"
                label="View Found Report"
                @click="viewFoundReport"
                class="full-width"
              />
            </div>
          </div>
        </div>

        <!-- Match Details -->
        <div class="q-mt-lg">
          <div class="text-subtitle2 q-mb-sm">Match Information</div>
          <q-list dense>
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
                <q-item-label caption>Status</q-item-label>
                <q-item-label>
                  <q-badge :color="getStatusColor(report.status)" :label="report.status" />
                </q-item-label>
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
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  report: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
  },
)

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

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

// View report functions
const viewMissingReport = () => {
  router.push({
    path: `/ReportDetails/${props.report.missing_report_id}`,
    query: { imageUrl: props.report.missing_image_path },
  })
}

const viewFoundReport = () => {
  router.push({
    path: `/ReportDetails/${props.report.found_report_id}`,
    query: { imageUrl: props.report.found_image_path },
  })
}
</script>

<style scoped>
.matched-report-dialog {
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
}

.matched-report-dialog .q-card-section {
  padding: 20px;
}

.matched-report-dialog .text-h6 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #49596b;
}

.matched-report-dialog .text-subtitle2 {
  font-weight: 600;
  color: #49596b;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 8px;
}

.matched-report-dialog .text-subtitle2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #00bfff;
}

.matched-report-dialog .q-img {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.matched-report-dialog .q-item {
  padding: 8px 0;
}

.matched-report-dialog .q-item__label {
  font-size: 1rem;
  color: #49596b;
}

.matched-report-dialog .q-item__label--caption {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
}

.matched-report-dialog .q-btn {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.matched-report-dialog .q-btn:hover {
  background: #f2f0e9;
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .matched-report-dialog {
    margin: 16px;
  }

  .matched-report-dialog .q-card-section {
    padding: 16px;
  }
}
</style>
