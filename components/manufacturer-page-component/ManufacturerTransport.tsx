import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import {
    Truck,
} from "lucide-react";
import { MedicationBatchProp } from "@/utils";
import { ManufacturerTab } from "@/utils"


const ManufacturerTransport = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>> }) => {

    const [batches, setBatches] = useState<MedicationBatchProp[]>([])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transport Management</h1>
                    <p className="text-muted-foreground">Track live shipments and logistics</p>
                </div>
                <Button
                    // onClick={async () => {
                    //     setIsLoadingMockaroo(true)
                    //     try {
                    //         // Generate fresh transport data using Mockaroo
                    //         const mockarooBatches = await mockarooService.generateBatches(3)
                    //         alert(`✅ Generated ${mockarooBatches.length} new transport records using Mockaroo API!`)
                    //     } catch (error) {
                    //         alert('⚠️ Mockaroo API unavailable, using sample transport data')
                    //     }
                    //     setIsLoadingMockaroo(false)
                    // }}
                    // disabled={isLoadingMockaroo}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                    {/* {isLoadingMockaroo ? (
                        <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                            Loading...
                        </>
                    ) : (
                        <>
                            <Truck className="h-4 w-4 mr-2" />
                            Refresh Transport Data
                        </>
                    )} */}
                    <>
                        <Truck className="h-4 w-4 mr-2" />
                        Refresh Transport Data
                    </>
                </Button>
            </div>

            {/* Active Shipments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {batches.filter(batch => batch.status === "IN_TRANSIT").map((batch) => (
                    <Card
                        key={batch.batchId}
                        className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                                <span
                                    className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg font-bold"
                                >
                                    {batch.batchId}
                                </span>
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                    <Truck className="w-3 h-3 mr-1" />
                                    In Transit
                                </Badge>
                            </CardTitle>
                            <CardDescription className="font-medium">{batch.drugName}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <p className="font-medium">{batch.batchSize?.toLocaleString()} units</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Destination:</span>
                                    <p className="font-medium truncate">{batch.currentLocation}</p>
                                </div>
                            </div>

                            {/* Enhanced Transport Tracking */}
                            {batch.transportTracking && (
                                <div
                                    className="space-y-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-primary">Live Tracking</span>
                                        <span className="text-xs text-muted-foreground">
                                            Updated: {new Date(batch.transportTracking.lastUpdate).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    {/* <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Tracking #:</span>
                                            <p className="font-mono font-medium">{batch.transportTracking.trackingNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Vehicle:</span>
                                            <p className="font-medium">{batch.transportTracking.vehicleId}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Driver:</span>
                                            <p className="font-medium">{batch.transportTracking.driver}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Temperature:</span>
                                            <p className="font-medium text-blue-600">{batch.transportTracking.temperatureControl}</p>
                                        </div>
                                    </div> */}

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">GPS Location:</span>
                                            <span className="font-mono text-green-600">{batch.transportTracking.currentGPS}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Est. Delivery:</span>
                                            <span className="font-medium">{new Date(batch.transportTracking.estimatedDelivery).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {/* 
                                    <div className="pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs bg-transparent border-primary/30 hover:bg-primary/10"
                                            onClick={() => alert(`📍 Live GPS Tracking\n\nBatch: ${batch.batchId}\nLocation: ${batch.transportTracking.currentGPS}\nRoute: ${batch.transportTracking.route}\nMethod: ${batch.transportTracking.transportMethod}\n\n🌡️ Temperature: ${batch.transportTracking.temperatureControl}\n📱 Real-time monitoring active`)}
                                        >
                                            <MapPin className="w-3 h-3 mr-1" />
                                            View Live GPS
                                        </Button>
                                    </div> */}
                                </div>
                            )}

                            {!batch.transportTracking && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-700">Basic transport mode - GPS tracking not available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* Show message if no active transports */}
                {batches.filter(batch => batch.status === "IN_TRANSIT").length === 0 && (
                    <Card className="col-span-full border-2 border-dashed border-primary/20">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Truck className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Active Shipments</h3>
                            <p
                                className="text-sm text-muted-foreground mb-4"
                            >
                                All batches are currently at their destinations or awaiting dispatch
                            </p>
                            <Button
                                onClick={() => setActiveTab("batches")}
                                variant="outline"
                                className="border-primary/30 hover:bg-primary/10"
                            >
                                View All Batches
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Transport Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Shipments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {batches.filter(batch => batch.status === "IN_TRANSIT").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-primary">↗ 2</span> new this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">94.2%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">↗ +2.1%</span> vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Transit Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">2.3 days</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">↘ -0.2</span> days improvement
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ManufacturerTransport;