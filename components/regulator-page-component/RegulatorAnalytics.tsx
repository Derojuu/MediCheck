"use client";

import useSWR from "swr";

import ClassificationHeatmap, { ClassificationPoint } from "../ClassificationHeatmap";

const fetcher = (url: string) => fetch(url).then(res => res.json());

/**
 * RegulatorAnalytics component fetches and displays classification heatmap data for regulators.
 *
 * - Uses SWR to fetch classification points from the `/api/classification-map?days=30` endpoint.
 * - Handles loading and error states gracefully.
 * - Renders the `ClassificationHeatmap` component with the fetched data.
 *
 * @returns {JSX.Element} The rendered heatmap or a loading/error message.
 */
export default function RegulatorAnalytics() {
    // Call your new API endpoint:
    const { data, error } = useSWR<ClassificationPoint[]>("/api/classification-map?days=30", fetcher);

    if (error) return <div>Error loading heatmap data</div>;
    if (!data) return <div>Loading heatmap…</div>;

    return <ClassificationHeatmap data={data} />;
}
