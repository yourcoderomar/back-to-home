<template>
  <div :class="{ blurred: showForm }">
    <NavBar />
    <q-page-container>
      <HeroSection :title="'Search for a Missing Person'" />

      <div class="cta-container">
        <h2>Search for a Missing Person :</h2>
        <ul>
          <li>
            <span>Check for Matches:</span> Before filing a new report, see if someone matching your
            missing person's details is already in our database.
          </li>
          <li>
            <span>Provide Key Information:</span> Enter details such as name, age, last known
            location, and any distinguishing features to improve search accuracy.
          </li>
          <li>
            <span>Save Time & Act Fast:</span> If a match is found, you can quickly connect with the
            relevant report and take action immediately.
          </li>
        </ul>

        <h2>How It Works :</h2>
        <ul>
          <li>
            <span>Enter Details:</span> Provide as much information as possible about the missing
            person.
          </li>
          <li>
            <span>Search Our Database:</span> Our system will compare your report with existing
            cases to find potential matches.
          </li>
          <li>
            <span>Get Instant Results:</span> If a match is found, you'll receive details on how to
            proceed.
          </li>
        </ul>

        <h2>Start Your Search Now!</h2>
        <p>
          Before submitting a new report, check if the person you're looking for is already in our
          records. Every second matters.
        </p>
        <q-btn label="Search Now" @click="showForm = true" class="submit" />
      </div>

      <!-- Form Dialog -->
      <q-dialog v-model="showForm" persistent>
        <div class="form-container">
          <ReusableForm
            :title="'Report Missing Person'"
            :message="'Please fill out the form to proceed.'"
            :fields="fields"
            :initialValues="formValues"
            :link-text="'Already filled a report?'"
            :link-to="'/'"
            :loading="isLoading"
            @formSubmitted="handleFormSubmission"
            @closeForm="showForm = false"
            class="form"
          />
        </div>
      </q-dialog>
    </q-page-container>
    <FooterComponent />
    <ToastNotification ref="toast" />
  </div>
</template>

<script>
import { supabase } from 'src/boot/supabase'
import ReusableForm from 'components/ReusableForm.vue'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from '../components/Footer.vue'
import HeroSection from 'src/components/HeroSection.vue'
import ToastNotification from 'components/ToastNotification.vue'

