export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationRepository {
  getCurrentCoordinates(): Promise<Coordinates>;
}