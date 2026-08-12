import type { Coordinates } from "@/src/domain/repositories/location.repository";

const latitude = Number(process.env.EXPO_PUBLIC_DEV_SEARCH_LAT);
const longitude = Number(process.env.EXPO_PUBLIC_DEV_SEARCH_LNG);

export const developmentSearchCoordinates: Coordinates | null = Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
