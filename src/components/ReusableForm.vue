<template>
  <q-page-container>
    <q-form class="form" @submit.prevent="handleSubmit">
      <!-- Exit Button -->
      <q-btn 
        dense 
        flat 
        icon="close" 
        color="red" 
        class="exit-btn" 
        @click="$emit('closeForm')" 
      />

      <p class="title">{{ title }}</p>
      <p class="message">{{ message }}</p>

      <div class="flex-container">
        <template v-for="(field, index) in fields" :key="index">
          <!-- Break for Full Width Fields -->
          <div v-if="index > 0 && fields[index - 1].width === '100%'" class="full-width-break"></div>

          <div 
            class="input-container"
            :data-full-width="field.width === '100%'"
            :style="{ flex: `0 0 ${field.width || 'auto'}` }"
          >
            <!-- Normal Input Fields -->
            <q-input
              v-if="!['select', 'textarea', 'checkbox', 'radio', 'file'].includes(field.type)"
              v-model="formData[field.name]"
              :label="field.label"
              :type="field.type || 'text'"
              :rules="field.rules || []"
              :required="field.required || false"
              filled
              dense
              hide-bottom-space
            />

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

      <q-btn label="Submit" type="submit" class="submit" />
    </q-form>
  </q-page-container>
</template>

<script>
export default {
  name: "ReusableForm",
  props: {
    title: { type: String, default: "Register" },
    message: { type: String, default: "Signup now and get full access to our app." },
    fields: { type: Array, default: () => [] },
    initialValues: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      formData: { ...this.initialValues },
      showValidation: false
    };
  },
  methods: {
  handleSubmit() {
    this.showValidation = true; // Show validation errors

    const invalidFields = this.fields.some(field => {
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

    this.fields.forEach(field => {
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

/* Exit Button */
.exit-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 10;
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
  background-color: #f2f0e9;
  color: #fff;
  border: 1px solid #f2f0e9;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #2C3539;
  text-align: center;
}

.message {
  font-size: 14.5px;
  color: #49596b;
  text-align: center;
}

.submit {
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  background-color: #00bfff;
}
</style>
