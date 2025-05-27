<template>
  <div class="notification-container">
    <!-- Notification Bell Button -->
    <q-btn class="notification-btn" dense flat icon="notifications" @click="toggleNotifications">
      <q-badge v-if="unreadCount" floating color="red">{{ unreadCount }}</q-badge>
    </q-btn>

    <!-- Notification Dropdown -->
    <transition name="fade-slide">
      <div v-if="showNotifications" class="notification-panel">
        <div class="panel-header">
          <span>Notifications</span>
          <q-btn flat dense icon="close" @click="toggleNotifications" />
        </div>

        <div v-if="loading" class="loading-state">
          <q-spinner color="primary" size="2em" />
          <span>Loading notifications...</span>
        </div>

        <div v-else-if="notifications.length" class="notification-list">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="notification-item"
            :class="{ unread: !notif.read }"
            @click="markAsRead(notif.id)"
          >
            <q-icon :name="icons[notif.type]" class="icon" :class="notif.type" />
            <div class="notification-content">
              <span class="message">{{ notif.message }}</span>
              <span class="timestamp">{{ formatTimeAgo(notif.created_at) }}</span>
            </div>
            <q-btn
              flat
              dense
              icon="close"
              class="delete-btn"
              @click.stop="deleteNotification(notif.id)"
            />
          </div>
        </div>
        <div v-else class="empty-message">
          <q-icon name="notifications_off" size="2em" color="grey-6" />
          <span>No new notifications</span>
        </div>

        <q-btn v-if="notifications.length" flat dense class="clear-btn" @click="clearNotifications">
          Clear All
        </q-btn>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { supabase } from 'src/boot/supabase'

export default {
  setup() {
    const showNotifications = ref(false)
    const notifications = ref([])
    const loading = ref(false)
    let subscription = null
    const userId = ref(null)

    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    }

    const unreadCount = computed(() => {
      return notifications.value.filter((notif) => !notif.read).length
    })

    const formatTimeAgo = (date) => {
      const now = new Date()
      const notifDate = new Date(date)
      const diffInSeconds = Math.floor((now - notifDate) / 1000)

      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      return notifDate.toLocaleDateString()
    }

    const markAsRead = async (id) => {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)

      if (!error) {
        notifications.value = notifications.value.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        )
      }
    }

    const fetchNotifications = async () => {
      loading.value = true
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError || !user) {
          console.error('User authentication error:', userError)
          return
        }

        userId.value = user.id

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching notifications:', error.message)
        } else {
          notifications.value = data
        }
      } finally {
        loading.value = false
      }
    }

    // 🔹 Subscribe to real-time notifications
    const subscribeToNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      console.log('Subscribing to notifications for user:', user.id)

      subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('New notification received:', payload.new)
            notifications.value.unshift(payload.new)
          },
        )
        .subscribe()
    }

    // 🔹 Delete a single notification
    const deleteNotification = async (id) => {
      console.log('Deleting notification:', id)
      const { error } = await supabase.from('notifications').delete().eq('id', id)

      if (error) {
        console.error('Error deleting notification:', error.message)
      } else {
        notifications.value = notifications.value.filter((notif) => notif.id !== id)
      }
    }

    // 🔹 Clear all notifications
    const clearNotifications = async () => {
      console.log('Clearing all notifications...')
      if (!userId.value) return

      const { error } = await supabase.from('notifications').delete().eq('user_id', userId.value)

      if (error) {
        console.error('Error clearing notifications:', error.message)
      } else {
        notifications.value = []
      }
    }

    // 🔹 Toggle notification panel
    const toggleNotifications = () => {
      console.log('Toggling notifications panel...')
      showNotifications.value = !showNotifications.value
      if (showNotifications.value) fetchNotifications() // Refresh notifications when opened
    }

    // 🔹 Fetch notifications and subscribe on mount
    onMounted(async () => {
      await fetchNotifications()
      await subscribeToNotifications()
    })

    // 🔹 Cleanup real-time subscription on unmount
    onBeforeUnmount(() => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    })

    return {
      showNotifications,
      toggleNotifications,
      notifications,
      deleteNotification,
      clearNotifications,
      icons,
      loading,
      unreadCount,
      markAsRead,
      formatTimeAgo,
    }
  },
}
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

/* Notification Panel */
.notification-panel {
  position: fixed;
  top: 60px;
  right: 16px;
  width: calc(100% - 32px);
  max-width: 320px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 9999;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Add media query for larger screens */
@media (min-width: 768px) {
  .notification-panel {
    position: absolute;
    top: 45px;
    right: 0;
    width: 320px;
    max-height: 400px;
  }
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-weight: 600;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: #2c3539;
  font-size: 15px;
}

/* Notification Items */
.notification-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 4px 0;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item .icon {
  margin-right: 12px;
  font-size: 20px;
  color: #2c3539;
  flex-shrink: 0;
}

.notification-item .message {
  flex-grow: 1;
  line-height: 1.4;
  color: #2c3539;
}

.notification-item .timestamp {
  font-size: 12px;
  color: #6c757d;
}

.notification-btn {
  color: #2c3539;
  font-size: 20px;
  transition: transform 0.2s ease;
}

.transparent-nav .notification-btn {
  color: white !important;
}

.notification-btn:hover {
  transform: scale(1.1);
}

.delete-btn {
  color: #dc3545;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
}

/* Notification Colors */
.success {
  color: #28a745;
}
.error {
  color: #dc3545;
}
.warning {
  color: #ffc107;
}
.info {
  color: #007bff;
}

/* Empty Message */
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  gap: 12px;
  color: #6c757d;
  font-size: 14px;
}

/* Clear Button */
.clear-btn {
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  text-align: center;
  color: #6c757d;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.clear-btn:hover {
  background: #e9ecef;
  color: #2c3539;
}

/* Fade Slide Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Badge Styling */
:deep(.q-badge) {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.notification-content {
  flex-grow: 1;
  margin-right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: #6c757d;
}

/* Notification type colors */
.notification-item .icon.success {
  color: #28a745;
}

.notification-item .icon.error {
  color: #dc3545;
}

.notification-item .icon.warning {
  color: #ffc107;
}

.notification-item .icon.info {
  color: #007bff;
}
</style>
