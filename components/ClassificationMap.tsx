// // components/ClassificationMap.tsx
// "use client";

// import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// export type ClassificationPoint = {
//     lat: number;
//     lon: number;
//     region: string;
//     predictedLabel: boolean; // true = genuine, false = counterfeit
//     probability: number;
//     time: string;
// };

// export default function ClassificationMap({ data }: { data: ClassificationPoint[] }) {
//     return (
//         <MapContainer
//             center={[6.5244, 3.3792]} 
//             zoom={6}
//             style={{ height: "600px", width: "100%" }}
//         >
//             <TileLayer
//                 attribution='&copy; OpenStreetMap'

//                 url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//             />
//             {data.map((point, i) => (
//                 <CircleMarker
//                     key={i}
//                     center={[point.lat, point.lon]}
//                     radius={6}
//                     pathOptions={{
//                         color: point.predictedLabel ? "green" : "red",
//                         fillColor: point.predictedLabel ? "green" : "red",
//                         fillOpacity: 0.7,
//                     }}
//                 >
//                     <Tooltip>
//                         <div>
//                             <strong>Region:</strong> {point.region}
//                             <br />
//                             <strong>Label:</strong>{" "}
//                             {point.predictedLabel ? "Genuine" : "Counterfeit"}
//                             <br />
//                             <strong>Probability:</strong>{" "}
//                             {Math.round(point.probability * 100)}%
//                         </div>
//                     </Tooltip>
//                 </CircleMarker>
//             ))}
//         </MapContainer>
//     );
// }
