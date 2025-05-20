<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px; max-width: 800px; border-radius: 16px">
      <q-card-section class="row items-center">
        <div class="text-h6">Terms of Service</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="terms-content">
          <h4>1. Acceptance of Terms</h4>
          <p>
            By accessing and using Back2home, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>

          <h4>2. Use License</h4>
          <p>
            Permission is granted to temporarily use Back2home for personal, non-commercial
            transitory viewing only.
          </p>

          <h4>3. User Responsibilities</h4>
          <p>
            Users are responsible for maintaining the confidentiality of their account information
            and for all activities that occur under their account.
          </p>

          <h4>4. Content Guidelines</h4>
          <p>
            Users must not post any content that is illegal, harmful, threatening, abusive,
            harassing, defamatory, or otherwise objectionable.
          </p>

          <h4>5. Termination</h4>
          <p>
            We reserve the right to terminate or suspend access to our service immediately, without
            prior notice, for any breach of these Terms of Service.
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'TermsDialog',
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
.terms-content {
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
