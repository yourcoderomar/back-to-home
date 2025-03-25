<template>
    <div class="contact-container">
      <q-card class="contact-card">
        <q-card-section>
          <h2 class="contact-title">Get in Touch</h2>
          <p class="contact-text">We’d love to hear from you! Fill out the form below, and we’ll get back to you soon.</p>
  
          <q-form @submit="submitForm">
            <q-input v-model="name" label="Your Name" outlined dense class="input-field" :rules="[val => !!val || 'Name is required']"/>
            <q-input v-model="email" type="email" label="Your Email" outlined dense class="input-field" :rules="[val => !!val || 'Email is required']"/>
            <q-input v-model="message" type="textarea" label="Your Message" outlined dense class="input-field" :rules="[val => !!val || 'Message is required']"/>
  
            <q-btn type="submit" label="Send Message" class="submit" style="width: 100%;" />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        message: ''
      };
    },
    methods: {
      submitForm() {
        if (this.name && this.email && this.message) {
          // Simulating form submission
          console.log("Form submitted:", { name: this.name, email: this.email, message: this.message });
          this.$q.notify({ message: "Message sent!", color: "green", position: "top" });
  
          // Clear form after submission
          this.name = "";
          this.email = "";
          this.message = "";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .contact-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
  }
  
  .contact-card {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border-radius: 12px;
    background: #f2f0e9;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .contact-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2C3539;

  }
  
  .contact-text {
    text-align: center;
    font-size: 14px;
    color: #49596b;
    margin-bottom: 20px;
  }
  
  .input-field {
    margin-bottom: 15px;
  }
  
  .submit-btn {
    width: 100%;
    margin-top: 10px;
  }
  
  /* Smooth animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>
  