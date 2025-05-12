<template>
  <q-page-container class="profile-container">
    <NavBar />
    <div class="profile-content">
      <!-- Back Button -->
      <q-btn flat round color="dark" icon="arrow_back" to="/" class="back-button" />

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Left Column -->
        <div class="left-column">
          <!-- User Profile Card -->
          <div class="profile-card">
            <div class="profile-picture">
              <ProfilePicture
                :userId="userData.user_id"
                :initialAvatar="userAvatar"
                @updateAvatar="userAvatar = $event"
                class="avatar-image"
              />
            </div>
            <div class="profile-info">
              <h1 class="user-name">{{ userData.first_name || 'Loading...' }}</h1>
              <p class="user-title">
                Back2Home {{ userPlan.plan_name === 'pro' ? 'Pro' : '' }} Member
              </p>
              <div class="action-buttons">
                <q-btn
                  unelevated
                  rounded
                  class="action-btn"
                  :label="userPlan.plan_name.toUpperCase()"
                />
                <q-btn flat round color="dark" @click="router.push('/AccountSettings')">
                  <q-icon name="settings" />
                </q-btn>
                <q-btn flat round color="dark" @click="router.push('/Security')">
                  <q-icon name="shield" />
                </q-btn>
                <q-btn flat round color="red" @click="logout">
                  <q-icon name="logout" />
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Plan Section -->
          <div class="plan-card">
            <h2>Current Plan</h2>
            <div class="plan-content">
              <div class="plan-header">
                <h3>{{ userPlan.plan_name === 'pro' ? 'Pro Plan' : 'Free Plan' }}</h3>
                <q-btn
                  v-if="userPlan.plan_name === 'free'"
                  unelevated
                  rounded
                  class="upgrade-btn"
                  label="Upgrade Plan"
                  @click="router.push('/MyPlan')"
                />
                <q-btn
                  v-if="userPlan.plan_name === 'pro'"
                  unelevated
                  rounded
                  class="delete-subscription-btn"
                  label="Delete Subscription"
                  @click="deleteSubscription"
                />
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <q-icon name="check_circle" color="positive" />
                  <span>Basic Report Creation</span>
                </div>
                <div class="feature-item">
                  <q-icon name="check_circle" color="positive" />
                  <span>Limited Search Access</span>
                </div>
                <div class="feature-item" :class="{ disabled: userPlan.plan_name === 'free' }">
                  <q-icon
                    :name="userPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                    :color="userPlan.plan_name === 'pro' ? 'positive' : 'grey'"
                  />
                  <span>Advanced Analytics</span>
                </div>
                <div class="feature-item" :class="{ disabled: userPlan.plan_name === 'free' }">
                  <q-icon
                    :name="userPlan.plan_name === 'pro' ? 'check_circle' : 'cancel'"
                    :color="userPlan.plan_name === 'pro' ? 'positive' : 'grey'"
                  />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Dashboard Section -->
          <div class="dashboard-card">
            <h2>Activity Dashboard</h2>
            <div class="dashboard-grid">
              <!-- Reports Overview Chart -->
              <div class="chart-card">
                <h3>Reports Overview</h3>
                <div class="chart-container">
                  <PieChart :chartData="reportsData" />
                </div>
              </div>

              <!-- Activity Timeline Chart -->
              <div class="chart-card">
                <h3>Report Activity</h3>
                <div class="chart-container">
                  <LineChart :chartData="activityData" />
                </div>
              </div>

              <!-- Report Types Chart -->
              <div class="chart-card">
                <h3>Report Types</h3>
                <div class="chart-container">
                  <BarChart :chartData="reportTypesData" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </q-page-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import ProfilePicture from 'src/components/ProfilePicture.vue'
import NavBar from 'src/components/NavBar.vue'
import FooterComponent from 'src/components/Footer.vue'
import PieChart from 'src/components/charts/PieChart.vue'
import LineChart from 'src/components/charts/LineChart.vue'
import BarChart from 'src/components/charts/BarChart.vue'

