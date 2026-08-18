import type { HttpClient } from "@/infrastructure/http/HttpClient";

export type BookingRequestInput = {
  listingId: string;
  scheduledFor: string;
};

export class BookingApi {
  constructor(private readonly httpClient: HttpClient) {}

  request(input: BookingRequestInput, idempotencyKey: string): Promise<unknown> {
    return this.httpClient.post("/v1/bookings", input, {
      "Idempotency-Key": idempotencyKey,
    });
  }
}
