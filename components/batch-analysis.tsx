"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertTriangle, CheckCircle, Package, Filter } from "lucide-react"

export function BatchAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [selectedBatch, setSelectedBatch] = useState("all")

  const verificationTrends = [
    { month: "Jan", verified: 1240, flagged: 23, pending: 45 },
    { month: "Feb", verified: 1356, flagged: 18, pending: 32 },
    { month: "Mar", verified: 1489, flagged: 31, pending: 28 },
    { month: "Apr", verified: 1623, flagged: 15, pending: 41 },
    { month: "May", verified: 1789, flagged: 27, pending: 35 },
    { month: "Jun", verified: 1945, flagged: 12, pending: 29 },
  ]

  const batchDistribution = [
    { name: "Verified", value: 1945, color: "#10b981" },
    { name: "Flagged", value: 12, color: "#ef4444" },
    { name: "Pending", value: 29, color: "#f59e0b" },
  ]

  const topBatches = [
    { id: "PAR2024001", product: "Paracetamol 500mg", verifications: 234, status: "active", risk: "low" },
    { id: "AMX2024002", product: "Amoxicillin 250mg", verifications: 189, status: "active", risk: "low" },
    { id: "IBU2024003", product: "Ibuprofen 400mg", verifications: 156, status: "flagged", risk: "high" },
    { id: "MET2024004", product: "Metformin 500mg", verifications: 143, status: "active", risk: "medium" },
    { id: "ASP2024005", product: "Aspirin 75mg", verifications: 128, status: "active", risk: "low" },
  ]

  const riskAnalysis = [
    { category: "Supply Chain", score: 85, status: "good" },
    { category: "Authentication", score: 92, status: "excellent" },
    { category: "Distribution", score: 78, status: "good" },
    { category: "Compliance", score: 95, status: "excellent" },
    { category: "Quality Control", score: 88, status: "good" },
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Batch Filter</label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-40 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="flagged">Flagged Only</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="cursor-pointer">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,986</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-25%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+0.8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="cursor-pointer">
            Verification Trends
          </TabsTrigger>
          <TabsTrigger value="distribution" className="cursor-pointer">
            Batch Distribution
          </TabsTrigger>
          <TabsTrigger value="performance" className="cursor-pointer">
            Top Batches
          </TabsTrigger>
          <TabsTrigger value="risk" className="cursor-pointer">
            Risk Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Trends</CardTitle>
              <CardDescription>Monthly verification statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={verificationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Status Distribution</CardTitle>
                <CardDescription>Current status of all batches</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={batchDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {batchDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
                <CardDescription>Verification volume by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={verificationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="verified" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Batches</CardTitle>
              <CardDescription>Batches with highest verification activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBatches.map((batch, index) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-sm font-bold text-cyan-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{batch.product}</p>
                        <p className="text-sm text-gray-600">Batch ID: {batch.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{batch.verifications}</p>
                        <p className="text-sm text-gray-600">verifications</p>
                      </div>
                      <Badge variant={batch.status === "active" ? "default" : "destructive"}>{batch.status}</Badge>
                      <Badge
                        variant={
                          batch.risk === "low" ? "default" : batch.risk === "medium" ? "secondary" : "destructive"
                        }
                      >
                        {batch.risk} risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Security and compliance risk analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskAnalysis.map((risk) => (
                  <div key={risk.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{risk.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{risk.score}/100</span>
                        <Badge
                          variant={
                            risk.status === "excellent"
                              ? "default"
                              : risk.status === "good"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          risk.status === "excellent"
                            ? "bg-emerald-600"
                            : risk.status === "good"
                              ? "bg-blue-600"
                              : "bg-red-600"
                        }`}
                        style={{ width: `${risk.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
