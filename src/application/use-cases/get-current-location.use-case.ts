import type { Coordinates, LocationRepository } from "@/src/domain/repositories/location.repository";

export class GetCurrentLocationUseCase {
  constructor(private readonly locationRepository: LocationRepository) {}

  execute(): Promise<Coordinates> {
    return this.locationRepository.getCurrentCoordinates();
  }
}
