import * as Location from "expo-location";

import type { Coordinates, LocationRepository } from "@/domain/repositories/location.repository";

export class ExpoLocationRepository implements LocationRepository {
  async getCurrentCoordinates(): Promise<Coordinates> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: location.coords.latitude, longitude: location.coords.longitude };
  }
}
