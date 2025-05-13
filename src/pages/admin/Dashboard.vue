<template>
  <q-page padding class="admin-dashboard">
    <div class="text-h4 dashboard-title q-mb-lg">Dashboard</div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card users-card" :class="{ 'animate-in': true }">
          <q-card-section class="stat-card-content">
            <div class="row items-center">
              <q-icon name="people" size="2.5em" class="q-mr-md stat-icon" />
              <div>
                <div class="text-h6 stat-label">Total Users</div>
                <div class="text-h3 stat-value">{{ stats.totalUsers }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card reports-card" :class="{ 'animate-in': true }">
          <q-card-section class="stat-card-content">
            <div class="row items-center">
              <q-icon name="description" size="2.5em" class="q-mr-md stat-icon" />
              <div>
                <div class="text-h6 stat-label">Total Reports</div>
                <div class="text-h3 stat-value">{{ stats.totalReports }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card missing-card" :class="{ 'animate-in': true }">
          <q-card-section class="stat-card-content">
            <div class="row items-center">
              <q-icon name="search_off" size="2.5em" class="q-mr-md stat-icon" />
              <div>
                <div class="text-h6 stat-label">Missing Reports</div>
                <div class="text-h3 stat-value">{{ stats.missingReports }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card found-card" :class="{ 'animate-in': true }">
          <q-card-section class="stat-card-content">
            <div class="row items-center">
              <q-icon name="check_circle" size="2.5em" class="q-mr-md stat-icon" />
              <div>
                <div class="text-h6 stat-label">Found Reports</div>
                <div class="text-h3 stat-value">{{ stats.foundReports }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row q-col-gutter-lg q-mt-xl">
      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section class="chart-header">
            <div class="text-h6 chart-title">Reports Overview</div>
          </q-card-section>
          <q-card-section>
            <div class="chart-container">
              <canvas ref="reportsChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="chart-card">
          <q-card-section class="chart-header">
            <div class="text-h6 chart-title">User Activity</div>
          </q-card-section>
          <q-card-section>
            <div class="chart-container">
              <canvas ref="activityChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="row q-mt-xl">
      <div class="col-12">
        <q-card class="activity-card">
          <q-card-section class="activity-header">
            <div class="text-h6 activity-title">Recent Activity</div>
          </q-card-section>
          <q-card-section>
            <q-list separator class="activity-list">
              <q-item v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <q-item-section avatar>
                  <q-icon
                    :name="activity.icon"
                    :color="activity.icon === 'mdi-alert' ? 'negative' : 'positive'"
                    size="1.5em"
                    class="activity-icon"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium activity-label">{{
                    activity.title
                  }}</q-item-label>
                  <q-item-label caption class="activity-time">{{ activity.time }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  setup() {
    const stats = ref({
      totalUsers: 0,
      totalReports: 0,
      missingReports: 0,
      foundReports: 0,
    })

    const recentActivity = ref([])
    const loading = ref(false)
    const $q = useQuasar()
    const reportsChart = ref(null)
    const activityChart = ref(null)

    const fetchStats = async () => {
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

        // Fetch total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })

        if (usersError) throw usersError

        // Fetch reports with their subtypes
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select(
            `
            *,
            missing_reports!left(*),
            found_reports!left(*)
          `,
          )
          .order('created_at', { ascending: false })

        if (reportsError) throw reportsError

        // Calculate statistics
        const totalReports = reportsData.length
        const missingReports = reportsData.filter((r) => r.report_type === 'missing').length
        const foundReports = reportsData.filter((r) => r.report_type === 'found').length

        // Get user activity data (new users per month)
        const { data: userActivity, error: activityError } = await supabase
          .from('users')
          .select('user_id')
          .order('user_id', { ascending: true })

        if (activityError) throw activityError

        // Process user activity data for the chart
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        const userActivityData = new Array(12).fill(0)

        // Since we don't have created_at, we'll use a simple distribution for demo
        // In a real app, you'd want to add a created_at column to the users table
        userActivity.forEach((_, index) => {
          const month = index % 12
          userActivityData[month]++
        })

        stats.value = {
          totalUsers,
          totalReports,
          missingReports,
          foundReports,
        }

        recentActivity.value = reportsData.slice(0, 5).map((activity) => ({
          id: activity.id,
          title: activity.report_type === 'missing' ? 'Missing Report' : 'Found Report',
          time: new Date(activity.created_at).toLocaleString(),
          icon: activity.report_type === 'missing' ? 'mdi-alert' : 'mdi-check',
        }))

        // Initialize charts with real data
        initializeCharts(missingReports, foundReports, months, userActivityData)
      } catch (error) {
        console.error('Error fetching stats:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to fetch dashboard statistics',
          position: 'top',
          timeout: 2000,
        })
      } finally {
        loading.value = false
      }
    }

    const initializeCharts = (missingCount, foundCount, months, userActivityData) => {
      // Reports Overview Chart
      const reportsCtx = reportsChart.value.getContext('2d')
      new Chart(reportsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Missing', 'Found'],
          datasets: [
            {
              data: [missingCount, foundCount],
              backgroundColor: ['#E85002', '#008080'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#222',
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      })

      // User Activity Chart
      const activityCtx = activityChart.value.getContext('2d')
      new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'New Users',
              data: userActivityData,
              borderColor: '#00B1B1',
              backgroundColor: 'rgba(0, 177, 177, 0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#222',
                font: {
                  size: 12,
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: '#A7A7A7',
              },
              grid: {
                color: '#0B262B',
              },
            },
            x: {
              ticks: {
                color: '#A7A7A7',
              },
              grid: {
                color: '#0B262B',
              },
            },
          },
        },
      })
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      stats,
      recentActivity,
      loading,
      reportsChart,
      activityChart,
    }
  },
}
</script>

