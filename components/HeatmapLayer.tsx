/**
 * HeatmapLayer component for rendering a heatmap overlay on a Leaflet map using react-leaflet.
 *
 * @remarks
 * This component uses the leaflet.heat plugin to visualize an array of heat points on the map.
 * It automatically adds and removes the heat layer as the component mounts and unmounts.
 *
 * @typedef HeatPoint
 * A tuple representing a heatmap point: [latitude, longitude, intensity].
 *
 * @param props - The properties for the HeatmapLayer component.
 * @param props.points - An array of heatmap points, each defined as [lat, lng, intensity].
 * @param props.radius - Optional. The radius of each "point" of the heatmap. Defaults to 25.
 * @param props.blur - Optional. The amount of blur for the heatmap points. Defaults to 15.
 * @param props.max - Optional. The maximum point intensity. Defaults to 1.
 *
 * @returns
 * Returns null as this is a non-visual layer component.
 *
 * @example
 * ```tsx
 * <HeatmapLayer points={[[51.5, -0.09, 0.8], [51.51, -0.1, 0.5]]} radius={30} blur={20} max={1} />
 * ```
 */
"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet.heat";

type HeatPoint = [number, number, number];
interface Props {
    points: HeatPoint[];
    radius?: number;
    blur?: number;
    max?: number;
}

export default function HeatmapLayer({
    points,
    radius = 25,
    blur = 15,
    max = 1
}: Props) {
    const map = useMap();

    useEffect(() => {
        const L = window.L;

        const gradient = {
            0.0: "red",      
            0.5: "yellow",    
            1.0: "limegreen", 
        };

        const heatLayer = L.heatLayer(points, {
            radius,
            blur,
            max,
            gradient
        }).addTo(map);

        return () => {
            heatLayer.remove();
        };
    }, [map, points, radius, blur, max]);

    return null;
}
