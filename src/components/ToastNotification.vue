<template>
  <transition-group
    name="toast"
    tag="div"
    class="toast-container"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
    >
      <q-icon :name="getIcon(toast.type)" class="toast-icon" />
      <span class="toast-message">{{ toast.message }}</span>
      <q-btn
        flat
        dense
        round
        icon="close"
        class="toast-close"
        @click="removeToast(toast.id)"
      />
    </div>
  </transition-group>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ToastNotification',
  setup() {
    const toasts = ref([]);
    let toastId = 0;

    const getIcon = (type) => {
      const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
      };
      return icons[type] || 'info';
    };

    const showToast = (message, type = 'info', duration = 5000) => {
      const id = toastId++;
      toasts.value.push({ id, message, type });
      
      // Auto remove after duration
      setTimeout(() => {
        removeToast(id);
      }, duration);
    };

    const removeToast = (id) => {
      toasts.value = toasts.value.filter(toast => toast.id !== id);
    };

    return {
      toasts,
      getIcon,
      showToast,
      removeToast
    };
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  color: #333;
}

.toast-icon {
  margin-right: 12px;
  font-size: 20px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
}

.toast-close {
  margin-left: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast types */
.success {
  border-left: 4px solid #28a745;
}
.success .toast-icon {
  color: #28a745;
}

.error {
  border-left: 4px solid #dc3545;
}
.error .toast-icon {
  color: #dc3545;
}

.warning {
  border-left: 4px solid #ffc107;
}
.warning .toast-icon {
  color: #ffc107;
}

.info {
  border-left: 4px solid #007bff;
}
.info .toast-icon {
  color: #007bff;
}

/* Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style> 