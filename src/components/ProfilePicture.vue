<template>
  <div>
    <!-- Avatar that opens the modal -->
    <q-avatar size="180px" class="cursor-pointer" @click="showModal = true">
      <img :src="userAvatar || defaultAvatar" alt="User Avatar" class="avatar-img" />
    </q-avatar>

    <!-- Hidden file input for selecting a new image -->
    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />

    <!-- Modal Dialog -->
    <q-dialog v-model="showModal">
      <div class="modal-overlay">
        <!-- Image Wrapper (Same size as the image) -->
        <div class="image-container">
          <!-- Full Image -->
          <img :src="userAvatar || defaultAvatar" alt="Profile Picture" class="modal-image" />

          <!-- Close Button in Top-Right of Image -->
          <q-btn icon="close" class="close-btn" @click="showModal = false" />

          <!-- Change Picture Button Inside Image -->
          <q-btn color="primary" label="Change Picture" class="change-btn" @click="uploadImage" />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { supabase } from "src/boot/supabase";

export default {
  props: {
    userId: String,
    initialAvatar: String,
  },
  setup(props, { emit }) {
    const showModal = ref(false);
    const fileInput = ref(null);
    const userAvatar = ref(props.initialAvatar);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    watch(() => props.initialAvatar, (newAvatar) => {
      userAvatar.value = newAvatar;
    });

    const uploadImage = () => {
      fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const filePath = `avatars/${props.userId}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("profilepictures")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return;
      }

      const { data: urlData } = supabase.storage.from("profilepictures").getPublicUrl(filePath);
      if (urlData.publicUrl) {
        userAvatar.value = urlData.publicUrl;

        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: urlData.publicUrl })
          .eq("user_id", props.userId);

        if (updateError) {
          console.error("Database update error:", updateError);
          return;
        }

        emit("updateAvatar", urlData.publicUrl);
      }

      showModal.value = false;
    };

    return {
      showModal,
      fileInput,
      userAvatar,
      defaultAvatar,
      uploadImage,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
/* Small Circular Avatar when Modal is Closed */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid white;
  background-color: #f0f0f0;
}

/* Modal Overlay (Same Size as Image) */
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Image Wrapper (Same Size as Image) */
.image-container {
  position: relative;
  max-width: 500px;
  width: 100%;
}

/* Full Image */
.modal-image {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 12px;
}
/* Remove default background and shadow */
.q-btn::before {
  background: none !important;
  box-shadow: none !important;
}


/* Close Button in Top-Right of Image */
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none !important;  /* Ensure no background */
  box-shadow: none !important;  /* Remove default Quasar shadow */
  color: red;
  font-size: 22px;
  width: 35px;
  height: 35px;
  min-width: unset; /* Removes unnecessary spacing */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none; /* Remove any possible border */
}

/* Removes default hover effect */
.close-btn:hover {
  background: none !important;
  box-shadow: none !important;
}


/* Change Picture Button Inside Image */
.change-btn {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
}
</style>
