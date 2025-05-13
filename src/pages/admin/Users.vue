<template>
  <q-page padding class="admin-users">
    <div class="text-h4 dashboard-title">User Management</div>

    <!-- Search and Filter -->
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input
          v-model="search"
          label="Search Users"
          dense
          outlined
          clearable
          class="search-input"
          @update:model-value="onSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Users Table -->
    <q-card class="users-table-card">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="user_id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        :rows-per-page-options="[10, 20, 50]"
        class="users-table"
        @row-click="showUserDetails"
      >
        <!-- Profile Picture Column -->
        <template v-slot:body-cell-profile_picture="props">
          <q-td :props="props">
            <q-avatar size="40px">
              <q-img
                :src="props.row.profile_picture"
                :ratio="1"
                spinner-color="primary"
                spinner-size="24px"
              >
                <template v-slot:error>
                  <q-icon name="person" size="40px" color="grey-5" />
                </template>
              </q-img>
            </q-avatar>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.is_admin ? 'primary' : 'grey'"
              text-color="white"
              dense
              class="status-chip"
            >
              {{ props.row.is_admin ? 'Admin' : 'User' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round color="negative" icon="delete" @click="confirmDeleteUser(props.row)">
              <q-tooltip>Delete User</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- Loading State -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </q-card>

    <!-- User Details Dialog -->
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card class="details-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditing ? 'Edit User' : 'User Details' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Profile Picture -->
            <div class="col-12 text-center">
              <q-avatar size="100px">
                <q-img
                  :src="selectedUser.profile_picture"
                  :ratio="1"
                  spinner-color="primary"
                  spinner-size="24px"
                >
                  <template v-slot:error>
                    <q-icon name="person" size="100px" color="grey-5" />
                  </template>
                </q-img>
              </q-avatar>
            </div>

            <!-- User Information -->
            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>First Name</q-item-label>
                  <template v-if="isEditing">
                    <q-input
                      v-model="selectedUser.user_first_name"
                      label="First Name"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'First name is required']"
                    />
                  </template>
                  <template v-else>
                    <q-item-label>{{ selectedUser.user_first_name }}</q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Last Name</q-item-label>
                  <template v-if="isEditing">
                    <q-input
                      v-model="selectedUser.user_last_name"
                      label="Last Name"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Last name is required']"
                    />
                  </template>
                  <template v-else>
                    <q-item-label>{{ selectedUser.user_last_name }}</q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>National ID</q-item-label>
                  <template v-if="isEditing">
                    <q-input
                      v-model="selectedUser.user_national_id"
                      label="National ID"
                      outlined
                      dense
                      :rules="[
                        (val) => !!val || 'National ID is required',
                        (val) => val.length === 14 || 'National ID must be 14 digits',
                      ]"
                    />
                  </template>
                  <template v-else>
                    <q-item-label>{{ selectedUser.user_national_id }}</q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Date of Birth</q-item-label>
                  <template v-if="isEditing">
                    <q-input
                      v-model="selectedUser.user_dob"
                      label="Date of Birth"
                      outlined
                      dense
                      type="date"
                      :rules="[(val) => !!val || 'Date of birth is required']"
                    />
                  </template>
                  <template v-else>
                    <q-item-label>{{
                      new Date(selectedUser.user_dob).toLocaleDateString()
                    }}</q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Phone Number</q-item-label>
                  <template v-if="isEditing">
                    <q-input
                      v-model="selectedUser.phone_number"
                      label="Phone Number"
                      outlined
                      dense
                      :rules="[
                        (val) => !!val || 'Phone number is required',
                        (val) => val.length === 11 || 'Phone number must be 11 digits',
                      ]"
                    />
                  </template>
                  <template v-else>
                    <q-item-label>{{ selectedUser.phone_number }}</q-item-label>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Plan</q-item-label>
                  <template v-if="isEditing">
                    <q-select
                      v-model="selectedUser.user_plan"
                      :options="[
                        { label: 'Free', value: 1 },
                        { label: 'Pro', value: 2 },
                      ]"
                      outlined
                      dense
                      emit-value
                      map-options
                    />
                  </template>
                  <template v-else>
                    <q-chip
                      :color="selectedUser.user_plan === 2 ? 'primary' : 'grey'"
                      text-color="white"
                      dense
                    >
                      {{ selectedUser.user_plan === 2 ? 'Pro' : 'Free' }}
                    </q-chip>
                  </template>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-12 col-md-6">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Status</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="selectedUser.is_admin ? 'primary' : 'grey'"
                      text-color="white"
                      dense
                    >
                      {{ selectedUser.is_admin ? 'Admin' : 'User' }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <template v-if="isEditing">
            <q-btn flat label="Cancel" color="primary" @click="cancelEdit" />
            <q-btn flat label="Save" color="primary" @click="saveUser" />
          </template>
          <template v-else>
            <q-btn flat label="Edit" color="primary" @click="startEdit" />
            <q-btn
              flat
              :color="selectedUser.is_admin ? 'negative' : 'positive'"
              :label="selectedUser.is_admin ? 'Remove Admin' : 'Make Admin'"
              @click="toggleAdminStatus(selectedUser)"
            />
            <q-btn
              flat
              color="negative"
              label="Delete User"
              @click="confirmDeleteUser(selectedUser)"
            />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this user?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ToastNotification ref="toast" />
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import ToastNotification from 'components/ToastNotification.vue'

export default {
  name: 'AdminUsersPage',
  components: {
    ToastNotification,
  },
  setup() {
    const users = ref([])
    const loading = ref(false)
    const search = ref('')
    const showDetailsDialog = ref(false)
    const selectedUser = ref({})
    const isEditing = ref(false)
    const originalUserData = ref(null)
    const toast = ref(null)
    const showDeleteDialog = ref(false)
    const userToDelete = ref(null)

    const columns = [
      {
        name: 'profile_picture',
        label: 'Profile',
        field: 'profile_picture',
        align: 'center',
        sortable: false,
      },
      { name: 'user_id', label: 'ID', field: 'user_id', align: 'left', sortable: true },
      {
        name: 'name',
        label: 'Name',
        field: (row) => `${row.user_first_name} ${row.user_last_name}`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'national_id',
        label: 'National ID',
        field: 'user_national_id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        field: 'user_dob',
        align: 'left',
        sortable: true,
        format: (val) => new Date(val).toLocaleDateString(),
      },
      {
        name: 'phone_number',
        label: 'Phone',
        field: 'phone_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'user_plan',
        label: 'Plan',
        field: 'user_plan',
        align: 'center',
        sortable: true,
        format: (val) => (val === 2 ? 'Pro' : 'Free'),
      },
      { name: 'status', label: 'Status', field: 'is_admin', align: 'center', sortable: true },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ]

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    })

    const showNotification = (message, type = 'error') => {
      if (toast.value) {
        toast.value.showToast(message, type)
      }
    }

    const fetchUsers = async () => {
      loading.value = true
      try {
        // First check if current user is admin
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: adminCheck } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!adminCheck) throw new Error('Not authorized')

        // Fetch users with admin status and search filter
        let query = supabase.from('users').select('*')
        if (search.value) {
          query = query.or(
            `user_first_name.ilike.%${search.value}%,user_last_name.ilike.%${search.value}%,phone_number.ilike.%${search.value}%`,
          )
        }
        const { data: usersData, error: usersError } = await query

        if (usersError) throw usersError

        // Get admin status for each user
        const { data: adminsData, error: adminsError } = await supabase
          .from('admins')
          .select('user_id')

        if (adminsError) throw adminsError

        // Create a set of admin user IDs for quick lookup
        const adminUserIds = new Set(adminsData.map((admin) => admin.user_id))

        // Transform data to include is_admin flag
        users.value = usersData.map((user) => ({
          ...user,
          is_admin: adminUserIds.has(user.user_id),
        }))
      } catch (error) {
        console.error('Error fetching users:', error)
        showNotification('Failed to fetch users')
      } finally {
        loading.value = false
      }
    }

    const onRequest = (props) => {
      pagination.value = props.pagination
      fetchUsers()
    }

    const onSearch = () => {
      pagination.value.page = 1
      fetchUsers()
    }

    const showUserDetails = (evt, row) => {
      selectedUser.value = { ...row }
      showDetailsDialog.value = true
      isEditing.value = false
    }

    const startEdit = () => {
      originalUserData.value = { ...selectedUser.value }
      isEditing.value = true
    }

    const cancelEdit = () => {
      selectedUser.value = { ...originalUserData.value }
      isEditing.value = false
    }

    const saveUser = async () => {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            user_first_name: selectedUser.value.user_first_name,
            user_last_name: selectedUser.value.user_last_name,
            user_national_id: selectedUser.value.user_national_id,
            user_dob: selectedUser.value.user_dob,
            phone_number: selectedUser.value.phone_number,
            user_plan: selectedUser.value.user_plan,
          })
          .eq('user_id', selectedUser.value.user_id)

        if (error) throw error

        // Update the user in the local users array
        const userIndex = users.value.findIndex((u) => u.user_id === selectedUser.value.user_id)
        if (userIndex !== -1) {
          users.value[userIndex] = { ...users.value[userIndex], ...selectedUser.value }
        }

        showNotification('User updated successfully', 'success')
        isEditing.value = false
      } catch (error) {
        console.error('Error updating user:', error)
        showNotification('Failed to update user')
      }
    }

    const toggleAdminStatus = async (user) => {
      try {
        const newAdminStatus = !user.is_admin

        if (user.is_admin) {
          // Remove from admins table
          const { error } = await supabase.from('admins').delete().eq('user_id', user.user_id)

          if (error) throw error
        } else {
          // Add to admins table
          const { error } = await supabase.from('admins').insert([{ user_id: user.user_id }])

          if (error) throw error
        }

        // Update the user in the local users array
        const userIndex = users.value.findIndex((u) => u.user_id === user.user_id)
        if (userIndex !== -1) {
          users.value[userIndex] = {
            ...users.value[userIndex],
            is_admin: newAdminStatus,
          }
          // Also update the selected user if it's the same user
          if (selectedUser.value.user_id === user.user_id) {
            selectedUser.value.is_admin = newAdminStatus
          }
        }

        showNotification(`User ${newAdminStatus ? 'added to' : 'removed from'} admins`, 'success')
      } catch (error) {
        console.error('Error toggling admin status:', error)
        showNotification('Failed to update admin status')
      }
    }

    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteDialog.value = true
    }

    const deleteUser = async () => {
      try {
        // First remove from admins table if they are an admin
        if (userToDelete.value.is_admin) {
          const { error: adminError } = await supabase
            .from('admins')
            .delete()
            .eq('user_id', userToDelete.value.user_id)

          if (adminError) throw adminError
        }

        // Then delete from users table
        const { error: userError } = await supabase
          .from('users')
          .delete()
          .eq('user_id', userToDelete.value.user_id)

        if (userError) throw userError

        // Remove from local users array
        users.value = users.value.filter((u) => u.user_id !== userToDelete.value.user_id)

        // Close dialogs
        showDeleteDialog.value = false
        if (showDetailsDialog.value) {
          showDetailsDialog.value = false
        }

        showNotification('User deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting user:', error)
        showNotification('Failed to delete user')
      } finally {
        userToDelete.value = null
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      columns,
      loading,
      pagination,
      search,
      showDetailsDialog,
      selectedUser,
      isEditing,
      toast,
      onRequest,
      onSearch,
      saveUser,
      toggleAdminStatus,
      showUserDetails,
      startEdit,
      cancelEdit,
      showDeleteDialog,
      userToDelete,
      confirmDeleteUser,
      deleteUser,
    }
  },
}
</script>

