<template>
  <div class="profile-picture-container">
    <!-- Avatar that opens the modal -->
    <q-avatar size="150px" class="cursor-pointer" @click="showModal = true">
      <img
        :src="userAvatar || defaultAvatar"
        alt="User Avatar"
        class="avatar-img"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </q-avatar>

    <!-- Hidden file input for selecting a new image -->
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
      accept="image/*"
    />

    <!-- Modal Dialog -->
    <q-dialog v-model="showModal" persistent>
      <q-card class="profile-modal">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Update Profile Picture</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="modal-image-container">
            <img
              :src="userAvatar || defaultAvatar"
              alt="Profile Picture"
              class="modal-image"
              @error="handleImageError"
              @load="handleImageLoad"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn unelevated color="primary" label="Change Picture" @click="uploadImage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { supabase } from 'src/boot/supabase'

export default {
  props: {
    userId: String,
    initialAvatar: String,
  },
  setup(props, { emit }) {
    const showModal = ref(false)
    const fileInput = ref(null)
    const userAvatar = ref(props.initialAvatar)
    const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'

    const handleImageError = () => {
      userAvatar.value = defaultAvatar
    }

    const handleImageLoad = () => {
      // Image loaded successfully
    }

    watch(
      () => props.initialAvatar,
      (newAvatar) => {
        userAvatar.value = newAvatar
      },
    )

    const uploadImage = () => {
      fileInput.value.click()
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      try {
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('profilepictures')
          .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600',
            contentType: file.type,
          })

        if (uploadError) {
          console.error('File upload error:', uploadError)
          return
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('profilepictures').getPublicUrl(fileName)

        if (publicUrl) {
          // Update the user's profile picture in the database
          const { error: updateError } = await supabase
            .from('users')
            .update({ profile_picture: publicUrl })
            .eq('user_id', props.userId)

          if (updateError) {
            console.error('Database update error:', updateError)
            return
          }

          // Update the local state
          userAvatar.value = publicUrl
          emit('updateAvatar', publicUrl)
        }

        showModal.value = false
      } catch (error) {
        console.error('Error during file upload:', error)
      }
    }

    return {
      showModal,
      fileInput,
      userAvatar,
      defaultAvatar,
      uploadImage,
      handleFileUpload,
      handleImageError,
      handleImageLoad,
    }
  },
}
</script>

<style scoped>
.profile-picture-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.avatar-img:hover {
  transform: scale(1.02);
}

.profile-modal {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
}

.modal-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.modal-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Remove default Quasar button styles */
.q-btn::before {
  background: none !important;
  box-shadow: none !important;
}
</style>
