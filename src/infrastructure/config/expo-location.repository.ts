import * as Location from "expo-location";

import type { Coordinates } from "@/domain/repositories/location.repository";
import type { LocationRepository } from "@/domain/repositories/location.repository";

export class ExpoLocationRepository implements LocationRepository {
  async getCurrentCoordinates(): Promise<Coordinates> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const location = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),

      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("LOCATION_TIMEOUT")), 15_000),
      ),
    ]);

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }
}