export default {
  name: 'ReportMissing',
  components: {
    ReusableForm,
    NavBar,
    FooterComponent,
    HeroSection,
    ToastNotification,
  },
  data() {
    return {
      showForm: false,
      isLoading: false,
      formValues: {
        report_type: 'missing', // Auto-set
        reporter_name: '',
        reporter_contact: '',
        user_id: '',
        missing_person_name: '',
        age: '',
        gender: '',
        last_seen_location: '',
        last_seen_date: '',
        description: '',
        photo_url: null,
        created_at: new Date().toISOString(),
      },
      fields: [
        {
          name: 'reporter_name',
          label: 'Your Name',
          type: 'text',
          required: true,
          width: '100%',
          rules: [
            (val) => !!val || 'Name is required',
            (val) => val.length >= 2 || 'Name must be at least 2 characters',
            (val) => /^[a-zA-Z\s]*$/.test(val) || 'Name can only contain letters and spaces',
          ],
        },
        {
          name: 'reporter_contact',
          label: 'Your Contact',
          type: 'text',
          required: true,
          width: '100%',
          rules: [
            (val) => !!val || 'Contact is required',
            (val) =>
              /^[0-9+\-\s()]*$/.test(val) || 'Contact can only contain numbers and basic symbols',
            (val) => val.length >= 10 || 'Contact must be at least 10 characters',
          ],
        },
        {
          name: 'missing_person_name',
          label: 'Missing Person Name',
          type: 'text',
          required: true,
          width: '100%',
          rules: [
            (val) => !!val || 'Name is required',
            (val) => val.length >= 2 || 'Name must be at least 2 characters',
            (val) => /^[a-zA-Z\s]*$/.test(val) || 'Name can only contain letters and spaces',
          ],
        },
        {
          name: 'age',
          label: 'Age',
          type: 'number',
          width: '40%',
          rules: [
            (val) => !!val || 'Age is required',
            (val) => (val > 0 && val < 150) || 'Enter a valid age between 1 and 150',
            (val) => Number.isInteger(Number(val)) || 'Age must be a whole number',
          ],
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: ['male', 'female'],
          width: '40%',
          rules: [
            (val) => !!val || 'Gender is required',
            (val) => ['male', 'female'].includes(val) || 'Please select a valid gender',
          ],
          style: 'text-transform: capitalize;',
          optionsDense: true,
          optionsSelectedClass: 'text-primary',
          emitValue: true,
          mapOptions: true,
          popupContentClass: 'gender-popup-width',
        },
        {
          name: 'last_seen_location',
          label: 'Last Seen Location',
          type: 'text',
          width: '100%',
          rules: [
            (val) => !!val || 'Location is required',
            (val) => val.length >= 3 || 'Location must be at least 3 characters',
            (val) =>
              /^[a-zA-Z0-9\s,.-]*$/.test(val) ||
              'Location can only contain letters, numbers, and basic punctuation',
          ],
        },
        {
          name: 'last_seen_date',
          label: 'Last Seen Date',
          type: 'date',
          width: '100%',
          rules: [
            (val) => !!val || 'Date is required',
            (val) => {
              const selectedDate = new Date(val)
              const today = new Date()
              return selectedDate <= today || 'Date cannot be in the future'
            },
          ],
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          width: '100%',
          rules: [
            (val) => !!val || 'Description is required',
            (val) => val.length >= 10 || 'Description must be at least 10 characters',
            (val) => val.length <= 1000 || 'Description cannot exceed 1000 characters',
          ],
        },
        {
          name: 'photo_url',
          label: 'Upload Image',
          type: 'file',
          width: '100%',
          rules: [
            (val) => {
              if (!val) return true // Optional field
              const file = val
              const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
              return validTypes.includes(file.type) || 'Only JPG, JPEG & PNG files are allowed'
            },
            (val) => {
              if (!val) return true // Optional field
              const file = val
              const maxSize = 5 * 1024 * 1024 // 5MB
              return file.size <= maxSize || 'File size must be less than 5MB'
            },
          ],
        },
      ],
    }
  },
  async created() {
    // Get user ID from session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error.message)
      this.$refs.toast.showToast('Please log in to submit a report.', 'error')
      // Optionally redirect to login page
      this.$router.push('/SignIn')
      return
    }
    if (user) {
      this.formValues.user_id = user.id
    }
  },
  methods: {
    async handleFormSubmission(formData) {
      try {
        this.isLoading = true
        let imageUrl = null

        if (formData.photo_url) {
          const file = formData.photo_url

          if (!(file instanceof File)) {
            this.$refs.toast.showToast('Invalid image file. Please try again.', 'error')
            this.isLoading = false
            return
          }

          // First insert the report to get the report_id
          const reportDataToInsert = {
            report_type: formData.report_type,
            reporter_name: formData.reporter_name,
            reporter_contact: formData.reporter_contact,
            report_status: 'open',
            user_id: formData.user_id,
            created_at: formData.created_at,
          }

          const { data: insertedReport, error: reportInsertError } = await supabase
            .from('reports')
            .insert([reportDataToInsert])
            .select()

          if (reportInsertError) {
            this.$refs.toast.showToast('Failed to submit report. Please try again.', 'error')
            this.isLoading = false
            return
          }

          // Upload image with report_id and user_id in filename
          const fileExt = file.name.split('.').pop()
          const fileName = `report_${insertedReport[0].id}_user_${formData.user_id}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('missingimages')
            .upload(fileName, file)

          if (uploadError) {
            this.$refs.toast.showToast('Failed to upload image. Please try again.', 'error')
            this.isLoading = false
            return
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('missingimages').getPublicUrl(fileName)

          if (!publicUrl) {
            this.$refs.toast.showToast('Failed to process image. Please try again.', 'error')
            this.isLoading = false
            return
          }

          imageUrl = publicUrl

          // Insert into missing_reports
          const missingReportData = {
            missing_report_id: insertedReport[0].id,
            missing_person_name: formData.missing_person_name,
            age: formData.age,
            gender: formData.gender,
            last_seen_location: formData.last_seen_location,
            last_seen_date: formData.last_seen_date,
            description: formData.description,
            photo_url: imageUrl,
          }

          const { error: missingReportInsertError } = await supabase
            .from('missing_reports')
            .insert([missingReportData])

          if (missingReportInsertError) {
            this.$refs.toast.showToast(
              'Failed to submit report details. Please try again.',
              'error',
            )
            this.isLoading = false
            return
          }
        } else {
          // If no image, proceed with normal report submission
          const reportDataToInsert = {
            report_type: formData.report_type,
            reporter_name: formData.reporter_name,
            reporter_contact: formData.reporter_contact,
            report_status: 'open',
            user_id: formData.user_id,
            created_at: formData.created_at,
          }

          const { data: insertedReport, error: reportInsertError } = await supabase
            .from('reports')
            .insert([reportDataToInsert])
            .select()

          if (reportInsertError) {
            this.$refs.toast.showToast('Failed to submit report. Please try again.', 'error')
            this.isLoading = false
            return
          }

          const missingReportData = {
            missing_report_id: insertedReport[0].id,
            missing_person_name: formData.missing_person_name,
            age: formData.age,
            gender: formData.gender,
            last_seen_location: formData.last_seen_location,
            last_seen_date: formData.last_seen_date,
            description: formData.description,
            photo_url: null,
          }

          const { error: missingReportInsertError } = await supabase
            .from('missing_reports')
            .insert([missingReportData])

          if (missingReportInsertError) {
            this.$refs.toast.showToast(
              'Failed to submit report details. Please try again.',
              'error',
            )
            this.isLoading = false
            return
          }
        }

        this.$refs.toast.showToast('Report submitted successfully!', 'success')
        this.showForm = false
      } catch {
        this.$refs.toast.showToast('Failed to submit report. Please try again.', 'error')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
.blurred {
  filter: blur(2px);
  pointer-events: none;
  user-select: none;
}

.form-container {
  background: transparent;
  border-radius: 12px;
}

.form-container::-webkit-scrollbar {
  display: none;
}

.cta-container {
  text-align: left;
  padding: 5vw; /* Responsive padding */
  margin: auto;
  background-color: #49596b;
}

/* Headings */
.cta-container h2,
.cta-container h3 {
  color: #f2f0e9;
  font-size: 2.7vw; /* Responsive font size */
  font-weight: bold;
  margin-bottom: 1vw;
}

/* List Items */
.cta-container ul {
  padding: 0;
}

.cta-container ul li {
  color: #f2f0e9;
  font-size: 1.3vw; /* Responsive font size */
  margin-bottom: 1vw;
}

/* Paragraph */
.cta-container p {
  color: #f2f0e9;
  font-size: 1.2vw; /* Responsive font size */
  margin-bottom: 2vw;
}

/* Button */
.q-btn {
  font-size: 1.5vw; /* Responsive font size */
  padding: 1vw 2vw;
}

/* Media Queries */
@media (max-width: 1024px) {
  .cta-container h2,
  .cta-container h3 {
    font-size: 3.5vw;
  }

  .cta-container ul li {
    font-size: 2vw;
  }

  .cta-container p {
    font-size: 1.8vw;
  }

  .q-btn {
    font-size: 2.5vw;
  }
}

@media (max-width: 768px) {
  .cta-container {
    padding: 6vw;
  }

  .cta-container h2,
  .cta-container h3 {
    font-size: 4vw;
  }

  .cta-container ul li {
    font-size: 2.2vw;
  }

  .cta-container p {
    font-size: 2vw;
  }

  .q-btn {
    font-size: 3vw;
  }
}

@media (max-width: 480px) {
  .cta-container {
    padding: 8vw;
  }

  .cta-container h2,
  .cta-container h3 {
    font-size: 5vw;
  }

  .cta-container ul li {
    font-size: 2.5vw;
  }

  .cta-container p {
    font-size: 2.5vw;
  }

  .q-btn {
    font-size: 3.5vw;
  }
}

/* Add these new styles */
:deep(.gender-select) {
  width: 100%;
}

:deep(.gender-menu) {
  min-width: 100px !important;
  max-width: 200px !important;
}

:deep(.gender-popup-width) {
  min-width: 120px !important;
  max-width: 220px !important;
  width: 180px !important;
}
</style>
