<template>
    <q-toolbar>
      <q-toolbar-title>My App</q-toolbar-title>
      <q-btn v-if="user" label="Logout" color="red" @click="handleLogout" />
    </q-toolbar>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { supabase, signOutUser } from "src/boot/supabase";
  
  export default {
    setup() {
      const router = useRouter();
      const user = ref(null);
  
      onMounted(async () => {
        const { data } = await supabase.auth.getUser();
        user.value = data?.user;
      });
  
      const handleLogout = async () => {
        await signOutUser();
        router.push("/SignIn"); // Redirect to Sign In
      };
  
      return { user, handleLogout };
    },
  };
  </script>
  