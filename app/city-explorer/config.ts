// config.ts
export interface CityOverlayPoint {
  lat: number;
  lng: number;
  name: string;
}

export interface CityData {
  heat?: CityOverlayPoint[];
  water?: CityOverlayPoint[];
  vegetation?: CityOverlayPoint[];
  air?: CityOverlayPoint[];
  agriculture?: CityOverlayPoint[];
}

// Overlay score weights (used to calculate wellbeing)
export const overlayScores: Record<string, number> = {
  heat: -10,
  air: -15,
  water: 10,
  vegetation: 15,
  agriculture: 5,
};

// Static city overlay points
export const staticCityData: Record<string, CityData> = {
  delhi: {
    heat: [
      { lat: 28.6139, lng: 77.209, name: "Connaught Place" },
      { lat: 28.7041, lng: 77.1025, name: "Old Delhi" },
    ],
    air: [
      { lat: 28.6139, lng: 77.209, name: "Air Station CP" },
      { lat: 28.7041, lng: 77.1025, name: "Air Station Old Delhi" },
    ],
    water: [
      { lat: 28.630, lng: 77.217, name: "Yamuna River" },
    ],
    vegetation: [
      { lat: 28.613, lng: 77.219, name: "Lodhi Gardens" },
    ],
    agriculture: [
      { lat: 28.650, lng: 77.250, name: "Farmlands near Delhi" },
    ],
  },
  mumbai: {
    heat: [
      { lat: 19.0760, lng: 72.8777, name: "Andheri" },
      { lat: 19.2183, lng: 72.9781, name: "Bandra" },
    ],
    air: [
      { lat: 19.0760, lng: 72.8777, name: "Air Station Andheri" },
    ],
    water: [
      { lat: 19.045, lng: 72.817, name: "Mithi River" },
    ],
    vegetation: [
      { lat: 19.218, lng: 72.978, name: "Sanjay Gandhi National Park" },
    ],
    agriculture: [
      { lat: 19.250, lng: 72.900, name: "Farmlands outskirts" },
    ],
  },
  bengaluru: {
    heat: [
      { lat: 12.9716, lng: 77.5946, name: "MG Road" },
    ],
    air: [
      { lat: 12.9716, lng: 77.5946, name: "Air Station MG Road" },
    ],
    water: [
      { lat: 12.9346, lng: 77.6100, name: "Hebbal Lake" },
    ],
    vegetation: [
      { lat: 12.975, lng: 77.592, name: "Cubbon Park" },
    ],
    agriculture: [
      { lat: 12.900, lng: 77.550, name: "Outskirts farmland" },
    ],
  },
};
