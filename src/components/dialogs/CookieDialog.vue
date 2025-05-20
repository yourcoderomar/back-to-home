<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px; max-width: 800px; border-radius: 16px">
      <q-card-section class="row items-center">
        <div class="text-h6">Cookie Policy</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="cookie-content">
          <h4>1. What Are Cookies</h4>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you
            visit our website. They help us make your experience better.
          </p>

          <h4>2. How We Use Cookies</h4>
          <p>
            We use cookies to understand how you use our website, to remember your preferences, and
            to improve your experience.
          </p>

          <h4>3. Types of Cookies We Use</h4>
          <p>
            We use essential cookies for basic website functionality, and optional cookies for
            analytics and personalization.
          </p>

          <h4>4. Managing Cookies</h4>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are
            already on your computer and you can set most browsers to prevent them from being
            placed.
          </p>

          <h4>5. Third-Party Cookies</h4>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We have no
            control over these cookies.
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CookieDialog',
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
.cookie-content {
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
