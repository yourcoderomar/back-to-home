<template>
  <div :class="{ 'blurred': showForm }">
    <NavBar />
    <q-page-container>
      <HeroSection :title="'Report a Missing Person'" />

      <div class="cta-container">
        <h2>Why Your Report Matters:</h2>
        <ul>
          <li>
            <span>Time is Critical:</span> The sooner a missing person is reported, the higher the chances of finding them. Every second counts.
          </li>
          <li>
            <span>Every Detail Helps:</span> Even the smallest piece of information—like the last known location, clothing, or recent activity—can be crucial in a search effort.
          </li>
          <li>
            <span>A Community Effort:</span> When communities come together, missing persons are found faster. Your report could be the key to reuniting a family.
          </li>
        </ul>

        <h2>What You Can Do:</h2>
        <ul>
          <li>
            <span>Report Immediately:</span> If someone you know has gone missing, don't wait—file a report as soon as possible.
          </li>
          <li>
            <span>Share Any Information:</span> If you have seen or heard anything that could help locate a missing person, your input is valuable.
          </li>
          <li>
            <span>Don't Hesitate:</span> Even if you are unsure whether the information is relevant, it's better to report than to stay silent. Your details could be the missing piece.
          </li>
        </ul>

        <h2>Take Action Now!</h2>
        <p>If you have any details about a missing person, please submit a report. Every report is reviewed with urgency, and your information could make a life-changing difference.</p>
        <q-btn label="Report Now" @click="showForm = true" class="submit" />
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
import { supabase } from 'src/boot/supabase';
import ReusableForm from 'components/ReusableForm.vue';
import NavBar from 'src/components/NavBar.vue';
import FooterComponent from '../components/Footer.vue';
import HeroSection from 'src/components/HeroSection.vue';
import ToastNotification from 'components/ToastNotification.vue'