export default {
  components: {
    ProfilePicture,
    NavBar,
    FooterComponent,
    PieChart,
    LineChart,
    BarChart,
  },
  setup() {
    const router = useRouter()
    const userData = ref({})
    const userAvatar = ref('https://cdn-icons-png.flaticon.com/512/149/149071.png')
    const userPlan = ref({
      plan_name: 'free',
      plan_price: 0,
      plan_role: 'free_user',
      plan_id: 1,
    })

    // Chart data
    const reportsData = ref({
      labels: ['Active', 'Resolved', 'Pending'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
        },
      ],
    })

    const activityData = ref({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Reports Created',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: '#2196F3',
          fill: false,
        },
      ],
    })

    const reportTypesData = ref({
      labels: ['Missing Reports', 'Found Reports'],
      datasets: [
        {
          label: 'Report Types',
          data: [0, 0],
          backgroundColor: ['#4CAF50', '#2196F3'],
        },
      ],
    })

    const fetchUser = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser?.user) {
          router.push('/SignIn')
          return
        }

        // Get user data with plan information
        const { data, error } = await supabase
          .from('users')
          .select(
            `
            user_first_name,
            profile_picture,
            user_id,
            user_plan,
            plan:plan (
              plan_name,
              plan_price,
              plan_role
            )
          `,
          )
          .eq('user_id', authUser.user.id)
          .single()

        if (error) throw error

        userData.value = { first_name: data.user_first_name, user_id: data.user_id }
        userAvatar.value = data.profile_picture || userAvatar.value

        // Set user's plan from the database
        if (data.plan) {
          userPlan.value = {
            plan_id: data.plan_id,
            plan_name: data.plan.plan_name,
            plan_price: data.plan.plan_price,
            plan_role: data.plan.plan_role,
          }
        }

        // Fetch user's reports for charts
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', authUser.user.id)

        console.log('Auth User ID:', authUser.user.id)
        console.log('Reports data:', reports)
        console.log('Reports error:', reportsError)

        if (!reportsError && reports) {
          // Update reports overview data
          const active = reports.filter((r) => r.report_status === 'open').length
          const resolved = reports.filter((r) => r.report_status === 'resolved').length
          const pending = reports.filter((r) => r.report_status === 'pending').length

          console.log('Report counts:', { active, resolved, pending })
          reportsData.value = {
            labels: ['Active', 'Resolved', 'Pending'],
            datasets: [
              {
                data: [active, resolved, pending],
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
              },
            ],
          }
          console.log('Updated reportsData:', JSON.stringify(reportsData.value))

          // Update activity timeline data
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

          const monthlyData = new Array(6).fill(0)
          reports.forEach((report) => {
            const reportDate = new Date(report.created_at)
            if (reportDate >= sixMonthsAgo) {
              const monthIndex = reportDate.getMonth()
              monthlyData[monthIndex]++
            }
          })
          console.log('Monthly data:', monthlyData)
          activityData.value = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Reports Created',
                data: monthlyData,
                borderColor: '#2196F3',
                fill: false,
              },
            ],
          }
          console.log('Updated activityData:', JSON.stringify(activityData.value))

          // Update report types data
          const missingReports = reports.filter((r) => r.report_type === 'missing').length
          const foundReports = reports.filter((r) => r.report_type === 'found').length
          reportTypesData.value = {
            labels: ['Missing Reports', 'Found Reports'],
            datasets: [
              {
                label: 'Report Types',
                data: [missingReports, foundReports],
                backgroundColor: ['#4CAF50', '#2196F3'],
              },
            ],
          }
          console.log('Updated reportTypesData:', JSON.stringify(reportTypesData.value))
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/SignIn')
    }

    const deleteSubscription = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser?.user) {
          router.push('/SignIn')
          return
        }

        // Update user's plan to free
        const { error } = await supabase
          .from('users')
          .update({ user_plan: 1 }) // Assuming 1 is the ID for free plan
          .eq('user_id', authUser.user.id)

        if (error) throw error

        // Refresh user data
        await fetchUser()
      } catch (err) {
        console.error('Error deleting subscription:', err)
      }
    }

    onMounted(fetchUser)

    return {
      userData,
      userAvatar,
      userPlan,
      router,
      logout,
      deleteSubscription,
      reportsData,
      activityData,
      reportTypesData,
    }
  },
}
</script>

<style scoped>
.profile-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
}

.main-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  margin-top: 40px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: fit-content;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 4px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.profile-info {
  width: 100%;
}

.user-name {
  font-size: 2em;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.user-title {
  color: #666;
  margin: 8px 0 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  background: #00bfff;
  color: white;
  font-weight: 600;
}

.plan-card,
.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.plan-card h2,
.dashboard-card h2 {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.plan-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
  font-weight: 600;
}

.upgrade-btn {
  background: linear-gradient(45deg, #00bfff, #0099ff);
  color: white;
  font-weight: 600;
  padding: 8px 20px;
}

.delete-subscription-btn {
  background: #ff4444;
  color: white;
  font-weight: 600;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.feature-item:hover {
  background: #f8f9fa;
}

.feature-item.disabled {
  color: #999;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-card h3 {
  font-size: 1.1em;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.chart-container {
  height: 250px;
  position: relative;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    flex-direction: row;
    text-align: left;
    padding: 20px;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    margin: 0 20px 0 0;
  }

  .action-buttons {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
  }

  .profile-picture {
    margin: 0 0 20px 0;
  }

  .action-buttons {
    justify-content: center;
  }

  .plan-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
