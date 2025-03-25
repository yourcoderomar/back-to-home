<template>
  <div class="notification-container">
    <!-- Notification Bell Button -->
    <q-btn class="notification-btn" dense flat icon="notifications" @click="toggleNotifications">
      <q-badge v-if="notifications.length" floating color="red">{{ notifications.length }}</q-badge>
    </q-btn>

    <!-- Notification Dropdown -->
    <transition name="fade-slide">
      <div v-if="showNotifications" class="notification-panel">
        <div class="panel-header">
          <span>Notifications</span>
          <q-btn flat dense icon="close" @click="toggleNotifications" />
        </div>

        <div v-if="notifications.length" class="notification-list">
          <div v-for="notif in notifications" :key="notif.id" class="notification-item">
            <q-icon :name="icons[notif.type]" class="icon" />
            <span class="message">{{ notif.message }}</span>
            <q-btn flat dense icon="close" class="delete-btn" @click="deleteNotification(notif.id)" />
          </div>
        </div>
        <div v-else class="empty-message">No new notifications</div>

        <q-btn v-if="notifications.length" flat dense class="clear-btn" @click="clearNotifications">
          Clear All
        </q-btn>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "src/boot/supabase";

export default {
  setup() {
    const showNotifications = ref(false);
    const notifications = ref([]);
    let subscription = null;
    const userId = ref(null); // Store logged-in user ID

    const icons = {
      success: "check_circle",
      error: "error",
      warning: "warning",
      info: "info",
    };

    // 🔹 Fetch notifications for the logged-in user
    const fetchNotifications = async () => {
      console.log("Fetching notifications...");

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User authentication error:", userError);
        return;
      }

      userId.value = user.id; // Store user ID

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id) // Fetch only the current user's notifications
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        console.log("Notifications fetched:", data);
        notifications.value = data;
      }
    };

    // 🔹 Subscribe to real-time notifications
    const subscribeToNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Subscribing to notifications for user:", user.id);

      subscription = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log("New notification received:", payload.new);
            notifications.value.unshift(payload.new);
          }
        )
        .subscribe();
    };

    // 🔹 Delete a single notification
    const deleteNotification = async (id) => {
      console.log("Deleting notification:", id);
      const { error } = await supabase.from("notifications").delete().eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error.message);
      } else {
        notifications.value = notifications.value.filter((notif) => notif.id !== id);
      }
    };

    // 🔹 Clear all notifications
    const clearNotifications = async () => {
      console.log("Clearing all notifications...");
      if (!userId.value) return;

      const { error } = await supabase.from("notifications").delete().eq("user_id", userId.value);

      if (error) {
        console.error("Error clearing notifications:", error.message);
      } else {
        notifications.value = [];
      }
    };

    // 🔹 Toggle notification panel
    const toggleNotifications = () => {
      console.log("Toggling notifications panel...");
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) fetchNotifications(); // Refresh notifications when opened
    };

    // 🔹 Fetch notifications and subscribe on mount
    onMounted(async () => {
      await fetchNotifications();
      await subscribeToNotifications();
    });

    // 🔹 Cleanup real-time subscription on unmount
    onBeforeUnmount(() => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    });

    return {
      showNotifications,
      toggleNotifications,
      notifications,
      deleteNotification,
      clearNotifications,
      icons,
    };
  },
};
</script>

<style scoped>
.notification-container {
  position: relative;
  display: inline-block;
}

/* Notification Panel */
.notification-panel {
  position: absolute;
  top: 40px;
  right: 0;
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  font-weight: bold;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

/* Notification Items */
.notification-list {
  max-height: 250px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}
.notification-item .icon {
  margin-right: 10px;
  font-size: 18px;
  color: #2C3539;
}

.notification-btn {
  color: #2C3539;
  font-size: 18px;
}
.delete-btn {
  color: #dc3545;
}

/* Notification Colors */
.success { color: #28a745; }
.error { color: #dc3545; }
.warning { color: #ffc107; }
.info { color: #007bff; }

/* Empty Message */
.empty-message {
  padding: 12px;
  text-align: center;
  color: #777;
}

/* Clear Button */
.clear-btn {
  width: 100%;
  padding: 8px;
  background: #eee;
  text-align: center;
}

/* Fade Slide Animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
