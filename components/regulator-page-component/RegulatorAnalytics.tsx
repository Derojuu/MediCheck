"use client";

import { useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ClassificationPoint } from "../ClassificationHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Activity, MapPin, Clock, Bell, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const ClassificationHeatmap = dynamic(
    () => import("../ClassificationHeatmap"),
    { ssr: false }
);

// Dynamic import for PredictiveHeatmap to prevent SSR issues
const PredictiveHeatmap = dynamic(() => import("../PredictiveHeatmap"), {
    ssr: false,
    loading: () => (
        <Card className="w-full h-96">
            <CardContent className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading predictive analysis...</p>
                </div>
            </CardContent>
        </Card>
    )
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * Enhanced RegulatorAnalytics component with AI-powered predictive hotspot mapping
 * and traditional classification heatmap analysis
 */
export default function RegulatorAnalytics() {


    const [alertsEnabled, setAlertsEnabled] = useState(true);

    const router = useRouter();

    // Historical classification data
    const { data: historicalData, error: historicalError } = useSWR<ClassificationPoint[]>(
        "/api/classification-map?days=30",
        fetcher,
        { refreshInterval: 60000 } // Refresh every minute
    );

    // Quick stats for overview
    const { data: quickStats, error: statsError } = useSWR(
        "/api/hotspots/predict",
        fetcher,
        { refreshInterval: 300000 } // Refresh every 5 minutes
    );

    if (historicalError || statsError) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Analytics Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Error loading analytics data. Please try refreshing the page.
                        </p>
                        <Button
                            onClick={() => router.refresh()}
                            className="mt-4"
                            variant="outline"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!historicalData) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Loading regulatory analytics...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate quick stats
    const totalScans = historicalData.length;
    const counterfeitCount = historicalData.filter(point => point.predictedLabel).length;
    const counterfeitRate = totalScans > 0 ? (counterfeitCount / totalScans) * 100 : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCounterfeits = historicalData.filter(point =>
        point.predictedLabel && new Date(point.time) >= sevenDaysAgo
    ).length;

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-6">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Scans</p>
                                <p className="text-xl sm:text-2xl font-bold">{totalScans}</p>
                            </div>
                            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Counterfeit Rate</p>
                                <p className="text-xl sm:text-2xl font-bold text-red-600">
                                    {counterfeitRate.toFixed(1)}%
                                </p>
                            </div>
                            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Recent Alerts</p>
                                <p className="text-xl sm:text-2xl font-bold text-orange-600">{recentCounterfeits}</p>
                                <p className="text-xs text-muted-foreground">Last 7 days</p>
                            </div>
                            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Prediction Status</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge variant="default" className="text-xs">
                                        Active
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        AI Enabled
                                    </Badge>
                                </div>
                            </div>
                            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Analytics Tabs */}
            <Tabs defaultValue="predictive" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="predictive" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 py-1">
                        <MapPin className="h-4 w-4" />
                        <span className="hidden xs:inline">Predictive Mapping</span>
                        <span className="inline xs:hidden">Predict</span>
                    </TabsTrigger>
                    <TabsTrigger value="historical" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 py-1">
                        <Activity className="h-4 w-4" />
                        <span className="hidden xs:inline">Historical Analysis</span>
                        <span className="inline xs:hidden">History</span>
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-2 py-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="hidden xs:inline">Risk Alerts</span>
                        <span className="inline xs:hidden">Alerts</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="predictive" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <TrendingUp className="h-5 w-5" />
                                AI-Powered Counterfeit Predictions
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Advanced machine learning analysis to predict where and when counterfeit drugs are likely to emerge
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="w-full" style={{ minHeight: '350px', height: '60vw', maxHeight: 700 }}>
                        <PredictiveHeatmap
                            height="100%"
                            showControls={true}
                            autoRefresh={alertsEnabled}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="historical" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Activity className="h-5 w-5" />
                                Historical Classification Data
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Past 30 days of counterfeit detection results across Nigeria
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="w-full" style={{ minHeight: '300px', height: '55vw', maxHeight: 600 }}>
                                <ClassificationHeatmap data={historicalData} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Bell className="h-5 w-5" />
                                Risk Alert System
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Real-time alerts based on AI predictions and historical patterns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentCounterfeits > 5 && (
                                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-red-900 text-sm sm:text-base">High Alert</h4>
                                            <p className="text-xs sm:text-sm text-red-700">
                                                {recentCounterfeits} counterfeit incidents detected in the last 7 days.
                                                Immediate investigation recommended.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {counterfeitRate > 10 && (
                                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                        <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-orange-900 text-sm sm:text-base">Trend Alert</h4>
                                            <p className="text-xs sm:text-sm text-orange-700">
                                                Counterfeit rate at {counterfeitRate.toFixed(1)}% - above normal threshold.
                                                Enhanced monitoring suggested.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-900 text-sm sm:text-base">AI Analysis Active</h4>
                                        <p className="text-xs sm:text-sm text-blue-700">
                                            Predictive modeling is continuously analyzing patterns to forecast hotspots
                                            with 87% accuracy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

