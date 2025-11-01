import { ProcessUnit } from "@/types/assessment";
import { ApiProcess, ChartProcess } from "@/types/reports";

// src/utils/dataTransform.ts
import type { LatLngExpression } from "leaflet";

export interface LocationData {
  name: string;
  value: number;
  coords: LatLngExpression;
}

export interface AssetData {
  name: string;
  dependencies: number;
}

export interface VendorData {
  name: string;
  dependencies: number;
}

interface RawAsset {
  id: string;
  applicationName: string;
  assetCategory: string | null;
  thirdPartyName?: string | null;
  thirdPartyLocation?: string | null;
  geographicLocation?: string | null;
  processes: ProcessUnit[];
}

const STATE_COORDS: Record<string, LatLngExpression> = {
  Alabama: [32.806671, -86.79113],
  Alaska: [61.370716, -152.404419],
  Arizona: [33.729759, -111.431221],
  Arkansas: [34.969704, -92.373123],
  California: [36.778259, -119.417931],
  Colorado: [39.550051, -105.782067],
  Connecticut: [41.603221, -73.087749],
  Delaware: [38.910832, -75.52767],
  Florida: [27.994402, -81.760254],
  Georgia: [32.157435, -82.907123],
  Hawaii: [19.741755, -155.844437],
  Idaho: [44.068203, -114.742043],
  Illinois: [40.633125, -89.398529],
  Indiana: [40.551217, -85.602364],
  Iowa: [41.878003, -93.097702],
  Kansas: [39.011902, -98.484246],
  Kentucky: [37.839333, -84.270018],
  Louisiana: [30.984298, -91.962333],
  Maine: [45.253783, -69.445469],
  Maryland: [39.045755, -76.641271],
  Massachusetts: [42.407211, -71.382439],
  Michigan: [44.182205, -84.506836],
  Minnesota: [46.39241, -94.63623],
  Mississippi: [32.354668, -89.398528],
  Missouri: [37.964253, -91.831833],
  Montana: [46.879682, -110.362566],
  Nebraska: [41.492537, -99.901813],
  Nevada: [38.80261, -116.419389],
  "New Hampshire": [43.193852, -71.572395],
  "New Jersey": [40.058324, -74.405661],
  "New Mexico": [34.51994, -105.87009],
  "New York": [43.299428, -74.217933],
  "North Carolina": [35.759573, -79.0193],
  "North Dakota": [47.551493, -101.002012],
  Ohio: [40.417287, -82.907123],
  Oklahoma: [35.46756, -97.516428],
  Oregon: [43.804133, -120.554201],
  Pennsylvania: [41.203322, -77.194525],
  "Rhode Island": [41.580095, -71.477429],
  "South Carolina": [33.836081, -81.163725],
  "South Dakota": [43.969515, -99.901813],
  Tennessee: [35.517491, -86.580447],
  Texas: [31.968599, -99.901813],
  Utah: [39.32098, -111.093731],
  Vermont: [44.558803, -72.577841],
  Virginia: [37.431573, -78.656894],
  Washington: [47.751076, -120.740135],
  "West Virginia": [38.597626, -80.454903],
  Wisconsin: [43.78444, -88.787868],
  Wyoming: [43.075968, -107.290284],
};

export const formatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export function transformProcessData(apiData: ApiProcess[]): ChartProcess[] {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((process) => ({
    id: process.id,
    name: process.processName,
    assets: (process.assets || []).map((asset) => ({
      id: asset.id,
      name: asset.applicationName,
    })),
    risks: (process.riskScenarios || []).map((risk) => ({
      id: risk.id,
      name: risk.riskScenario,
    })),
    dependsOn: process.processDependency ?? [],
  }));
}

export function transformAssetData(apiData: RawAsset[]) {
  // 1️⃣ Asset bar chart data
  const asset_data: AssetData[] = apiData.map((item) => ({
    name: item.applicationName,
    dependencies: item.processes.length,
  }));

  const vendorMap = new Map<string, number>();

  apiData.forEach((item) => {
    if (!item.thirdPartyName) return;
    const vendor = item.thirdPartyName.trim();
    const count = item.processes?.length || 0;
    vendorMap.set(vendor, (vendorMap.get(vendor) || 0) + count);
  });

  const vendor_data: VendorData[] = Array.from(
    vendorMap,
    ([name, dependencies]) => ({
      name,
      dependencies,
    })
  );

  // 3️⃣ Locations for the map
  const uniqueLocations = new Map<string, LocationData>();

  apiData.forEach((item) => {
    const state = item.geographicLocation?.trim();
    if (!state) return;

    const coords = STATE_COORDS[state];
    if (!coords) return; // skip unknown states

    if (!uniqueLocations.has(state)) {
      uniqueLocations.set(state, {
        name: state,
        value: Math.floor(Math.random() * 100),
        coords,
      });
    }
  });

  const locations = Array.from(uniqueLocations.values());

  return { asset_data, vendor_data, locations };
}