<style lang="scss" scoped>
$main-bg: #f9fafd;
$card-bg: #fff;
$alt-row: #f3f6fa;
$border: #e3e8ef;
$primary: #2196f3;
$primary-hover: #1976d2;
$text: #222;
$text-light: #666;
$danger: #e53935;
$shadow: 0 2px 12px rgba(33, 150, 243, 0.07);

.admin-users {
  background: $main-bg;
  min-height: 100vh;
  padding-bottom: 32px;
}

.dashboard-title {
  color: $text;
  font-weight: 700;
  margin-bottom: 2rem;
}

.search-input {
  background: $card-bg;
  border-radius: 12px;
  color: $text;
  border: 1.5px solid $border;
  box-shadow: $shadow;
  margin-bottom: 1rem;
  transition:
    border 0.2s,
    box-shadow 0.2s;
  &:focus-within {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
}

.users-table-card {
  background: $card-bg;
  border-radius: 18px;
  box-shadow: $shadow;
  overflow: hidden;
  margin-top: 24px;
  padding: 0 0 16px 0;
}

.users-table {
  .q-table__top,
  .q-table__bottom {
    background: $main-bg;
    border-bottom: 1px solid $border;
    color: $text;
  }
  .q-table__bottom {
    border-top: 1px solid $border;
  }
  .q-table thead th {
    font-weight: 700;
    color: $text;
    background: $main-bg;
    border-bottom: 2px solid $border;
  }
  .q-table tbody tr {
    background: $card-bg;
    &:nth-child(even) {
      background: $alt-row;
    }
    &:hover {
      background: #f0f6ff;
    }
  }
  .q-table tbody td {
    color: $text;
    border-bottom: 1px solid $border;
    font-size: 1rem;
    padding: 12px 8px;
  }
}

.status-chip {
  background: none !important;
  border: none !important;
  color: #2196f3 !important;
  font-weight: 700;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  font-size: inherit;
  &.admin {
    color: #e53935 !important;
  }
}

.action-btn {
  background: none !important;
  border: none !important;
  color: #2196f3 !important;
  min-width: 32px;
  min-height: 32px;
  font-size: inherit;
  border-radius: 50%;
  margin: 0 2px;
  transition: color 0.15s;
  &:hover {
    color: #1976d2 !important;
    background: none !important;
    transform: scale(1.08);
  }
  &.delete,
  &.admin {
    color: #e53935 !important;
    &:hover {
      color: #b71c1c !important;
    }
  }
}

.create-btn {
  background: $primary;
  color: #fff;
  border-radius: 32px;
  font-weight: 700;
  font-size: 1.1em;
  padding: 12px 32px;
  box-shadow: $shadow;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
  &:hover {
    background: $primary-hover;
  }
}

.edit-dialog {
  background: $card-bg;
  color: $text;
  border-radius: 18px;
  box-shadow: $shadow;
  .q-card-section {
    padding: 24px;
    background: $main-bg;
    border-radius: 18px 18px 0 0;
  }
  .q-input {
    margin-bottom: 16px;
    background: $card-bg;
    color: $text;
    border: 1.5px solid $border;
  }
}

.details-dialog {
  min-width: 600px;
  max-width: 800px;
  background: $card-bg;
  color: $text;
  border-radius: 18px;
  box-shadow: $shadow;

  .q-card-section {
    padding: 24px;
    background: $main-bg;
    border-radius: 18px 18px 0 0;
  }

  .q-item {
    padding: 8px 16px;
    background: $card-bg;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .q-item-label {
    font-size: 1rem;
    &--caption {
      color: $text-light;
      font-size: 0.9rem;
    }
  }
}

// Responsive adjustments
@media (max-width: 900px) {
  .users-table-card {
    border-radius: 0;
  }
}
@media (max-width: 600px) {
  .dashboard-title {
    font-size: 1.3rem;
  }
  .users-table-card {
    margin: 0 -8px;
    border-radius: 0;
  }
  .search-input {
    font-size: 0.95em;
  }
  .details-dialog {
    min-width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
