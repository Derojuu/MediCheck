// components/ClassificationHeatmap.tsx
"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapLayer from "react-leaflet-heatmap-layer-v3";

export type ClassificationPoint = {
    lat: number;
    lon: number;
    region: string;
    predictedLabel: boolean; // true = genuine, false = counterfeit
    probability: number;
    time: string;
};

type HeatPoint = [number, number, number]; // [lat, lon, intensity]


export default function ClassificationHeatmap({ data }: { data: ClassificationPoint[] }) {
    
    // Convert your data into [lat, lon, intensity]
    const points: HeatPoint[] = data.map((point) => [
        point.lat,
        point.lon,
        point.predictedLabel ? 1 : -1, // intensity
    ]);


    return (
        <MapContainer
            center={[6.5244, 3.3792]} // Lagos center
            zoom={6}
            style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <HeatmapLayer
                points={points}
                longitudeExtractor={(m: HeatPoint) => m[1]}
                latitudeExtractor={(m: HeatPoint) => m[0]}
                intensityExtractor={(m: HeatPoint) => m[2]}
                radius={20}
                blur={15}
                max={1}
                gradient={{
                    0.0: "green", // low intensity
                    0.5: "yellow",
                    1.0: "red",   // high intensity
                }}
            />

        </MapContainer>
    );
}
