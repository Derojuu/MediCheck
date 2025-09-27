"use client";

// import { useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { AlertTriangle, TrendingUp, Activity, MapPin, Clock, Bell, RefreshCw } from "lucide-react";
import { ClassificationPoint } from "../ClassificationHeatmap";


// Dynamic import to prevent SSR issues with Leaflet
const ClassificationHeatmap = dynamic(() => import("../ClassificationHeatmap"), {
    ssr: false,
    loading: () => (
        <Card className="w-full h-96">
            <CardContent className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
            </CardContent>
        </Card>
    )
});


// Dynamic import for PredictiveHeatmap to prevent SSR issues
const git  = dynamic(() => import("../PredictiveHeatmap"), {
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

// Loading spinner component
const HeatmapSpinner = () => (
    <Card className="w-full h-96">
        <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Loading classification heatmap data...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">Loading Heatmap</p>
                    <p className="text-sm text-muted-foreground">Analyzing classification data...</p>
                </div>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Error component
const HeatmapError = ({ error }: { error: any }) => (
    <Card className="w-full h-96">
        <CardHeader>
            <CardTitle className="text-red-600">Analytics Dashboard</CardTitle>
            <CardDescription>Failed to load heatmap data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600">Error Loading Data</p>
                    <p className="text-sm text-muted-foreground">Unable to fetch classification data</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    Retry
                </button>
            </div>
        </CardContent>
    </Card>
);

/**
 * RegulatorAnalytics component fetches and displays classification heatmap data for regulators.
 *
 * - Uses SWR to fetch classification points from the `/api/classification-map?days=30` endpoint.
 * - Handles loading and error states gracefully with custom spinner and error components.
 * - Renders the `ClassificationHeatmap` component with the fetched data.
 *
 * @returns {JSX.Element} The rendered heatmap with proper loading states.
 */
export default function RegulatorAnalytics() {
    // Call your new API endpoint:
    const { data, error, isLoading } = useSWR<ClassificationPoint[]>("/api/classification-map?days=30", fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds for real-time data
        revalidateOnFocus: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000
    });

    if (error) return <HeatmapError error={error} />;
    if (isLoading || !data) return <HeatmapSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Classification heatmap and regional analysis</p>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-muted-foreground">Live Data</span>
                    </div>
                </div>
            </div>
            <ClassificationHeatmap data={data} />
        </div>
    );
}
