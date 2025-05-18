<template>
  <q-page padding class="admin-reports">
    <ToastNotification ref="toast" />
    <div class="row items-center">
      <div class="text-h4 dashboard-title col">Report Management</div>
      <q-btn color="primary" class="create-btn" label="Add Report" @click="showAddDialog = true" />
    </div>

    <!-- Summary Dashboard -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Total Reports Card -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card">
          <q-card-section>
            <div class="text-h6">Total Reports</div>
            <div class="text-h4 q-mt-sm">{{ totalReports }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resolved Reports Card -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card">
          <q-card-section>
            <div class="text-h6">Resolved</div>
            <div class="text-h4 q-mt-sm">{{ resolvedReports }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Missing Reports Card -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card">
          <q-card-section>
            <div class="text-h6">Missing</div>
            <div class="text-h4 q-mt-sm">{{ missingReports }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Found Reports Card -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="summary-card">
          <q-card-section>
            <div class="text-h6">Found</div>
            <div class="text-h4 q-mt-sm">{{ foundReports }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-select
          v-model="filters.type"
          :options="reportTypes"
          label="Report Type"
          outlined
          dense
          emit-value
          map-options
          class="filter-select"
          @update:model-value="onFilter"
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
          class="filter-select"
          @update:model-value="onFilter"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchInput"
          label="Search by Name or ID"
          outlined
          dense
          clearable
          class="search-input"
          @update:model-value="onSearchInput"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-3">
        <q-input
          v-model="filters.startDate"
          label="Start Date"
          outlined
          dense
          clearable
          class="filter-select"
          @update:model-value="onFilter"
        >
          <template v-slot:append>
            <q-icon name="event" />
          </template>
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="filters.startDate" mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-input>
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="filters.endDate"
          label="End Date"
          outlined
          dense
          clearable
          class="filter-select"
          @update:model-value="onFilter"
        >
          <template v-slot:append>
            <q-icon name="event" />
          </template>
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="filters.endDate" mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-input>
      </div>
    </div>

    <!-- Reports Table -->
    <q-card class="reports-table-card">
      <div class="row q-pa-md items-center">
        <div class="col">
          <q-btn
            flat
            color="primary"
            icon="settings"
            label="Columns"
            @click="showColumnSettings = true"
          >
            <q-tooltip>Configure visible columns</q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-table
        :rows="reports"
        :columns="visibleColumns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        :rows-per-page-options="[10, 20, 50]"
        class="reports-table"
        virtual-scroll
        :virtual-scroll-sticky-size-start="48"
        :virtual-scroll-item-size="48"
        @row-click="viewReport"
      >
        <!-- Type Column -->
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.report_type === 'missing' ? 'negative' : 'positive'"
              text-color="white"
              dense
              class="type-chip"
            >
              {{ props.row.report_type }}
            </q-chip>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.report_status)"
              text-color="white"
              dense
              class="status-chip"
            >
              {{ props.row.report_status }}
            </q-chip>
          </q-td>
        </template>

        <!-- Photo URL Column -->
        <template v-slot:body-cell-photo_url="props">
          <q-td :props="props">
            <q-img
              v-if="props.row.photo_url"
              :src="props.row.photo_url"
              style="width: 50px; height: 50px"
              class="rounded-borders"
              loading="lazy"
              :ratio="1"
            />
            <span v-else>No photo</span>
          </q-td>
        </template>

        <!-- Description Column -->
        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            <div class="description-cell">
              {{ props.row.description }}
            </div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-group flat>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click.stop="deleteReport(props.row)"
                class="action-btn"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </template>

        <!-- Loading State -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </q-card>

    <!-- View Report Dialog -->
    <q-dialog v-model="showViewDialog" maximized>
      <q-card class="view-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">Report Details</div>
          <q-space />
          <q-btn v-if="!editMode" icon="edit" flat round dense @click="startEditInView" />
          <q-btn icon="close" flat round dense v-close-popup @click="cancelEditInView" />
        </q-card-section>
        <q-card-section v-if="selectedReport" class="q-pa-lg">
          <div class="row q-col-gutter-lg">
            <!-- Left Column: Photo and Basic Info -->
            <div class="col-12 col-md-4">
              <q-card class="photo-card">
                <q-img
                  :src="editMode ? viewEditForm.photo_url : selectedReport.photo_url"
                  :ratio="4 / 3"
                  class="report-image"
                  spinner-color="primary"
                  spinner-size="82px"
                >
                  <div class="absolute-bottom text-subtitle2 text-center bg-transparent">
                    {{
                      (editMode ? viewEditForm.report_type : selectedReport.report_type) ===
                      'missing'
                        ? 'Missing Person'
                        : 'Found Person'
                    }}
                  </div>
                </q-img>
              </q-card>
              <q-card class="q-mt-md">
                <q-card-section>
                  <div class="text-h6">Report Information</div>
                  <q-list class="report-info">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Report Type</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-select
                              v-model="viewEditForm.report_type"
                              :options="reportTypes.filter((rt) => rt.value)"
                              dense
                              emit-value
                              map-options
                            />
                          </template>
                          <template v-else>{{ selectedReport.report_type }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Status</q-item-label>
                        <q-item-label>
                          <template v-if="editMode">
                            <q-select
                              v-model="viewEditForm.report_status"
                              :options="statusOptions.filter((st) => st.value)"
                              dense
                              emit-value
                              map-options
                            />
                          </template>
                          <template v-else>
                            <q-chip
                              :color="getStatusColor(selectedReport.report_status)"
                              text-color="white"
                              dense
                            >
                              {{ selectedReport.report_status }}
                            </q-chip>
                          </template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Reporter</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.reporter_name" dense outlined />
                          </template>
                          <template v-else>{{ selectedReport.reporter_name }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Contact</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.reporter_contact" dense outlined />
                          </template>
                          <template v-else>{{ selectedReport.reporter_contact }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Created At</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.created_at" dense outlined readonly>
                              <template v-slot:append>
                                <q-icon name="event" />
                              </template>
                              <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-date v-model="viewEditForm.created_at" mask="YYYY-MM-DD" />
                              </q-popup-proxy>
                            </q-input>
                          </template>
                          <template v-else>{{
                            new Date(selectedReport.created_at).toLocaleString()
                          }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
            <!-- Right Column: Detailed Information -->
            <div class="col-12 col-md-8">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Person Details</div>
                  <q-list class="report-info">
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Name</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.person_name" dense outlined />
                          </template>
                          <template v-else>{{ selectedReport.person_name }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Age</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.age" dense outlined type="number" />
                          </template>
                          <template v-else>{{ selectedReport.age }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Gender</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.gender" dense outlined />
                          </template>
                          <template v-else>{{ selectedReport.gender }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Location</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.location" dense outlined />
                          </template>
                          <template v-else>{{ selectedReport.location }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Date</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input v-model="viewEditForm.date" dense outlined readonly>
                              <template v-slot:append>
                                <q-icon name="event" />
                              </template>
                              <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-date v-model="viewEditForm.date" mask="YYYY-MM-DD" />
                              </q-popup-proxy>
                            </q-input>
                          </template>
                          <template v-else>{{
                            new Date(selectedReport.date).toLocaleDateString()
                          }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Description</q-item-label>
                        <q-item-label class="text-weight-medium">
                          <template v-if="editMode">
                            <q-input
                              v-model="viewEditForm.description"
                              dense
                              outlined
                              type="textarea"
                            />
                          </template>
                          <template v-else>{{ selectedReport.description }}</template>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div v-if="editMode" class="q-mt-md flex justify-end">
                    <q-btn
                      flat
                      label="Cancel"
                      color="primary"
                      @click="cancelEditInView"
                      class="q-mr-sm"
                    />
                    <q-btn flat label="Save" color="primary" @click="saveEditInView" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Report Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Add New Report</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetAddForm" />
        </q-card-section>
        <q-form @submit.prevent="submitAddReport">
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="addForm.report_type"
              :options="reportTypes.filter((rt) => rt.value)"
              label="Report Type"
              outlined
              dense
              emit-value
              map-options
              required
            />
            <q-select
              v-model="addForm.report_status"
              :options="statusOptions.filter((st) => st.value)"
              label="Status"
              outlined
              dense
              emit-value
              map-options
              required
            />
            <q-input
              v-model="addForm.reporter_name"
              label="Reporter Name"
              outlined
              dense
              required
            />
            <q-input
              v-model="addForm.reporter_contact"
              label="Reporter Contact"
              outlined
              dense
              required
            />
            <q-input
              v-model="addForm.created_at"
              label="Created At"
              outlined
              dense
              required
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" />
              </template>
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="addForm.created_at" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-input>
            <!-- Subtype fields -->
            <template v-if="addForm.report_type === 'missing'">
              <q-input
                v-model="addForm.missing_person_name"
                label="Missing Person Name"
                outlined
                dense
                required
              />
              <q-input v-model="addForm.age" label="Age" type="number" outlined dense />
              <q-input v-model="addForm.gender" label="Gender" outlined dense />
              <q-input
                v-model="addForm.last_seen_location"
                label="Last Seen Location"
                outlined
                dense
              />
              <q-input
                v-model="addForm.last_seen_date"
                label="Last Seen Date"
                outlined
                dense
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="addForm.last_seen_date" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>
              <q-input
                v-model="addForm.description"
                label="Description"
                outlined
                dense
                type="textarea"
              />
              <q-input v-model="addForm.photo_url" label="Photo URL" outlined dense />
            </template>
            <template v-else-if="addForm.report_type === 'found'">
              <q-input
                v-model="addForm.found_person_name"
                label="Found Person Name"
                outlined
                dense
                required
              />
              <q-input
                v-model="addForm.age_estimate"
                label="Age Estimate"
                type="number"
                outlined
                dense
              />
              <q-input v-model="addForm.gender" label="Gender" outlined dense />
              <q-input v-model="addForm.found_location" label="Found Location" outlined dense />
              <q-input v-model="addForm.found_date" label="Found Date" outlined dense readonly>
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="addForm.found_date" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>
              <q-input
                v-model="addForm.description"
                label="Description"
                outlined
                dense
                type="textarea"
              />
              <q-input v-model="addForm.photo_url" label="Photo URL" outlined dense />
            </template>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetAddForm" />
            <q-btn flat label="Add" color="primary" type="submit" :loading="addLoading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Column Settings Dialog -->
    <q-dialog v-model="showColumnSettings">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Configure Columns</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item v-for="col in columns" :key="col.name" tag="label" v-ripple>
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="visibleColumnsMap[col.name]" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Reset" color="primary" @click="resetColumnVisibility" />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Report Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Report</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetEditForm" />
        </q-card-section>
        <q-form @submit.prevent="submitEditReport">
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="editForm.report_type"
              :options="reportTypes.filter((rt) => rt.value)"
              label="Report Type"
              outlined
              dense
              emit-value
              map-options
              required
            />
            <q-select
              v-model="editForm.report_status"
              :options="statusOptions.filter((st) => st.value)"
              label="Status"
              outlined
              dense
              emit-value
              map-options
              required
            />
            <q-input
              v-model="editForm.reporter_name"
              label="Reporter Name"
              outlined
              dense
              required
            />
            <q-input
              v-model="editForm.reporter_contact"
              label="Reporter Contact"
              outlined
              dense
              required
            />
            <q-input
              v-model="editForm.created_at"
              label="Created At"
              outlined
              dense
              required
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" />
              </template>
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="editForm.created_at" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-input>
            <!-- Subtype fields -->
            <template v-if="editForm.report_type === 'missing'">
              <q-input
                v-model="editForm.missing_person_name"
                label="Missing Person Name"
                outlined
                dense
                required
              />
              <q-input v-model="editForm.age" label="Age" type="number" outlined dense />
              <q-input v-model="editForm.gender" label="Gender" outlined dense />
              <q-input
                v-model="editForm.last_seen_location"
                label="Last Seen Location"
                outlined
                dense
              />
              <q-input
                v-model="editForm.last_seen_date"
                label="Last Seen Date"
                outlined
                dense
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="editForm.last_seen_date" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>
              <q-input
                v-model="editForm.description"
                label="Description"
                outlined
                dense
                type="textarea"
              />
              <q-input v-model="editForm.photo_url" label="Photo URL" outlined dense />
            </template>
            <template v-else-if="editForm.report_type === 'found'">
              <q-input
                v-model="editForm.found_person_name"
                label="Found Person Name"
                outlined
                dense
                required
              />
              <q-input
                v-model="editForm.age_estimate"
                label="Age Estimate"
                type="number"
                outlined
                dense
              />
              <q-input v-model="editForm.gender" label="Gender" outlined dense />
              <q-input v-model="editForm.found_location" label="Found Location" outlined dense />
              <q-input v-model="editForm.found_date" label="Found Date" outlined dense readonly>
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="editForm.found_date" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-input>
              <q-input
                v-model="editForm.description"
                label="Description"
                outlined
                dense
                type="textarea"
              />
              <q-input v-model="editForm.photo_url" label="Photo URL" outlined dense />
            </template>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetEditForm" />
            <q-btn flat label="Save" color="primary" type="submit" :loading="editLoading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from 'src/boot/supabase'
import { debounce } from 'quasar'
import ToastNotification from 'src/components/ToastNotification.vue'

export default {
  name: 'AdminReports',
  components: {
    ToastNotification,
  },
  setup() {
    const toast = ref(null)
    const reports = ref([])
    const loading = ref(false)
    const searchInput = ref('')
    const search = ref('')
    const showViewDialog = ref(false)
    const selectedReport = ref(null)
    const showAddDialog = ref(false)
    const addLoading = ref(false)
    const showEditDialog = ref(false)
    const editLoading = ref(false)
    const addForm = ref({
      report_type: '',
      report_status: '',
      reporter_name: '',
      reporter_contact: '',
      created_at: '',
      // missing subtype
      missing_person_name: '',
      age: '',
      gender: '',
      last_seen_location: '',
      last_seen_date: '',
      description: '',
      photo_url: '',
      // found subtype
      found_person_name: '',
      age_estimate: '',
      found_location: '',
      found_date: '',
    })
    const editForm = ref({
      id: null,
      report_type: '',
      report_status: '',
      reporter_name: '',
      reporter_contact: '',
      created_at: '',
      // missing subtype
      missing_person_name: '',
      age: '',
      gender: '',
      last_seen_location: '',
      last_seen_date: '',
      description: '',
      photo_url: '',
      // found subtype
      found_person_name: '',
      age_estimate: '',
      found_location: '',
      found_date: '',
    })

    const filters = ref({
      type: null,
      status: null,
      startDate: '',
      endDate: '',
    })

    const reportTypes = [
      { label: 'All Types', value: null },
      { label: 'Missing', value: 'missing' },
      { label: 'Found', value: 'found' },
    ]

    const statusOptions = [
      { label: 'All Status', value: null },
      { label: 'Open', value: 'open' },
      { label: 'Closed', value: 'closed' },
      { label: 'Resolved', value: 'resolved' },
    ]

    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'type', label: 'Type', field: 'report_type', align: 'center', sortable: true },
      {
        name: 'reporter',
        label: 'Reporter',
        field: 'reporter_name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'contact',
        label: 'Contact',
        field: 'reporter_contact',
        align: 'left',
        sortable: true,
      },
      {
        name: 'person_name',
        label: 'Person Name',
        field: 'person_name',
        align: 'left',
        sortable: true,
      },
      { name: 'age', label: 'Age', field: 'age', align: 'center', sortable: true },
      { name: 'gender', label: 'Gender', field: 'gender', align: 'center', sortable: true },
      { name: 'location', label: 'Location', field: 'location', align: 'left', sortable: true },
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      {
        name: 'description',
        label: 'Description',
        field: 'description',
        align: 'left',
        sortable: true,
      },
      { name: 'photo_url', label: 'Photo', field: 'photo_url', align: 'center' },
      { name: 'status', label: 'Status', field: 'report_status', align: 'center', sortable: true },
      {
        name: 'created_at',
        label: 'Created',
        field: 'created_at',
        format: (val) => new Date(val).toLocaleDateString(),
        align: 'left',
        sortable: true,
      },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
    ]

    const pagination = ref({
      sortBy: 'created_at',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    })

    const showColumnSettings = ref(false)
    const visibleColumnsMap = ref({})

    // Initialize visible columns map
    const initializeVisibleColumns = () => {
      columns.forEach((col) => {
        visibleColumnsMap.value[col.name] = true
      })
    }

    // Reset column visibility
    const resetColumnVisibility = () => {
      initializeVisibleColumns()
    }

    // Computed property for visible columns
    const visibleColumns = computed(() => {
      return columns.filter((col) => visibleColumnsMap.value[col.name])
    })

    // Summary statistics
    const totalReports = ref(0)
    const pendingReports = ref(0)
    const missingReports = ref(0)
    const foundReports = ref(0)
    const resolvedReports = ref(0)

    // Debounced search
    const debouncedSearch = debounce((val) => {
      search.value = val
      onSearch()
    }, 300)

    const onSearchInput = (val) => {
      debouncedSearch(val)
    }

    // Backend summary stats fetch for all filtered data
    const fetchSummaryStats = async () => {
      try {
        let query = supabase.from('reports').select(`
          id,
          report_type,
          report_status,
          missing_reports!left(missing_person_name),
          found_reports!left(found_person_name)
        `)

        if (filters.value.type) {
          query = query.eq('report_type', filters.value.type)
        }
        if (filters.value.status) {
          query = query.eq('report_status', filters.value.status)
        }
        if (search.value) {
          // Do not add any .or() or .filter() here for joined fields!
        }
        if (filters.value.startDate) {
          query = query.gte('created_at', filters.value.startDate + 'T00:00:00')
        }
        if (filters.value.endDate) {
          query = query.lte('created_at', filters.value.endDate + 'T23:59:59')
        }

        const { data, error } = await query
        if (error) throw error

        // Filter in JS for search by missing or found person name
        let filteredData = data
        if (search.value) {
          const searchLower = search.value.toLowerCase()
          filteredData = data.filter((report) => {
            const missingName = report.missing_reports?.missing_person_name?.toLowerCase() || ''
            const foundName = report.found_reports?.found_person_name?.toLowerCase() || ''
            return missingName.includes(searchLower) || foundName.includes(searchLower)
          })
        }
        totalReports.value = filteredData.length
        resolvedReports.value = filteredData.filter((r) => r.report_status === 'resolved').length
        missingReports.value = filteredData.filter((r) => r.report_type === 'missing').length
        foundReports.value = filteredData.filter((r) => r.report_type === 'found').length
      } catch (error) {
        console.error('Error fetching summary stats:', error)
      }
    }

    // Optimized fetch reports
    const fetchReports = async () => {
      loading.value = true
      try {
        let query = supabase.from('reports').select(
          `
            id,
            report_type,
            report_status,
            reporter_name,
            reporter_contact,
            created_at,
            user:users!reports_user_id_fkey(
              user_first_name,
              user_last_name
            ),
            missing_reports!left(
              missing_person_name,
              age,
              gender,
              last_seen_location,
              last_seen_date,
              description,
              photo_url
            ),
            found_reports!left(
              found_person_name,
              age_estimate,
              gender,
              found_location,
              found_date,
              description,
              photo_url
            )
          `,
          { count: 'exact' },
        )

        if (filters.value.type) {
          query = query.eq('report_type', filters.value.type)
        }

        if (filters.value.status) {
          query = query.eq('report_status', filters.value.status)
        }

        if (search.value) {
          // Do not add any .or() or .filter() here for joined fields!
        }

        if (filters.value.startDate) {
          query = query.gte('created_at', filters.value.startDate + 'T00:00:00')
        }
        if (filters.value.endDate) {
          query = query.lte('created_at', filters.value.endDate + 'T23:59:59')
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(
            (pagination.value.page - 1) * pagination.value.rowsPerPage,
            pagination.value.page * pagination.value.rowsPerPage - 1,
          )

        if (error) throw error

        // After fetching data, filter by missing or found person name in JS
        let filteredData = data
        if (search.value) {
          const searchLower = search.value.toLowerCase()
          filteredData = data.filter((report) => {
            const missingName = report.missing_reports?.missing_person_name?.toLowerCase() || ''
            const foundName = report.found_reports?.found_person_name?.toLowerCase() || ''
            return missingName.includes(searchLower) || foundName.includes(searchLower)
          })
        }
        reports.value = filteredData.map((report) => ({
          ...report,
          reporter_name: report.user
            ? `${report.user.user_first_name} ${report.user.user_last_name}`
            : report.reporter_name,
          person_name:
            report.report_type === 'missing'
              ? report.missing_reports?.missing_person_name
              : report.found_reports?.found_person_name,
          age:
            report.report_type === 'missing'
              ? report.missing_reports?.age
              : report.found_reports?.age_estimate,
          gender:
            report.report_type === 'missing'
              ? report.missing_reports?.gender
              : report.found_reports?.gender,
          location:
            report.report_type === 'missing'
              ? report.missing_reports?.last_seen_location
              : report.found_reports?.found_location,
          date:
            report.report_type === 'missing'
              ? report.missing_reports?.last_seen_date
              : report.found_reports?.found_date,
          description:
            report.report_type === 'missing'
              ? report.missing_reports?.description
              : report.found_reports?.description,
          photo_url:
            report.report_type === 'missing'
              ? report.missing_reports?.photo_url
              : report.found_reports?.photo_url,
        }))

        pagination.value.rowsNumber = count
      } catch (error) {
        console.error('Error fetching reports:', error)
        toast.value.showToast('Failed to fetch reports', 'error')
      } finally {
        loading.value = false
      }
    }

    const onRequest = (props) => {
      pagination.value = props.pagination
      fetchReports()
    }

    const onFilter = () => {
      pagination.value.page = 1
      fetchReports()
      fetchSummaryStats()
    }

    const onSearch = () => {
      pagination.value.page = 1
      fetchReports()
      fetchSummaryStats()
    }

    const getStatusColor = (status) => {
      const colors = {
        open: 'warning',
        resolved: 'positive',
        closed: 'negative',
      }
      return colors[status] || 'grey'
    }

    const viewReport = (evt, row) => {
      selectedReport.value = row
      showViewDialog.value = true
    }

    const updateStatus = async (report, newStatus) => {
      try {
        const { error } = await supabase
          .from('reports')
          .update({ report_status: newStatus })
          .eq('id', report.id)

        if (error) throw error

        toast.value.showToast(`Report ${newStatus} successfully`, 'success')
        fetchReports()
      } catch (error) {
        console.error('Error updating report status:', error)
        toast.value.showToast('Failed to update report status', 'error')
      }
    }

    const deleteReport = async (report) => {
      try {
        const { error } = await supabase.from('reports').delete().eq('id', report.id)

        if (error) throw error

        toast.value.showToast('Report deleted successfully', 'success')
        fetchReports()
      } catch (error) {
        console.error('Error deleting report:', error)
        toast.value.showToast('Failed to delete report', 'error')
      }
    }

    function resetAddForm() {
      addForm.value = {
        report_type: '',
        report_status: '',
        reporter_name: '',
        reporter_contact: '',
        created_at: '',
        missing_person_name: '',
        age: '',
        gender: '',
        last_seen_location: '',
        last_seen_date: '',
        description: '',
        photo_url: '',
        found_person_name: '',
        age_estimate: '',
        found_location: '',
        found_date: '',
      }
    }

    async function submitAddReport() {
      addLoading.value = true
      try {
        // Insert into reports table
        const baseReport = {
          report_type: addForm.value.report_type,
          report_status: addForm.value.report_status,
          reporter_name: addForm.value.reporter_name,
          reporter_contact: addForm.value.reporter_contact,
          created_at: addForm.value.created_at,
        }
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .insert([baseReport])
          .select()
        if (reportError) throw reportError
        // Insert into subtype table
        if (addForm.value.report_type === 'missing') {
          await supabase.from('missing_reports').insert([
            {
              report_id: reportData.id,
              missing_person_name: addForm.value.missing_person_name,
              age: addForm.value.age,
              gender: addForm.value.gender,
              last_seen_location: addForm.value.last_seen_location,
              last_seen_date: addForm.value.last_seen_date,
              description: addForm.value.description,
              photo_url: addForm.value.photo_url,
            },
          ])
        } else if (addForm.value.report_type === 'found') {
          await supabase.from('found_reports').insert([
            {
              report_id: reportData.id,
              found_person_name: addForm.value.found_person_name,
              age_estimate: addForm.value.age_estimate,
              gender: addForm.value.gender,
              found_location: addForm.value.found_location,
              found_date: addForm.value.found_date,
              description: addForm.value.description,
              photo_url: addForm.value.photo_url,
            },
          ])
        }
        toast.value.showToast('Report added successfully!', 'success')
        showAddDialog.value = false
        resetAddForm()
        fetchReports()
      } catch (error) {
        toast.value.showToast(error.message || 'Failed to add report', 'error')
      } finally {
        addLoading.value = false
      }
    }

    const editReport = (report) => {
      editForm.value = {
        id: report.id,
        report_type: report.report_type,
        report_status: report.report_status,
        reporter_name: report.reporter_name,
        reporter_contact: report.reporter_contact,
        created_at: report.created_at,
        // Set subtype fields based on report type
        ...(report.report_type === 'missing'
          ? {
              missing_person_name: report.person_name,
              age: report.age,
              gender: report.gender,
              last_seen_location: report.location,
              last_seen_date: report.date,
              description: report.description,
              photo_url: report.photo_url,
            }
          : {
              found_person_name: report.person_name,
              age_estimate: report.age,
              gender: report.gender,
              found_location: report.location,
              found_date: report.date,
              description: report.description,
              photo_url: report.photo_url,
            }),
      }
      showEditDialog.value = true
    }

    const resetEditForm = () => {
      editForm.value = {
        id: null,
        report_type: '',
        report_status: '',
        reporter_name: '',
        reporter_contact: '',
        created_at: '',
        missing_person_name: '',
        age: '',
        gender: '',
        last_seen_location: '',
        last_seen_date: '',
        description: '',
        photo_url: '',
        found_person_name: '',
        age_estimate: '',
        found_location: '',
        found_date: '',
      }
    }

    const submitEditReport = async () => {
      editLoading.value = true
      try {
        // Update main report
        const baseReport = {
          report_type: editForm.value.report_type,
          report_status: editForm.value.report_status,
          reporter_name: editForm.value.reporter_name,
          reporter_contact: editForm.value.reporter_contact,
          created_at: editForm.value.created_at,
        }

        const { error: reportError } = await supabase
          .from('reports')
          .update(baseReport)
          .eq('id', editForm.value.id)

        if (reportError) throw reportError

        // Update subtype table
        if (editForm.value.report_type === 'missing') {
          const { error: missingError } = await supabase
            .from('missing_reports')
            .update({
              missing_person_name: editForm.value.missing_person_name,
              age: editForm.value.age,
              gender: editForm.value.gender,
              last_seen_location: editForm.value.last_seen_location,
              last_seen_date: editForm.value.last_seen_date,
              description: editForm.value.description,
              photo_url: editForm.value.photo_url,
            })
            .eq('report_id', editForm.value.id)

          if (missingError) throw missingError
        } else if (editForm.value.report_type === 'found') {
          const { error: foundError } = await supabase
            .from('found_reports')
            .update({
              found_person_name: editForm.value.found_person_name,
              age_estimate: editForm.value.age_estimate,
              gender: editForm.value.gender,
              found_location: editForm.value.found_location,
              found_date: editForm.value.found_date,
              description: editForm.value.description,
              photo_url: editForm.value.photo_url,
            })
            .eq('found_report_id', editForm.value.id)

          if (foundError) throw foundError
        }

        toast.value.showToast('Report updated successfully!', 'success')
        showEditDialog.value = false
        resetEditForm()
        fetchReports()
      } catch (error) {
        toast.value.showToast(error.message || 'Failed to update report', 'error')
      } finally {
        editLoading.value = false
      }
    }

    const editMode = ref(false)
    const viewEditForm = ref({})

    const startEditInView = () => {
      editMode.value = true
      // Deep copy selectedReport to viewEditForm
      viewEditForm.value = JSON.parse(JSON.stringify(selectedReport.value))
      // Store the found_report_id if it exists
      if (selectedReport.value.found_reports) {
        viewEditForm.value.found_report_id = selectedReport.value.found_reports.id
      }
    }
    const cancelEditInView = () => {
      editMode.value = false
      viewEditForm.value = {}
    }
    const saveEditInView = async () => {
      try {
        // Update main report
        const baseReport = {
          report_type: viewEditForm.value.report_type,
          report_status: viewEditForm.value.report_status,
          reporter_name: viewEditForm.value.reporter_name,
          reporter_contact: viewEditForm.value.reporter_contact,
          created_at: viewEditForm.value.created_at,
        }
        const { error: reportError } = await supabase
          .from('reports')
          .update(baseReport)
          .eq('id', viewEditForm.value.id)
          .select()
        if (reportError) throw reportError

        // Update subtype table
        if (viewEditForm.value.report_type === 'missing') {
          const { error: missingError } = await supabase
            .from('missing_reports')
            .update({
              missing_person_name: viewEditForm.value.person_name,
              age: viewEditForm.value.age,
              gender: viewEditForm.value.gender,
              last_seen_location: viewEditForm.value.location,
              last_seen_date: viewEditForm.value.date,
              description: viewEditForm.value.description,
              photo_url: viewEditForm.value.photo_url,
            })
            .eq('report_id', viewEditForm.value.id)
          if (missingError) throw missingError
        } else if (viewEditForm.value.report_type === 'found') {
          // Create update data matching the exact structure from the database
          const updateData = {
            found_person_name: viewEditForm.value.person_name,
            age_estimate: parseInt(viewEditForm.value.age),
            gender: viewEditForm.value.gender,
            found_location: viewEditForm.value.location,
            found_date: viewEditForm.value.date,
            description: viewEditForm.value.description,
            photo_url: viewEditForm.value.photo_url,
          }

          // Use direct update with admin access
          const { error: foundError } = await supabase
            .from('found_reports')
            .update(updateData)
            .eq('found_report_id', viewEditForm.value.id)
            .select()

          if (foundError) throw foundError
        }

        toast.value.showToast('Report updated successfully!', 'success')
        editMode.value = false

        // Fetch fresh data after update
        await fetchReports()

        // Update selectedReport with fresh data
        const updatedReport = reports.value.find((r) => r.id === viewEditForm.value.id)
        if (updatedReport) {
          selectedReport.value = updatedReport
        }
      } catch (error) {
        toast.value.showToast(error.message || 'Failed to update report', 'error')
      }
    }

    onMounted(() => {
      initializeVisibleColumns()
      fetchReports()
      fetchSummaryStats()
    })

    // Watchers for date filters
    watch(
      () => filters.value.startDate,
      () => {
        onFilter()
      },
    )
    watch(
      () => filters.value.endDate,
      () => {
        onFilter()
      },
    )

    return {
      toast,
      reports,
      columns,
      loading,
      pagination,
      searchInput,
      filters,
      reportTypes,
      statusOptions,
      showViewDialog,
      selectedReport,
      showAddDialog,
      addForm,
      addLoading,
      showEditDialog,
      editLoading,
      editForm,
      onRequest,
      onFilter,
      onSearch,
      getStatusColor,
      viewReport,
      updateStatus,
      deleteReport,
      submitAddReport,
      resetAddForm,
      showColumnSettings,
      visibleColumnsMap,
      visibleColumns,
      resetColumnVisibility,
      totalReports,
      pendingReports,
      missingReports,
      foundReports,
      resolvedReports,
      onSearchInput,
      editReport,
      resetEditForm,
      submitEditReport,
      editMode,
      viewEditForm,
      startEditInView,
      cancelEditInView,
      saveEditInView,
    }
  },
}
</script>

<style lang="scss" scoped>
$main-bg: #f9fafd;
$card-bg: #fff;
$alt-row: #f3f6fa;
$border: #e3e8ef;
$primary: #2196f3;
$primary-hover: #1976d2;
$text: #222;
$text-light: #666;
$danger: #e53935;
$shadow: 0 2px 12px rgba(33, 150, 243, 0.07);

.admin-reports {
  background: $main-bg;
  min-height: 100vh;
  padding-bottom: 32px;
}

.dashboard-title {
  color: $text;
  font-weight: 700;
  margin-bottom: 2rem;
}

.filter-select,
.search-input {
  background: $card-bg;
  border-radius: 12px;
  color: $text;
  border: 1.5px solid $border;
  box-shadow: $shadow;
  margin-bottom: 1rem;
  transition:
    border 0.2s,
    box-shadow 0.2s;
  &:focus-within {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
}

.reports-table-card {
  background: $card-bg;
  border-radius: 18px;
  box-shadow: $shadow;
  overflow: hidden;
  margin-top: 24px;
  padding: 0 0 16px 0;
}

.reports-table {
  .q-table__top,
  .q-table__bottom {
    background: $main-bg;
    border-bottom: 1px solid $border;
    color: $text;
  }
  .q-table__bottom {
    border-top: 1px solid $border;
  }
  .q-table thead th {
    font-weight: 700;
    color: $text;
    background: $main-bg;
    border-bottom: 2px solid $border;
  }
  .q-table tbody tr {
    background: $card-bg;
    &:nth-child(even) {
      background: $alt-row;
    }
    &:hover {
      background: #f0f6ff;
    }
  }
  .q-table tbody td {
    color: $text;
    border-bottom: 1px solid $border;
    font-size: 1rem;
    padding: 12px 8px;
  }
}

.type-chip,
.status-chip {
  background: none !important;
  border: none !important;
  color: #2196f3 !important;
  font-weight: 700;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  font-size: inherit;
}

.action-btn {
  background: none !important;
  border: none !important;
  color: #2196f3 !important;
  min-width: 32px;
  min-height: 32px;
  font-size: inherit;
  border-radius: 50%;
  margin: 0 2px;
  transition: color 0.15s;
  &:hover {
    color: #1976d2 !important;
    background: none !important;
    transform: scale(1.08);
  }
  &.delete {
    color: #e53935 !important;
    &:hover {
      color: #b71c1c !important;
    }
  }
}

.create-btn {
  background: $primary;
  color: #fff;
  border-radius: 32px;
  font-weight: 700;
  font-size: 1.1em;
  padding: 12px 32px;
  box-shadow: $shadow;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
  &:hover {
    background: $primary-hover;
  }
}

.view-dialog {
  background: $card-bg;
  color: $text;
  border-radius: 18px;
  box-shadow: $shadow;
  .q-card-section {
    padding: 24px;
    background: $main-bg;
    border-radius: 18px 18px 0 0;
  }
}

.report-image {
  border-radius: 12px;
  box-shadow: $shadow;
}

.report-info {
  .q-item {
    padding: 12px 0;
    border-bottom: 1px solid $border;
    &:last-child {
      border-bottom: none;
    }
  }
  .q-item__label--caption {
    color: $text-light;
    font-size: 0.9em;
  }
}

// Responsive adjustments
@media (max-width: 900px) {
  .reports-table-card {
    border-radius: 0;
  }
}
@media (max-width: 600px) {
  .dashboard-title {
    font-size: 1.3rem;
  }
  .reports-table-card {
    margin: 0 -8px;
    border-radius: 0;
  }
  .filter-select,
  .search-input {
    font-size: 0.95em;
  }
}

.filter-select[readonly] {
  border-style: solid !important;
}

// Remove any dashed border globally for filter-select
.filter-select {
  border-style: solid !important;
}

.description-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Add styles for the column settings button
.q-btn {
  &.settings-btn {
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(33, 150, 243, 0.1);
    &:hover {
      background: rgba(33, 150, 243, 0.2);
    }
  }
}

.summary-card {
  background: $card-bg;
  border-radius: 12px;
  box-shadow: $shadow;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .text-h4 {
    font-weight: 700;
    color: $primary;
  }

  .text-h6 {
    color: $text-light;
  }
}

// Add styles for virtual scroll
.reports-table {
  .q-table__middle {
    max-height: calc(100vh - 400px);
  }
}

.reports-table {
  tbody tr {
    cursor: pointer;
    &:hover {
      background: #f0f6ff;
    }
  }
}

.view-dialog {
  .photo-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .report-image {
    border-radius: 12px;
  }

  .report-info {
    .q-item {
      padding: 12px 0;
      border-bottom: 1px solid $border;
      &:last-child {
        border-bottom: none;
      }
    }
    .q-item__label--caption {
      color: $text-light;
      font-size: 0.9em;
    }
  }
}
</style>
