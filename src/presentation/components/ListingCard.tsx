import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type {ListingStatus,ListingSummary} from "@/src/domain/entities/listing.entity";

interface ListingCardProps {
  listing: ListingSummary;
}

// Cantidad de decimales según la moneda
const minorUnits: Record<string, number> = {
  COP: 0,
  CLP: 0,
  JPY: 0,
  USD: 2,
  EUR: 2,
  GBP: 2,
  MXN: 2,
  BRL: 2,
  KWD: 3,
};

// Traduce el estado del listing
const statusLabels: Record<ListingStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  paused: "Pausado",
  under_review: "En revisión",
  removed: "Retirado",
};

// Formatea el precio
function formatPrice(price: ListingSummary["priceFrom"]): string {
  if (!price) {
    return "Precio por cotizar";
  }

  const decimals = minorUnits[price.currency] ?? 2;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: decimals,
  }).format(price.amountMinor / 10 ** decimals);
}

// Formatea la distancia
function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();

  // Calcula las estrellas que se muestran
  const filledStars = Math.round(
    Math.max(0, Math.min(5, listing.ratingAvg))
  );

  // Abre los detalles del listing
  function handlePress() {
    router.push(`/listing/${listing.id}`);
  }

  return (
    <Pressable
      accessibilityLabel={`Ver detalles de ${listing.title}`}
      accessibilityRole="button"
      onPress={handlePress}
      className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm active:opacity-85"
    >
      {/* Título y distancia */}
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[11px] font-bold uppercase tracking-[0.25px] text-emerald-700">
            {statusLabels[listing.status]}
          </Text>

          <Text
            numberOfLines={2}
            className="mt-1 text-[17px] font-bold text-slate-900"
          >
            {listing.title}
          </Text>
        </View>

        <View className="flex-row items-center rounded-[10px] bg-slate-100 px-2 py-1">
          <Ionicons name="location" size={13} color="#047857" />

          <Text className="ml-1 text-[11px] font-bold text-slate-600">
            {formatDistance(listing.distanceMeters)}
          </Text>
        </View>
      </View>

      {/* Precio y calificación */}
      <View className="mt-3 flex-row items-center justify-between">
        <View>
          <Text className="text-[9px] font-extrabold uppercase tracking-[0.8px] text-slate-400">
            Desde
          </Text>

          <Text className="mt-px text-[15px] font-extrabold text-slate-900">
            {formatPrice(listing.priceFrom)}
          </Text>
        </View>

        <View className="items-end">
          {/* Estrellas */}
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= filledStars ? "star" : "star-outline"}
                size={15}
                color="#F59E0B"
              />
            ))}
          </View>

          <Text className="mt-1 text-[11px] text-slate-500">
            {listing.ratingCount} reseñas
          </Text>
        </View>
      </View>
    </Pressable>
  );
}