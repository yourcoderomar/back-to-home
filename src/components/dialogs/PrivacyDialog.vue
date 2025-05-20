<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px; max-width: 800px; border-radius: 16px">
      <q-card-section class="row items-center">
        <div class="text-h6">Privacy Policy</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="privacy-content">
          <h4>1. Information We Collect</h4>
          <p>
            We collect information that you provide directly to us, including personal information
            such as your name, email address, and any other information you choose to provide.
          </p>

          <h4>2. How We Use Your Information</h4>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to
            communicate with you, and to protect our users.
          </p>

          <h4>3. Information Sharing</h4>
          <p>
            We do not share your personal information with third parties except as described in this
            privacy policy.
          </p>

          <h4>4. Data Security</h4>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h4>5. Your Rights</h4>
          <p>
            You have the right to access, correct, or delete your personal information. You can also
            object to the processing of your personal information.
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'PrivacyDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.privacy-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 10px;

  h4 {
    color: #49596b;
    margin: 20px 0 10px;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }
}
</style>
