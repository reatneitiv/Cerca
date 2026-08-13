import type { Coordinates, LocationRepository } from "@/domain/repositories/location.repository";

export class GetCurrentLocationUseCase {
  constructor(private readonly locationRepository: LocationRepository) {}

  execute(): Promise<Coordinates> {
    return this.locationRepository.getCurrentCoordinates();
  }
}
