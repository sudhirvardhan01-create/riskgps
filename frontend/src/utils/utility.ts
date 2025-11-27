import { ProcessUnit } from "@/types/assessment";

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

export interface VendorData extends Record<string, unknown> {
  name: string;
  value: number;
}

export interface NetworkData extends Record<string, unknown> {
  name: string;
  value: number;
}

interface RawAsset {
  id: string;
  applicationName: string;
  assetCategory: string | null;
  thirdPartyName?: string | null;
  thirdPartyLocation?: string | null;
  geographicLocation?: string | null;
  networkName?: string | null;
  processes: ProcessUnit[];
}

const CITY_COORDS: Record<string, [number, number]> = {
  "New York": [40.712776, -74.005974],
  "Los Angeles": [34.052235, -118.243683],
  Chicago: [41.878113, -87.629799],
  Houston: [29.760427, -95.369804],
  Phoenix: [33.448376, -112.074036],
  Philadelphia: [39.952583, -75.165222],
  "San Antonio": [29.424122, -98.493629],
  "San Diego": [32.715736, -117.161087],
  Dallas: [32.776665, -96.796989],
  "San Jose": [37.338207, -121.88633],
  Austin: [30.267153, -97.743057],
  Jacksonville: [30.332184, -81.655647],
  "Fort Worth": [32.755489, -97.330765],
  Columbus: [39.961178, -82.998795],
  Indianapolis: [39.768402, -86.158066],
  Charlotte: [35.227085, -80.843124],
  "San Francisco": [37.774929, -122.419418],
  Seattle: [47.606209, -122.332069],
  Denver: [39.739236, -104.990251],
  Washington: [38.907192, -77.036873],
  Boston: [42.360081, -71.058884],
  Nashville: [36.162663, -86.781601],
  "El Paso": [31.761878, -106.485023],
  Detroit: [42.331429, -83.045753],
  "Oklahoma City": [35.46756, -97.516426],
  Portland: [45.505106, -122.675026],
  "Las Vegas": [36.169941, -115.139832],
  Memphis: [35.149532, -90.048981],
  Louisville: [38.252666, -85.758453],
  Baltimore: [39.290386, -76.61219],
  Milwaukee: [43.038902, -87.906471],
  Albuquerque: [35.084385, -106.650421],
  Tucson: [32.222607, -110.974709],
  Fresno: [36.737797, -119.787125],
  Sacramento: [38.581573, -121.4944],
  "Kansas City": [39.099724, -94.578331],
  Atlanta: [33.749001, -84.387978],
  Miami: [25.761681, -80.191788],
  Omaha: [41.256538, -95.934502],
  Raleigh: [35.779591, -78.638176],
  "Colorado Springs": [38.833881, -104.821365],
  Minneapolis: [44.977753, -93.265015],
  Arlington: [32.735687, -97.108063],
  Tampa: [27.950575, -82.457176],
  "New Orleans": [29.951065, -90.071533],
  Honolulu: [21.306944, -157.858337],
  Anaheim: [33.836594, -117.914299],
  Aurora: [39.729432, -104.831919],
  "Santa Ana": [33.745472, -117.867653],
  "St. Louis": [38.627003, -90.199402],
  Pittsburgh: [40.440624, -79.995888],
  Cincinnati: [39.103119, -84.512016],
  Orlando: [28.538336, -81.379234],
  Cleveland: [41.499321, -81.694359],
  Riverside: [33.953349, -117.396156],
  Lexington: [38.040585, -84.503716],
  Stockton: [37.957702, -121.290779],
  "Corpus Christi": [27.800583, -97.396378],
  Henderson: [36.039524, -114.981721],
  "St. Paul": [44.953703, -93.089958],
  Anchorage: [61.218056, -149.900284],
  Plano: [33.019844, -96.698883],
  Lincoln: [40.813618, -96.702591],
  Newark: [40.735657, -74.172363],
  Durham: [35.994034, -78.898621],
  Greensboro: [36.072636, -79.791975],
  Madison: [43.073051, -89.40123],
  Chandler: [33.30616, -111.84125],
  Reno: [39.529633, -119.813805],
  Lubbock: [33.577862, -101.855164],
  Scottsdale: [33.494171, -111.926048],
  "Baton Rouge": [30.451468, -91.187149],
  "Des Moines": [41.586834, -93.625],
  Boise: [43.615021, -116.202316],
  Spokane: [47.658779, -117.426048],
  "Little Rock": [34.746483, -92.289597],
  Montgomery: [32.366806, -86.299969],
  Tallahassee: [30.438255, -84.280731],
  "Salt Lake City": [40.76078, -111.891045],
  Providence: [41.824001, -71.412834],
  Charleston: [32.776474, -79.931053],
  Wichita: [37.687176, -97.330055],
  Toledo: [41.652805, -83.537865],
  Norfolk: [36.850769, -76.285873],
  Huntsville: [34.730369, -86.586104],
  "Grand Rapids": [42.963795, -85.669998],
  Springfield: [37.208958, -93.292299],
  "Fort Wayne": [41.079273, -85.139351],
  Mobile: [30.695366, -88.039894],
  Shreveport: [32.525151, -93.750179],
  Jackson: [32.298757, -90.184807],
  Augusta: [33.473498, -82.010515],
  "Columbus (GA)": [32.460976, -84.987709],
  Savannah: [32.080898, -81.091203],
  Birmingham: [33.518589, -86.810356],
};

