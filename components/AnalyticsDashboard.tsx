'use client'

import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  overview: {
    totalBatches: number
    totalProducts: number
    totalUnits: number
    teamMembersCount: number
    counterfeitReports: number
  }
  distributions: {
    batchStatus: Array<{ status: string; count: number }>
    unitStatus: Array<{ status: string; count: number }>
    scanResults: Array<{ result: string; count: number }>
    transferStatus: Array<{ status: string; count: number }>
  }
  trends: {
    dailyActivity: Array<{
      date: string
      count: number
      genuine: number
      suspicious: number
    }>
    recentBatches: Array<{
      id: string
      batchId: string
      drugName: string
      status: string
      createdAt: string
      unitsCount: number
      scansCount: number
    }>
  }
  transfers: {
    recent: Array<{
      id: string
      batchId: string
      drugName: string
      from: string
      to: string
      status: string
      date: string
    }>
  }
  organizationType: string
  specificMetrics?: any
  timeRange: number
  generatedAt: string
}

interface AnalyticsDashboardProps {
  organizationId?: string // Optional since API gets it from user
  dashboardType: 'manufacturer' | 'hospital' | 'pharmacy' | 'distributor' | 'regulator'
  title?: string
  className?: string
}

// Color schemes for different chart elements
const CHART_COLORS = {
  primary: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  status: {
    CREATED: '#3b82f6',
    IN_TRANSIT: '#f59e0b',
    DELIVERED: '#10b981',
    FLAGGED: '#ef4444',
    RECALLED: '#dc2626',
    EXPIRED: '#6b7280',
    IN_STOCK: '#10b981',
    DISPATCHED: '#f59e0b',
    SOLD: '#8b5cf6',
    PENDING: '#f59e0b',
    COMPLETED: '#10b981',
    FAILED: '#ef4444',
    GENUINE: '#10b981',
    SUSPICIOUS: '#ef4444'
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function AnalyticsDashboard({
  organizationId,
  dashboardType,
  title = 'Analytics Dashboard',
  className = ''
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30')
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching analytics for dashboard type:', dashboardType)
      
      const params = new URLSearchParams({
        timeRange,
        type: dashboardType
      })
      
      const response = await fetch(`/api/analytics?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics data')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dashboardType, timeRange])

  // Show loading state when data is loading
  if (loading && !data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        {!organizationId && (
          <div className="text-center text-gray-500 mt-4">
            Waiting for organization data...
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  // Overview metrics cards
  const overviewMetrics = [
    {
      title: 'Total Batches',
      value: data.overview.totalBatches,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Products',
      value: data.overview.totalProducts,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Units Produced',
      value: data.overview.totalUnits,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Team Members',
      value: data.overview.teamMembersCount,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  if (data.overview.counterfeitReports > 0) {
    overviewMetrics.push({
      title: 'Counterfeit Reports',
      value: data.overview.counterfeitReports,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">
            {data.organizationType.replace('_', ' ').toLowerCase()} analytics for the last {timeRange} days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className={`grid gap-4 ${
        overviewMetrics.length === 4 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
          : overviewMetrics.length === 5 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold">{formatNumber(metric.value)}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Scan Activity</CardTitle>
            <CardDescription>
              Genuine vs Suspicious scans over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.trends.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'genuine' ? 'Genuine' : name === 'suspicious' ? 'Suspicious' : 'Total'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="genuine"
                  stackId="1"
                  stroke={CHART_COLORS.status.GENUINE}
                  fill={CHART_COLORS.status.GENUINE}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  stackId="1"
                  stroke={CHART_COLORS.status.SUSPICIOUS}
                  fill={CHART_COLORS.status.SUSPICIOUS}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Batch Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status Distribution</CardTitle>
            <CardDescription>
              Current status of all batches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.distributions.batchStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {data.distributions.batchStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS.status[entry.status as keyof typeof CHART_COLORS.status] || CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Unit Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Status Overview</CardTitle>
            <CardDescription>
              Distribution of unit statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.distributions.unitStatus} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transfer Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer Status</CardTitle>
            <CardDescription>
              {dashboardType === 'manufacturer' ? 'Outgoing' : 'Incoming'} transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.distributions.transferStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Batches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
            <CardDescription>
              Latest batch activity in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trends.recentBatches.slice(0, 5).map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{batch.drugName}</p>
                    <p className="text-sm text-gray-600">Batch: {batch.batchId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={batch.status === 'DELIVERED' ? 'default' : batch.status === 'FLAGGED' ? 'destructive' : 'secondary'}
                      >
                        {batch.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {batch.unitsCount} units • {batch.scansCount} scans
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(batch.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
            <CardDescription>
              Latest transfer activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.transfers.recent.slice(0, 5).map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transfer.drugName}</p>
                    <p className="text-sm text-gray-600">
                      {dashboardType === 'manufacturer' ? 'To: ' : 'From: '}
                      {dashboardType === 'manufacturer' ? transfer.to : transfer.from}
                    </p>
                    <Badge
                      variant={transfer.status === 'COMPLETED' ? 'default' : transfer.status === 'FAILED' ? 'destructive' : 'secondary'}
                      className="mt-1"
                    >
                      {transfer.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(transfer.date)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manufacturer-specific metrics */}
      {dashboardType === 'manufacturer' && data.specificMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Insights</CardTitle>
            <CardDescription>
              Production efficiency and batch analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {data.specificMetrics.avgBatchSize}
                </p>
                <p className="text-sm text-gray-600">Average Batch Size</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {data.specificMetrics.expiringBatches}
                </p>
                <p className="text-sm text-gray-600">Expiring in 90 Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {data.trends.recentBatches.length}
                </p>
                <p className="text-sm text-gray-600">Recent Production</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(data.generatedAt).toLocaleString()}
      </div>
    </div>
  )
}