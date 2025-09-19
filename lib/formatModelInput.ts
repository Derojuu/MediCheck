import { modelInputs } from "@/utils";

export const encodeFeatures =  (input: {
  region: string;
  latitude: number;
  longitude: number;
  past_incident_rate: number;
  user_flag: number;
  time_of_day: string;
  day_of_week: string;
}): number[] => {

  const arr = new Array(modelInputs.length).fill(0);

  for (let i = 0; i < modelInputs.length; i++) {
    const col = modelInputs[i];
    // numeric fields
    if (col === "latitude") arr[i] = input.latitude;
    else if (col === "longitude") arr[i] = input.longitude;
    else if (col === "past_incident_rate") arr[i] = input.past_incident_rate;
    else if (col === "user_flag") arr[i] = input.user_flag;
    // one-hot fields
    else if (col.startsWith("region_") && col === `region_${input.region}`)
      arr[i] = 1;
    else if (
      col.startsWith("time_of_day_") &&
      col === `time_of_day_${input.time_of_day}`
    )
      arr[i] = 1;
    else if (
      col.startsWith("day_of_week_") &&
      col === `day_of_week_${input.day_of_week}`
    )
      arr[i] = 1;
  }

  return arr;
}
