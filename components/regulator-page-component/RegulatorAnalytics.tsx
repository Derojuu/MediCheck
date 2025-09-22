"use client";

// import useSWR from "swr";
// import ClassificationMap, { ClassificationPoint } from "@/components/ClassificationMap";

// const fetcher = (url: string) => fetch(url).then(res => res.json());

import ClassificationHeatmap, { ClassificationPoint } from "../ClassificationHeatmap";

const dummyData: ClassificationPoint[] = [
    { lat: 6.45, lon: 3.39, region: "Lagos", predictedLabel: true, probability: 0.95, time: "2025-09-16" },
    { lat: 7.48, lon: 3.95, region: "Ibadan", predictedLabel: false, probability: 0.85, time: "2025-09-16" },
    { lat: 9.07, lon: 7.48, region: "Abuja", predictedLabel: false, probability: 0.90, time: "2025-09-16" },
];

const RegulatorAnalytics = () => {
    // const { data, error } = useSWR<ClassificationPoint[]>("/api/classification-map?days=7", fetcher);

    // if (error) return <div>Error loading</div>;
    // if (!data) return <div>Loading...</div>;

    // return (
    //     <div style={{ padding: "1rem" }}>
    //         <h1 className="text-2xl font-bold mb-4">Classification Layer Heatmap</h1>
    //         <ClassificationMap data={data} />
    //     </div>
    // );
    return <ClassificationHeatmap data={dummyData} />;
}

export default RegulatorAnalytics;