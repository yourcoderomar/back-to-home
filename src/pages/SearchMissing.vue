<template>
    <div :class="{ 'blurred': showForm }">
      <NavBar />
      <q-page-container>
        <HeroSection :title="'Search for a Missing Person'" />
  
                    <div class="cta-container">
            <h2>Search for a Missing Person :</h2>
            <ul>
                <li><span>Check for Matches:</span> Before filing a new report, see if someone matching your missing person’s details is already in our database.</li>
                <li><span>Provide Key Information:</span> Enter details such as name, age, last known location, and any distinguishing features to improve search accuracy.</li>
                <li><span>Save Time & Act Fast:</span> If a match is found, you can quickly connect with the relevant report and take action immediately.</li>
            </ul>

            <h2>How It Works :</h2>
            <ul>
                <li><span>Enter Details:</span> Provide as much information as possible about the missing person.</li>
                <li><span>Search Our Database:</span> Our system will compare your report with existing cases to find potential matches.</li>
                <li><span>Get Instant Results:</span> If a match is found, you’ll receive details on how to proceed.</li>
            </ul>

            <h2>Start Your Search Now!</h2>
            <p>Before submitting a new report, check if the person you’re looking for is already in our records. Every second matters.</p>
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
              @formSubmitted="handleFormSubmission"
              @closeForm="showForm = false" 
              class="form"
            />
          </div>
        </q-dialog>
      </q-page-container>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import ReusableForm from 'components/ReusableForm.vue';
  import NavBar from 'src/components/NavBar.vue';
  import FooterComponent from '../components/Footer.vue';
  import HeroSection from 'src/components/HeroSection.vue';
  
  export default {
    components: {
      ReusableForm,
      NavBar,
      FooterComponent,
      HeroSection,
    },
    data() {
      return {
        showForm: false,
        showSearch: false, // Add this line
        formValues: {
          user_national_id: '',
          missing_person_name: '',
          report_gender: '',
          report_age: '',
          last_seen_location: '',
          last_seen_date: '',
        },
        fields: [
          { 
            name: 'user_national_id', 
            label: 'Your National ID', 
            type: 'text', 
            required: true, 
            width: '100%', 
            rules: [
              val => !!val || 'National ID is required',
              val => /^\d{14}$/.test(val) || 'Must be a 14-digit number'
            ] 
          },
          { 
            name: 'kinship', 
            label: 'Kinship', 
            type: 'text', 
            required: true, 
            width: '100%', 
            rules: [
              val => !!val || 'Kinship is required',
            ] 
          },
          { 
            name: 'missing_person_name', 
            label: 'Missing Person Name', 
            type: 'text', 
            required: true, 
            width: '100%', 
            rules: [val => !!val || 'Name is required'] 
          },
          { 
            name: 'report_gender', 
            label: 'Gender', 
            type: 'select', 
            options: ['Male', 'Female'], 
            width: '40%',
            rules: [val => !!val || 'Gender is required']
          },
          { 
            name: 'report_age', 
            label: 'Age', 
            type: 'number', 
            width: '40%', 
            rules: [
              val => !!val || 'Age is required',
              val => (val > 0 && val < 150) || 'Enter a valid age'
            ] 
          },
          { 
            name: 'last_seen_location', 
            label: 'Last Seen Location', 
            type: 'text', 
            width: '100%',
            rules: [val => !!val || 'Location is required']
          },
          { 
            name: 'last_seen_date', 
            label: 'Last Seen Date', 
            type: 'date', 
            width: '100%',
            rules: [val => !!val || 'Date is required']
          },
          { 
            name: 'media', 
            label: 'Missing Person Image', 
            type: 'file', 
            width: '100%',
            rules: [val => !!val || 'Date is required']
          },
          { 
            name: 'more_details', 
            label: 'More Details', 
            type: 'textarea', 
            width: '100%',
          },
        ],
      };
    },
    methods: {
      handleFormSubmission(formData) {
        console.log('Form Data:', formData);
        this.showForm = false; // Close form after submission
      },
    },
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
</style>

  