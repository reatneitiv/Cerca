import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { ListingDetail, ListingStatus } from "@/domain/entities/listing.entity";
import { getListingByIdUseCase } from "@/shared/container/container";

const minorUnits: Record<string, number> = { COP: 0, CLP: 0, JPY: 0, USD: 2, EUR: 2, GBP: 2, MXN: 2, BRL: 2, KWD: 3 };
const statusLabels: Record<ListingStatus, string> = { draft: "Borrador", published: "Publicado", paused: "Pausado", under_review: "En revisión", removed: "Retirado" };

function formatPrice(price: ListingDetail["priceFrom"]): string {
  if (!price) return "Precio por cotizar";
  const digits = minorUnits[price.currency] ?? 2;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: price.currency, maximumFractionDigits: digits }).format(price.amountMinor / 10 ** digits);
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) {
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
  }, [id, reloadKey]);

  const roundedRating = listing ? Math.round(Math.max(0, Math.min(5, listing.ratingAvg))) : 0;

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
                <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#087F5B]">{statusLabels[listing.status]}</Text>
                <Text className="mt-2 text-2xl font-bold text-[#102A43]">{listing.title}</Text>
                <Text className="mt-3 text-xl font-semibold text-[#087F5B]">{formatPrice(listing.priceFrom)}</Text>
                <View className="mt-4 flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => <Ionicons key={star} name={star <= roundedRating ? "star" : "star-outline"} size={18} color="#F59E0B" />)}
                  <Text className="ml-2 text-sm text-slate-500">{listing.ratingAvg.toFixed(1)} ({listing.ratingCount} reseñas)</Text>
                </View>
              </View>
              <View className="mt-[18px] rounded-[18px] bg-white p-[18px] shadow-sm">
                <Text className="mb-2.5 text-lg font-bold text-[#102A43]">Acerca del servicio</Text>
                <Text className="text-[15px] leading-6 text-[#52606D]">{listing.description}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}
