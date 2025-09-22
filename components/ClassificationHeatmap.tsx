"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "./HeatmapLayer";

export interface ClassificationPoint {
    lat: number;
    lon: number;
    region: string;
    predictedLabel: boolean;
    probability: number;
    time: string;
}

interface Props {
    data: ClassificationPoint[];
}

/**
 * Renders a heatmap visualization on a map using classification data.
 *
 * @param data - An array of objects containing latitude (`lat`), longitude (`lon`), and a boolean `predictedLabel`.
 *   Each point is mapped to a heatmap intensity: `1.0` if `predictedLabel` is true, otherwise `0.0`.
 *
 * @remarks
 * - The map is centered at latitude 9.07 and longitude 7.48, with a zoom level of 6.
 * - Uses a dark-themed tile layer from CARTO and OpenStreetMap.
 * - The heatmap layer visualizes the classified points with configurable radius and blur.
 *
 * @returns A React component displaying the classification heatmap on a Leaflet map.
 */
export default function ClassificationHeatmap({ data }: Props) {

    const points: [number, number, number][] = data.map((d) => [
        d.lat,
        d.lon,
        d.predictedLabel ? 1.0 : 0.0
    ]);

    return (
        <MapContainer
            center={[9.07, 7.48]}
            zoom={6}
            style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                subdomains={['a', 'b', 'c', 'd']}
            />
            <HeatmapLayer points={points} radius={35} blur={5} />
        </MapContainer>

    );
}
