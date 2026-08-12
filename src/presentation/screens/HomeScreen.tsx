import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ListingSummary } from "@/domain/entities/listing.entity";
import type { Coordinates } from "@/domain/repositories/location.repository";

import { ListingCard } from "@/presentation/components/ListingCard";
import { Header } from "@/presentation/components/shared/Header";
import { SearchBar } from "@/presentation/components/shared/SearchBar";

import { developmentSearchCoordinates } from "@/infrastructure/config/search-location.config";
import {
  getCurrentLocationUseCase,
  getListingsUseCase,
} from "@/shared/container/container";

export default function HomeScreen() {
  // Datos de la pantalla
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    developmentSearchCoordinates,
  );
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (developmentSearchCoordinates) return;

    getCurrentLocationUseCase
      .execute()
      .then(setCoordinates)
      .catch((caughtError: unknown) => {
        console.error("Error obteniendo ubicación:", caughtError);

        if (
          caughtError instanceof Error &&
          caughtError.message === "LOCATION_PERMISSION_DENIED"
        ) {
          setError("Necesitamos tu ubicación para mostrar servicios cercanos.");
        } else {
          setError("No pudimos obtener tu ubicación.");
        }

        setIsLoading(false);
      })
      .finally(() => {
        setLocationLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!coordinates) return;

    const timeout = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      getListingsUseCase
        .execute({
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          query: searchQuery.trim() || undefined,
          radiusKm: 10,
          limit: 20,
        })
        .then(setListings)
        .catch((caughtError: unknown) => {
          console.error("Error cargando servicios:", caughtError);
          setError("No pudimos cargar los servicios desde la API.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [coordinates, searchQuery]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-app-background">
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        ListHeaderComponent={
          <View className="px-5 pb-4">
            <Header />

            <Text className="mt-1.5 max-w-[300px] text-[15px] leading-[22px] text-slate-500">
              Encuentra el servicio que necesitas, justo donde estás.
            </Text>

            <View className="mt-6 rounded-[24px] bg-app-muted-background p-3.5">
              <SearchBar onChangeText={setSearchQuery} value={searchQuery} />
            </View>

            <View className="mb-1 mt-7 flex-row items-center justify-between">
              <View>
                <Text className="text-[20px] font-extrabold tracking-[-0.4px] text-app-heading">
                  Servicios disponibles
                </Text>

                <Text className="mt-[3px] text-[13px] text-slate-400">
                  Resultados cerca de ti
                </Text>
              </View>

              <View className="h-7 min-w-7 items-center justify-center rounded-[14px] bg-app-primary-soft px-2">
                <Text className="text-xs font-extrabold text-app-primary">
                  {listings.length}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-6 px-5 text-center text-sm text-slate-500">
            {locationLoading
              ? "Solicitando permiso de ubicación..."
              : isLoading
                ? "Cargando servicios..."
                : (error ?? "No encontramos servicios en esta zona.")}
          </Text>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <ListingCard listing={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