export default {
  name: 'ReportMissing',
  components: {
    ReusableForm,
    NavBar,
    FooterComponent,
    HeroSection,
    ToastNotification
  },
  data() {
    return {
      showForm: false,
      formValues: {
        report_type: "missing", // Auto-set
        reporter_name: "",
        reporter_contact: "",
        reporter_status: "",
        user_id: "",
        missing_person_name: "",
        age: "",
        gender: "",
        last_seen_location: "",
        last_seen_date: "",
        description: "",
        photo_url: null, // Changed from report_image to photo_url
        created_at: new Date().toISOString(),
      },
      fields: [
        { name: 'reporter_name', label: 'Your Name', type: 'text', required: true, width: '100%', rules: [val => !!val || 'Name is required'] },
        { name: 'reporter_contact', label: 'Your Contact', type: 'text', required: true, width: '100%', rules: [val => !!val || 'Contact is required'] },
        { name: 'reporter_status', label: 'Your Status', type: 'text', width: '100%', rules: [val => !!val || 'Status is required'] },
        { name: 'missing_person_name', label: 'Missing Person Name', type: 'text', required: true, width: '100%', rules: [val => !!val || 'Name is required'] },
        { name: 'age', label: 'Age', type: 'number', width: '40%', rules: [val => !!val || 'Age is required', val => (val > 0 && val < 150) || 'Enter a valid age'] },
        { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'memale'], width: '40%', rules: [val => !!val || 'Gender is required'] },
        { name: 'last_seen_location', label: 'Last Seen Location', type: 'text', width: '100%', rules: [val => !!val || 'Location is required'] },
        { name: 'last_seen_date', label: 'Last Seen Date', type: 'date', width: '100%', rules: [val => !!val || 'Date is required'] },
        { name: 'description', label: 'Description', type: 'textarea', width: '100%', rules: [val => !!val || 'Description is required'] },
        { name: 'photo_url', label: 'Upload Image', type: 'file', width: '100%' },
      ],
    };
  },
  async created() {
    // Get user ID from session
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      this.$refs.toast.showToast('Please log in to submit a report.', 'error');
      // Optionally redirect to login page
      this.$router.push('/login');
      return;
    }
    if (user) {
      this.formValues.user_id = user.id;
    }
  },
  methods: {
    async handleFormSubmission(formData) {
      try {
        let imageUrl = null;
        console.log("📌 Form Data Received:", formData);

        // ✅ Handle Image Upload to Supabase Storage
        if (formData.photo_url) { // Changed from report_image to photo_url
          const file = formData.photo_url;
          console.log("📤 File to upload:", file);
          
          // Check if file is a File object
          if (!(file instanceof File)) {
            console.error("❌ Invalid file object:", file);
            this.$refs.toast.showToast('Invalid image file. Please try again.', 'error');
            return;
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `missing_persons/${fileName}`;

          console.log("📤 Uploading file to Supabase at path:", filePath);

          const { error: uploadError } = await supabase.storage
            .from('missingimages')
            .upload(filePath, file, { 
              cacheControl: '3600', 
              upsert: false,
              contentType: file.type
            });

          if (uploadError) {
            console.error("❌ File upload error:", uploadError.message);
            this.$refs.toast.showToast('Failed to upload image. Please try again.', 'error');
            return;
          }

          // ✅ Retrieve public URL
          const { data: { publicUrl } } = supabase.storage
            .from('missingimages')
            .getPublicUrl(filePath);

          if (!publicUrl) {
            console.error("❌ Error retrieving image URL.");
            this.$refs.toast.showToast('Failed to process image. Please try again.', 'error');
            return;
          }

          imageUrl = publicUrl;
          console.log("🌐 Image URL retrieved:", imageUrl);
        }

        // ✅ Step 1: Insert into `reports` (Supertype Table)
        const reportDataToInsert = {
          report_type: formData.report_type, // Always "missing"
          reporter_name: formData.reporter_name,
          reporter_contact: formData.reporter_contact,
          report_status: formData.reporter_status,
          user_id: formData.user_id,
          created_at: formData.created_at,
        };

        console.log("📊 Inserting into 'reports' table:", reportDataToInsert);

        const { data: insertedReport, error: reportInsertError } = await supabase.from("reports").insert([reportDataToInsert]).select();

        if (reportInsertError) {
          console.error("❌ Error inserting into 'reports':", reportInsertError.message);
          this.$refs.toast.showToast('Failed to submit report. Please try again.', 'error');
          return;
        }

        // ✅ Step 2: Insert into `missing_reports` (Subtype Table)
        const missingReportData = {
          missing_report_id: insertedReport[0].id, // Use the auto-generated ID from reports table
          missing_person_name: formData.missing_person_name,
          age: formData.age,
          gender: formData.gender,
          last_seen_location: formData.last_seen_location,
          last_seen_date: formData.last_seen_date,
          description: formData.description,
          photo_url: imageUrl || null,
        };

        console.log("📊 Inserting into 'missing_reports' table:", missingReportData);

        const { error: missingReportInsertError } = await supabase
          .from("missing_reports")
          .insert([missingReportData]);

        if (missingReportInsertError) {
          console.error("❌ Error inserting into 'missing_reports':", missingReportInsertError.message);
          this.$refs.toast.showToast('Failed to submit report details. Please try again.', 'error');
          return;
        }

        console.log("✅ Report submitted successfully!");
        this.$refs.toast.showToast('Report submitted successfully!', 'success');
        this.showForm = false; // Close form after submission

      } catch (err) {
        console.error("❌ Unexpected error:", err);
        this.$refs.toast.showToast('An unexpected error occurred. Please try again.', 'error');
      }
    }
  }
};
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

.cta-container {
  text-align: left;
  padding: 5vw;
  margin: auto;
  background-color: #49596b;
  color: #f2f0e9;
}

.q-btn {
  font-size: 1.5vw;
  padding: 1vw 2vw;
}

@media (max-width: 768px) {
  .cta-container {
    padding: 6vw;
  }
  .q-btn {
    font-size: 3vw;
  }
}
</style>
