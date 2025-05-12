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
      >
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
            <q-btn-group flat>
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                @click="editUser(props.row)"
                class="action-btn"
              >
                <q-tooltip>Edit User</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                :color="props.row.is_admin ? 'negative' : 'positive'"
                :icon="props.row.is_admin ? 'person_off' : 'admin_panel_settings'"
                @click="toggleAdminStatus(props.row)"
                class="action-btn"
              >
                <q-tooltip>
                  {{ props.row.is_admin ? 'Remove Admin' : 'Make Admin' }}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </template>

        <!-- Loading State -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </q-card>

    <!-- Edit User Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card class="edit-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingUser.user_first_name"
            label="First Name"
            outlined
            dense
            class=""
          />
          <q-input v-model="editingUser.user_last_name" label="Last Name" outlined dense class="" />
          <q-input v-model="editingUser.phone_number" label="Phone Number" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

export default {
  name: 'AdminUsers',
  setup() {
    const $q = useQuasar()
    const users = ref([])
    const loading = ref(false)
    const search = ref('')
    const showEditDialog = ref(false)
    const editingUser = ref({})

    const columns = [
      { name: 'user_id', label: 'ID', field: 'user_id', align: 'left', sortable: true },
      {
        name: 'name',
        label: 'Name',
        field: (row) => `${row.user_first_name} ${row.user_last_name}`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'phone_number',
        label: 'Phone',
        field: 'phone_number',
        align: 'left',
        sortable: true,
      },
      { name: 'status', label: 'Status', field: 'is_admin', align: 'center', sortable: true },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
    ]

    const pagination = ref({
      sortBy: 'name',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    })

    const showNotification = (message, type = 'negative') => {
      $q.notify({
        type: type,
        message: message,
        position: 'top',
        timeout: 2000,
      })
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

    const editUser = (user) => {
      editingUser.value = { ...user }
      showEditDialog.value = true
    }

    const saveUser = async () => {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            user_first_name: editingUser.value.user_first_name,
            user_last_name: editingUser.value.user_last_name,
            phone_number: editingUser.value.phone_number,
          })
          .eq('user_id', editingUser.value.user_id)

        if (error) throw error

        showNotification('User updated successfully', 'positive')
        showEditDialog.value = false
        fetchUsers()
      } catch (error) {
        console.error('Error updating user:', error)
        showNotification('Failed to update user')
      }
    }

    const toggleAdminStatus = async (user) => {
      try {
        if (user.is_admin) {
          // Remove from admins table
          const { error } = await supabase.from('admins').delete().eq('user_id', user.user_id)

          if (error) throw error
        } else {
          // Add to admins table
          const { error } = await supabase.from('admins').insert([{ user_id: user.user_id }])

          if (error) throw error
        }

        showNotification(`User ${user.is_admin ? 'removed from' : 'added to'} admins`, 'positive')
        fetchUsers()
      } catch (error) {
        console.error('Error toggling admin status:', error)
        showNotification('Failed to update admin status')
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
      showEditDialog,
      editingUser,
      onRequest,
      onSearch,
      editUser,
      saveUser,
      toggleAdminStatus,
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
}
</style>