<style lang="scss" scoped>
$main-bg: #f9fafd;
$card-bg: #fff;
$primary: #2196f3;
$primary-hover: #1976d2;
$success: #43a047;
$warning: #ff9800;
$gray: #e3e8ef;
$text: #222;
$text-light: #666;
$shadow: 0 2px 12px rgba(33, 150, 243, 0.07);

.admin-dashboard {
  background: $main-bg;
  min-height: 100vh;
  padding-bottom: 32px;
}

.dashboard-title {
  color: $text;
  font-weight: 700;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 18px;
  box-shadow: $shadow;
  color: $text;
  background: $card-bg;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  margin-bottom: 16px;
  &:hover {
    box-shadow: 0 4px 24px rgba(33, 150, 243, 0.13);
    transform: translateY(-2px) scale(1.02);
  }
  &.users-card {
    border-top: 4px solid $primary;
  }
  &.reports-card {
    border-top: 4px solid $success;
  }
  &.missing-card {
    border-top: 4px solid $warning;
  }
  &.found-card {
    border-top: 4px solid $gray;
  }
  .stat-card-content {
    padding: 1.5rem 1.2rem;
    display: flex;
    align-items: center;
  }
  .stat-icon {
    color: $primary;
    margin-right: 1rem;
    font-size: 2.5em;
  }
  .stat-label {
    font-size: 1rem;
    color: $text-light;
    margin-bottom: 0.5rem;
  }
  .stat-value {
    font-weight: 700;
    font-size: 2rem;
    color: $text;
    margin: 0;
  }
}

.chart-card,
.activity-card {
  border-radius: 18px;
  background: $card-bg;
  box-shadow: $shadow;
  margin-bottom: 24px;
  .chart-header,
  .activity-header {
    border-bottom: 1px solid $gray;
    padding: 1.25rem;
    background: $main-bg;
    border-radius: 18px 18px 0 0;
  }
  .chart-title,
  .activity-title {
    color: $text;
    font-weight: 700;
    margin: 0;
  }
  .chart-container {
    padding: 1rem;
    height: 300px;
  }
  .activity-list {
    padding: 0.5rem;
  }
  .activity-item {
    padding: 1rem;
    border-bottom: 1px solid $gray;
    &:hover {
      background: #f0f6ff;
    }
  }
  .activity-icon {
    padding: 0.5rem;
    border-radius: 50%;
    background: $primary;
    color: #fff;
  }
  .activity-label {
    font-size: 1rem;
    color: $text;
  }
  .activity-time {
    font-size: 0.875rem;
    color: $text-light;
  }
}

.animate-in {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