export const formatDate = (dateString: Date | string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

/**
 * Formats a number string with commas using Indian numbering system
 * (last 3 digits, then groups of 2)
 * @param value - The numeric string to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: string): string => {
  if (!value) return "";
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";

  // Indian numbering system: last 3 digits, then groups of 2
  if (numericValue.length <= 3) {
    return numericValue;
  }

  // Get last 3 digits
  const lastThree = numericValue.slice(-3);
  // Get remaining digits
  const remaining = numericValue.slice(0, -3);

  // Group remaining digits in groups of 2 from right to left
  const reversedRemaining = remaining.split("").reverse().join("");
  const groupedRemaining = reversedRemaining.replace(/(\d{2})(?=\d)/g, "$1,");
  const formattedRemaining = groupedRemaining.split("").reverse().join("");

  return formattedRemaining ? `${formattedRemaining},${lastThree}` : lastThree;
};

/**
 * Extracts raw numeric value from a string (removes all non-digit characters)
 * @param value - The string to extract numeric value from
 * @returns Raw numeric string without any formatting
 */
export const getRawNumericValue = (value: string): string => {
  if (!value) return "";
  // Remove all non-digit characters
  return value.replace(/\D/g, "");
};

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

  const vendor_data: VendorData[] = Array.from(vendorMap, ([name, value]) => ({
    name,
    value,
  }));

  const networkMap = new Map<string, number>();

  apiData.forEach((item) => {
    if (!item.networkName) return;
    const network = item.networkName.trim();
    const count = item.processes?.length || 0;
    networkMap.set(network, (networkMap.get(network) || 0) + count);
  });

  const network_data: NetworkData[] = Array.from(
    networkMap,
    ([name, value]) => ({
      name,
      value,
    })
  );

  // 3️⃣ Locations for the map
  const cityMap = new Map<
    string,
    { name: string; value: number; coords: LatLngExpression }
  >();

  apiData.forEach((item) => {
    const city = item.geographicLocation?.trim();
    if (!city) return;

    const coords = CITY_COORDS[city];
    if (!coords) return; // skip unknown cities

    const processCount = item.processes?.length || 0;

    if (cityMap.has(city)) {
      // ✅ accumulate the count
      const existing = cityMap.get(city)!;
      existing.value += processCount;
    } else {
      // ✅ first occurrence
      cityMap.set(city, {
        name: city,
        value: processCount,
        coords,
      });
    }
  });

  const cityData = Array.from(cityMap.values());

  return { asset_data, vendor_data, network_data, cityData };
}

// Format currency with K (thousand), M (million), and B (billion) abbreviations
// K = 1,000 (for values 1,000 to 999,999)
// M = 1,000,000 (for values 1,000,000 to 999,999,999)
// B = 1,000,000,000 (for values >= 1,000,000,000)
// Examples: 5,000 = $5K, 10,000 = $10K, 500,000 = $500K, 1,000,000 = $1M, 5,000,000 = $5M, 1,000,000,000 = $1B
export const formatCurrencyCompact = (value: number): string => {
  if (value >= 1000000000) {
    // For values >= 1,000,000,000, use B (Billions) where 1B = 1,000,000,000
    const billions = value / 1000000000;
    // Round to 1 decimal place if needed, otherwise show as whole number
    const formattedBillions =
      billions % 1 === 0
        ? Math.round(billions).toString()
        : billions.toFixed(1);
    return `$${formattedBillions}B`;
  } else if (value >= 1000000) {
    // For values >= 1,000,000 and < 1,000,000,000, use M (Millions) where 1M = 1,000,000
    const millions = value / 1000000;
    // Round to 1 decimal place if needed, otherwise show as whole number
    const formattedMillions =
      millions % 1 === 0
        ? Math.round(millions).toString()
        : millions.toFixed(1);
    return `$${formattedMillions}M`;
  } else if (value >= 1000) {
    // For values >= 1,000 and < 1,000,000, use K (Thousands) where 1K = 1,000
    const thousands = value / 1000;
    // Round to 1 decimal place if needed, otherwise show as whole number
    const formattedThousands =
      thousands % 1 === 0
        ? Math.round(thousands).toString()
        : thousands.toFixed(1);
    return `$${formattedThousands}K`;
  }
  // For values < 1,000, show as is
  return `$${Math.round(value)}`;
};
