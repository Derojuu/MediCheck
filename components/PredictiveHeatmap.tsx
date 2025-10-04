// components/PredictiveHeatmap.tsx - AI-powered counterfeit hotspot prediction visualization
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, MapPin, TrendingUp, Zap, RefreshCw, Activity } from "lucide-react";

// Fix Leaflet icons in Next.js
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Interfaces matching your API
interface HotspotPrediction {
  latitude: number;
  longitude: number;
  region: string;
  riskScore: number;
  predictedTimeframe: string;
  confidence: number;
  historicalIncidents: number;
  riskFactors: string[];
}

interface PredictionMetadata {
  timeWindow: number;
  riskThreshold: number;
  totalAreasAnalyzed: number;
  dataPoints: number;
  predictionDate: string;
  modelAccuracy?: number;
  highRiskAreas?: number;
  mediumRiskAreas?: number;
  lowRiskAreas?: number;
  averageRiskScore?: number;
  topRiskRegion?: string;
  status?: string;
  featuresGenerated?: number;
}

interface Props {
  region?: string;
  height?: string;
  showControls?: boolean;
  autoRefresh?: boolean;
}

export default function PredictiveHeatmap({ 
  region, 
  height = "600px", 
  showControls = true, 
  autoRefresh = false 
}: Props) {
  
  const [predictions, setPredictions] = useState<HotspotPrediction[]>([]);
  const [metadata, setMetadata] = useState<PredictionMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter controls
  const [selectedRegion, setSelectedRegion] = useState(region || 'all');
  const [timeWindow, setTimeWindow] = useState(30);
  const [riskThreshold, setRiskThreshold] = useState(0.01); // Very low threshold for testing
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers' | 'both'>('both');

  // Load predictions from your hotspot API
  const loadPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/hotspots/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion === 'all' ? undefined : selectedRegion,
          timeWindow,
          riskThreshold,
          includeHistorical: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to load predictions: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions || []);
        setMetadata(data.metadata);
        console.log(`Loaded ${data.predictions?.length || 0} hotspot predictions`);
      } else {
        setError(data.error || 'Failed to load predictions');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Prediction loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and auto-refresh
  useEffect(() => {
    loadPredictions();
    
    if (autoRefresh) {
      const interval = setInterval(loadPredictions, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [selectedRegion, timeWindow, riskThreshold]);

  // Risk score color coding
  const getRiskColor = (riskScore: number): string => {
    if (riskScore >= 0.8) return '#dc2626'; // red-600
    if (riskScore >= 0.6) return '#ea580c'; // orange-600  
    if (riskScore >= 0.4) return '#d97706'; // amber-600
    return '#65a30d'; // lime-600
  };

  // Risk level badge
  const getRiskLevel = (riskScore: number): { level: string; variant: "default" | "secondary" | "destructive" } => {
    if (riskScore >= 0.8) return { level: 'Critical', variant: 'destructive' };
    if (riskScore >= 0.6) return { level: 'High', variant: 'destructive' };
    if (riskScore >= 0.4) return { level: 'Medium', variant: 'secondary' };
    return { level: 'Low', variant: 'default' };
  };

  // Timeframe urgency icon
  const getUrgencyIcon = (timeframe: string) => {
    if (timeframe.includes('1-7 days')) return <Zap className="h-4 w-4 text-red-500" />;
    if (timeframe.includes('1-2 weeks')) return <Clock className="h-4 w-4 text-orange-500" />;
    return <TrendingUp className="h-4 w-4 text-yellow-500" />;
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Prediction Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPredictions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Prediction Controls
            </CardTitle>
            <CardDescription>
              Configure AI-powered counterfeit hotspot analysis parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Ogun">Ogun</SelectItem>
                    <SelectItem value="Rivers">Rivers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Window</label>
                <Select value={timeWindow.toString()} onValueChange={val => setTimeWindow(Number(val))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Risk</label>
                <Select value={riskThreshold.toString()} onValueChange={val => setRiskThreshold(Number(val))}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.01">1%</SelectItem>
                    <SelectItem value="0.1">10%</SelectItem>
                    <SelectItem value="0.3">30%</SelectItem>
                    <SelectItem value="0.5">50%</SelectItem>
                    <SelectItem value="0.7">70%</SelectItem>
                    <SelectItem value="0.9">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">View</label>
                <Select value={viewMode} onValueChange={(val: any) => setViewMode(val)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markers">Markers</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={loadPredictions} 
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            AI Counterfeit Hotspot Predictions
          </CardTitle>
          <CardDescription>
            Machine learning predictions showing where counterfeit drugs are likely to appear next
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height, width: '100%' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating AI predictions...</span>
                </div>
              </div>
            ) : (
              <MapContainer
                center={[9.0820, 8.6753]} // Center of Nigeria
                zoom={6}
                style={{ height: '500px', width: '100%' }}
                className="rounded-b-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Render predictions */}
                {predictions.map((pred, index) => {
                  const riskInfo = getRiskLevel(pred.riskScore);
                  
                  return (
                    <div key={index}>
                      {/* Risk Circle */}
                      <Circle
                        center={[pred.latitude, pred.longitude]}
                        radius={pred.riskScore * 15000} // Scale radius by risk
                        pathOptions={{
                          color: getRiskColor(pred.riskScore),
                          fillColor: getRiskColor(pred.riskScore),
                          fillOpacity: 0.3,
                          weight: 2
                        }}
                      />

                      {/* Info Marker */}
                      <Marker position={[pred.latitude, pred.longitude]}>
                        <Popup>
                          <div className="p-2 space-y-2 min-w-[250px]">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{pred.region}</h3>
                              <Badge variant={riskInfo.variant}>
                                {riskInfo.level}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Risk Score:</span>
                                <span className="font-medium">
                                  {(pred.riskScore * 100).toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span>Predicted:</span>
                                <span className="flex items-center gap-1">
                                  {getUrgencyIcon(pred.predictedTimeframe)}
                                  {pred.predictedTimeframe}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span>Confidence:</span>
                                <span className="font-medium">
                                  {(pred.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span>Historical:</span>
                                <span className="font-medium">
                                  {pred.historicalIncidents} incidents
                                </span>
                              </div>

                              {pred.riskFactors && pred.riskFactors.length > 0 && (
                                <div className="pt-2 border-t">
                                  <p className="text-xs font-medium mb-1">Risk Factors:</p>
                                  <ul className="text-xs space-y-1">
                                    {pred.riskFactors.map((factor, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span className="text-red-500">•</span>
                                        {factor}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </div>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {metadata && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {metadata.totalAreasAnalyzed}
              </div>
              <p className="text-xs text-muted-foreground">Areas Analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {metadata.dataPoints}
              </div>
              <p className="text-xs text-muted-foreground">Data Points Used</p>
            </CardContent>
          </Card>

          {(metadata as any).modelAccuracy !== undefined && (
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {((metadata as any).modelAccuracy * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Model Accuracy</p>
              </CardContent>
            </Card>
          )}

          {(metadata as any).highRiskAreas !== undefined && (
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {(metadata as any).highRiskAreas}
                </div>
                <p className="text-xs text-muted-foreground">High Risk Areas</p>
              </CardContent>
            </Card>
          )}

          {(metadata as any).averageRiskScore !== undefined && (
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {((metadata as any).averageRiskScore * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average Risk</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}