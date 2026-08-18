import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import type { ListingDetail, ListingStatus } from "@/domain/entities/listing.entity";
import type { Review } from "@/domain/entities/review.entity";
import { BookingApi } from "@/infrastructure/api/BookingApi";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { useFavorites } from "@/presentation/providers/FavoritesProvider";
import { parseApiError } from "@/presentation/utils/parseApiError";
import { getListingByIdUseCase, getListingReviewsUseCase } from "@/shared/container/container";

const minorUnits: Record<string, number> = { COP: 0, CLP: 0, JPY: 0, USD: 2, EUR: 2, GBP: 2, MXN: 2, BRL: 2, KWD: 3 };
const statusLabels: Record<ListingStatus, string> = { draft: "Borrador", published: "Publicado", paused: "Pausado", under_review: "En revisión", removed: "Retirado" };

function formatPrice(price: ListingDetail["priceFrom"]): string {
  if (!price) return "Precio por cotizar";
  const digits = minorUnits[price.currency] ?? 2;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: price.currency, maximumFractionDigits: digits }).format(price.amountMinor / 10 ** digits);
}

export default function ListingDetailScreen() {
  const params = useLocalSearchParams<{ id: string; request?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const request = Array.isArray(params.request) ? params.request[0] : params.request;
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { actor } = useAuth();
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setError("No pudimos abrir este servicio. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    getListingByIdUseCase.execute(id)
      .then((data) => {
        if (data) setListing(data);
        else setError("No encontramos este servicio.");
      })
      .catch(() => setError("No pudimos cargar el servicio. Revisa tu conexión e inténtalo de nuevo."))
      .finally(() => setLoading(false));

    getListingReviewsUseCase.execute(id)
      .then(setReviews)
      .catch((caughtError) => console.warn("No se pudieron cargar las reseñas:", caughtError))
  }, [id, reloadKey]);

  const reviewAverage = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : listing?.ratingAvg ?? 0;
  const reviewCount = reviews.length || listing?.ratingCount || 0;
  const filledStars = Math.round(Math.max(0, Math.min(5, reviewAverage)));

  const handleFavoriteToggle = () => {
    if (!listing) return;
    toggleFavorite({ ...listing, distanceMeters: 0 });
  };

  async function handleBooking() {
    if (!listing) return;
    const requestedDate = new Date(bookingDate);
    if (!bookingDate || Number.isNaN(requestedDate.getTime())) {
      setBookingMessage("Escribe una fecha válida, por ejemplo 2026-12-31.");
      return;
    }
    const scheduledFor = requestedDate.toISOString();

    setBookingLoading(true);
    setBookingMessage(null);
    try {
      const key = `${listing.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await new BookingApi(new FetchHttpClient()).request({ listingId: listing.id, scheduledFor }, key);
      setBookingMessage("Solicitud enviada al proveedor.");
    } catch (caughtError) {
      setBookingMessage(parseApiError(caughtError).message);
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: listing?.title ?? "Detalle del servicio" }} />
      <ScrollView className="flex-1 bg-[#F7FAFC]" showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {loading && <Text className="mt-6 text-center text-slate-500">Cargando servicio...</Text>}
          {!loading && error && (
            <View className="mt-6 items-center">
              <Text className="text-center text-red-500">{error}</Text>
              <Pressable
                accessibilityRole="button"
                className="mt-4 rounded-xl bg-primary px-4 py-2 active:opacity-90"
                onPress={() => setReloadKey((currentKey) => currentKey + 1)}
              >
                <Text className="font-bold text-white">Reintentar</Text>
              </Pressable>
            </View>
          )}
          {!loading && !error && listing && (
            <>
              <View className="rounded-[18px] bg-white p-[18px] shadow-sm">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1">
                    <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#087F5B]">{statusLabels[listing.status]}</Text>
                    <Text className="mt-2 text-2xl font-bold text-[#102A43]">{listing.title}</Text>
                  </View>
                  <Pressable
                    accessibilityLabel={isFavorite(listing.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isFavorite(listing.id) }}
                    className={`h-14 w-14 items-center justify-center rounded-full ${isFavorite(listing.id) ? "bg-[#FFF3D6]" : "bg-slate-100"}`}
                    onPress={handleFavoriteToggle}
                  >
                    <Ionicons name={isFavorite(listing.id) ? "star" : "star-outline"} size={32} color={isFavorite(listing.id) ? "#F59E0B" : "#64748B"} />
                  </Pressable>
                </View>
                <Text className="mt-3 text-xl font-semibold text-[#087F5B]">{formatPrice(listing.priceFrom)}</Text>
                <View className="mt-4 flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => <Ionicons key={star} name={star <= filledStars ? "star" : "star-outline"} size={18} color="#F59E0B" />)}
                  <Text className="ml-2 text-sm text-slate-500">{reviewAverage.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})</Text>
                </View>
              </View>
              <View className="mt-[18px] rounded-[18px] bg-white p-[18px] shadow-sm">
                <Text className="mb-2.5 text-lg font-bold text-[#102A43]">Acerca del servicio</Text>
                <Text className="text-[15px] leading-6 text-[#52606D]">{listing.description}</Text>
              </View>
              {actor?.id !== listing.ownerId ? (
                <View className="mt-[18px] rounded-[18px] bg-white p-[18px] shadow-sm">
                  <Text className="text-lg font-bold text-[#102A43]">Pedir este servicio</Text>
                  <Text className="mt-1 text-sm text-slate-500">Indica la fecha en la que lo necesitas.</Text>
                  <TextInput
                    value={bookingDate}
                    onChangeText={setBookingDate}
                    placeholder="AAAA-MM-DD"
                    autoCapitalize="none"
                    className="mt-4 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900"
                  />
                  <Pressable onPress={handleBooking} disabled={bookingLoading} className="mt-3 min-h-12 items-center justify-center rounded-xl bg-[#087F5B] disabled:opacity-60">
                    {bookingLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-bold text-white">Enviar solicitud</Text>}
                  </Pressable>
                  {bookingMessage ? <Text className="mt-3 text-center text-sm text-slate-600">{bookingMessage}</Text> : null}
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}
