<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div class="video-wrapper">
        <video autoplay muted loop playsinline>
          <source src="/images/bg2-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <NavBar :transparent="true" />
      <div class="flex flex-center full-height">
        <AuthForm
          :title="'Sign Up'"
          :message="'Create an account to get started!'"
          :formFields="formFields"
          :buttonText="'Sign Up'"
          :redirectMessage="'Already have an account?'"
          :redirectPath="'/signin'"
          :redirectLinkText="'Sign In'"
          @formSubmitted="handleSignup"
        />
      </div>
      <FooterComponent/>
      <ToastNotification ref="toast" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import AuthForm from "src/components/AuthForm.vue";
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/Footer.vue";
import ToastNotification from "components/ToastNotification.vue";
import { signUpUser } from "src/services/authService";

export default {
  components: { AuthForm, NavBar, FooterComponent, ToastNotification },
  setup() {
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const password = ref('');

    const formFields = ref([
      { 
        name: "email", 
        label: "Email", 
        type: "email", 
        required: true,
        rules: [
          val => !!val || 'Email is required',
          val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
        ]
      },
      { 
        name: "password", 
        label: "Password", 
        type: "password", 
        required: true,
        rules: [
          val => !!val || 'Password is required',
          val => val.length >= 6 || 'Password must be at least 6 characters'
        ],
        onUpdate: (val) => {
          password.value = val;
        }
      },
      { 
        name: "confirm_password", 
        label: "Confirm Password", 
        type: "password", 
        required: true,
        rules: [
          val => !!val || 'Please confirm your password',
          val => val === password.value || 'Passwords do not match'
        ]
      },
    ]);

    const handleSignup = async (formData) => {
      try {
        if (formData.password !== formData.confirm_password) {
          proxy.$refs.toast.showToast('Passwords do not match', 'error');
          return;
        }

        const result = await signUpUser(formData.email, formData.password);

        if (result.error) {
          proxy.$refs.toast.showToast(result.error, 'error');
        } else {
          proxy.$refs.toast.showToast('Please check your email to verify your account.', 'success');
          setTimeout(() => {
            router.push("/SignIn");
          }, 5000);
        }
      } catch (error) {
        console.error("Signup error:", error);
        proxy.$refs.toast.showToast('An error occurred during signup', 'error');
      }
    };

    return { formFields, handleSignup };
  },
};
</script>

<style scoped>
/* Video Background */
.video-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(80%);
}

.full-height {
  min-height: 100vh;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
