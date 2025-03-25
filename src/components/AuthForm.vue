<template>
    <q-page-container>
      <q-form class="form" @submit.prevent="handleSubmit">

  
        <p class="title">{{ title }}</p>
        <p class="message">{{ message }}</p>
  
        <div class="flex-container">
          <template v-for="(field, index) in processedFields" :key="index">
            <!-- Break for Full Width Fields -->
            <div v-if="index > 0 && processedFields[index - 1].width === '100%'" class="full-width-break"></div>
  
            <div 
              class="input-container"
              :data-full-width="field.width === '100%'"
              :style="{ flex: `0 0 ${field.width || 'auto'}` }"
            >
              <!-- Normal Input Fields -->
              <q-input
                v-if="!['select', 'textarea', 'checkbox', 'radio', 'file'].includes(field.type)"
                v-model="formData[field.name]"
                :type="field.type === 'password' ? (field.showPassword ? 'text' : 'password') : field.type"
                :label="field.label"
                :rules="field.rules || []"
                :required="field.required || false"
                filled
                dense
                hide-bottom-space
                lazy-rules="ondemand"
                @blur="field.showValidation = true"
                :append="field.type === 'password'"
                @update:model-value="field.onUpdate && field.onUpdate($event)"
              >
                <template v-if="field.type === 'password'" v-slot:append>
                  <q-icon
                    :name="field.showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="#f2f0e9"
                    size="sm"
                    @click.stop="field.showPassword = !field.showPassword"
                  />
                </template>
              </q-input>
  
                          <!-- File Upload -->
                          <q-file
                v-else-if="field.type === 'file'"
                v-model="formData[field.name]"
                :label="field.label"
                filled
                dense
                class="custom-file-input"
                counter
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
  
              <!-- Dropdown Select -->
              <q-select
                v-else-if="field.type === 'select'"
                v-model="formData[field.name]"
                :label="field.label"
                :options="field.options || []"
                filled
                dense
                hide-bottom-space
              />
  
              <!-- Textarea -->
              <q-input
                v-else-if="field.type === 'textarea'"
                v-model="formData[field.name]"
                :label="field.label"
                type="textarea"
                filled
                dense
              />
  
              <!-- Radio Buttons -->
              <div v-else-if="field.type === 'radio'" class="radio-group">
                <p>{{ field.label }}</p>
                <q-radio
                  v-for="(option, i) in field.options"
                  :key="i"
                  v-model="formData[field.name]"
                  :val="option.value"
                  :label="option.label"
                  dense
                />
                <div v-if="!formData[field.name] && showValidation" class="error-text">
                  {{ field.label }} is required.
                </div>
              </div>
  
              <!-- Checkbox -->
              <div v-else-if="field.type === 'checkbox'" class="checkbox-group">
                <q-checkbox
                  v-model="formData[field.name]"
                  :label="field.label"
                  dense
                />
                <div v-if="!formData[field.name] && showValidation" class="error-text">
                  {{ field.label }} must be checked.
                </div>
              </div>
            </div>
          </template>
        </div>
  
        <q-btn :label="buttonText" type="submit" class="submit" />
        
        <!-- Add the redirect link -->
        <p class="redirect-text">
          {{ redirectMessage }}
          <router-link :to="redirectPath" class="redirect-link">
            {{ redirectLinkText }}
          </router-link>
        </p>
      </q-form>
    </q-page-container>
  </template>
  
  <script>
  export default {
    name: "ReusableForm",
    props: {
      title: { type: String, default: "Register" },
      message: { type: String, default: "Signup now and get full access to our app." },
      formFields: { type: Array, default: () => [] },
      initialValues: { type: Object, default: () => ({}) },
      buttonText: { type: String, required: true },
      redirectMessage: { type: String, required: true },
      redirectPath: { type: String, required: true },
      redirectLinkText: { type: String, required: true }
    },
    data() {
      return {
        formData: { ...this.initialValues },
        showValidation: false,
        processedFields: this.formFields.map(field => ({
          ...field,
          showValidation: false,
          showPassword: false
        }))
      };
    },
    methods: {
    handleSubmit() {
      this.showValidation = true; // Show validation errors
      this.processedFields.forEach(field => {
        field.showValidation = true;
      });
  
      const invalidFields = this.processedFields.some(field => {
        if (field.required && !this.formData[field.name]) {
          return true;
        }
        return false;
      });
  
      if (invalidFields) {
        return; // Stop submission if validation fails
      }
  
      // Check if there's a file field and convert it to a File object
      let formDataWithFile = { ...this.formData };
  
      this.processedFields.forEach(field => {
        if (field.type === 'file' && this.formData[field.name]) {
          formDataWithFile[field.name] = this.formData[field.name]; // Ensures the actual File object is passed
        }
      });
  
      this.$emit("formSubmitted", formDataWithFile);
    }
  }
  
  };
  </script>
  
  <style scoped>
  /* Layout */
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }
  
  .input-container {
    flex: 0 0 auto;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .input-container[data-full-width="true"] {
    flex-basis: 100%;
  }
  
  .full-width-break {
    flex-basis: 100%;
    width: 100%;
    height: 0;
  }
  
  /* Checkbox & Radio Button Groups */
  .radio-group, .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  /* Error Text */
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }
  
  /* Form Styling */
  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    padding: 20px;
    border-radius: 20px;
    background-color: #00000043;
    color: #fff;
    margin: 13vw;
  }
  
  /* Input Styling */
  :deep(.q-field__native) {
    color: #f2f0e9 !important;
  }
  
  :deep(.q-field__label) {
    color: #00bfff;
  }
  
  :deep(.q-field__native::placeholder) {
    color: #00bfff;
  }

  :deep(.q-field__append .q-icon) {
    color: #f2f0e9 !important;
  }
  
  .title {
    font-size: 22px;
    font-weight: 900;
    color: #f2f0e9;
    text-align: center;
  }
  
  
  .message {
    font-size: 14.5px;
    color: #f2f0e9;
    text-align: center;
    font-weight: 500;
  }
  
  .submit {
    border: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    background-color: #00bfff;
  }

  .redirect-text {
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
    color: #f2f0e9;
  }

  .redirect-link {
    color: #00bfff;
    text-decoration: none;
    font-weight: bold;
  }

  .redirect-link:hover {
    text-decoration: underline;
  }
  
  </style>
  