export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface LocationRepository {
  getCurrentCoordinates(): Promise<Coordinates>;
}
