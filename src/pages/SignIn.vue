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
          :title="'Sign In'"
          :message="'Sign in to access your account and stay connected.'"
          :formFields="formFields"
          :buttonText="'Sign In'"
          :redirectMessage="'Don\'t have an account?'"
          :redirectPath="'/signup'"
          :redirectLinkText="'Sign Up'"
          @formSubmitted="handleSignIn"
        />
      </div>
      <FooterComponent/>
      <ToastNotification ref="toast" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { loginUser, getUserData } from "src/services/authService"; // Import functions
import AuthForm from "src/components/AuthForm.vue";
import NavBar from "src/components/NavBar.vue";
import FooterComponent from "src/components/Footer.vue";
import ToastNotification from "components/ToastNotification.vue";

export default {
  components: { AuthForm, NavBar, FooterComponent, ToastNotification },
  setup() {
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const isLoading = ref(true); // Prevent unwanted redirects

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
        ]
      },
    ]);

    const handleSignIn = async (formData) => {
      try {
        const result = await loginUser(formData.email, formData.password);

        if (result.error) {
          proxy.$refs.toast.showToast('Invalid email or password', 'error');
          return;
        }

        localStorage.setItem("session", JSON.stringify(result.user));
        proxy.$refs.toast.showToast('Successfully signed in!', 'success');

        // Check if user has completed their profile
        const userData = await getUserData();
        if (!userData) {
          router.push("/CompleteProfile");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        proxy.$refs.toast.showToast('Invalid email or password', 'error');
      }
    };

    // ✅ Ensure session is valid before redirecting
    onMounted(async () => {
      try {
        const storedSession = JSON.parse(localStorage.getItem("session"));
        if (storedSession) {
          const userData = await getUserData();
          if (userData) {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        isLoading.value = false; // Allow normal login if session is invalid
      }
    });

    return { formFields, handleSignIn, isLoading };
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
</style>
