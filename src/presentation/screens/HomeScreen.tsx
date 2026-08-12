import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ListingSummary } from "@/src/domain/entities/listing.entity";
import type { Coordinates } from "@/src/domain/repositories/location.repository";

import { Header } from "@/src/presentation/components/Header";
import { ListingCard } from "@/src/presentation/components/ListingCard";
import { SearchBar } from "@/src/presentation/components/SearchBar";

import { developmentSearchCoordinates } from "@/src/infrastructure/config/search-location.config";
import { getCurrentLocationUseCase, getListingsUseCase } from "@/src/shared/container/container";

export default function HomeScreen() {
  // Datos de la pantalla
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    developmentSearchCoordinates
  );
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtiene la ubicación del usuario
  useEffect(() => {
    // Si estamos usando una ubicación de desarrollo, no usamos el GPS
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
          setError(
            "Necesitamos tu ubicación para mostrar servicios cercanos."
          );
        } else {
          setError("No pudimos obtener tu ubicación.");
        }

        setIsLoading(false);
      })
      .finally(() => {
        setLocationLoading(false);
      });
  }, []);

  // Busca los servicios cuando cambia la ubicación o búsqueda
  useEffect(() => {
    if (!coordinates) return;

    // Espera 300ms antes de hacer la petición
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

    // Cancela el timeout anterior
    return () => clearTimeout(timeout);
  }, [coordinates, searchQuery]);

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-[#F7FAFC]"
    >
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3.5" />}

        // Parte superior de la pantalla
        ListHeaderComponent={
          <View className="px-5 pb-4">
            <Header />

            <Text className="mt-1.5 max-w-[300px] text-[15px] leading-[22px] text-slate-500">
              Encuentra el servicio que necesitas, justo donde estás.
            </Text>

            {/* Buscador */}
            <View className="mt-6 rounded-[24px] bg-[#EAF8F3] p-3.5">
              <SearchBar
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>

            {/* Título y cantidad de servicios */}
            <View className="mb-1 mt-7 flex-row items-center justify-between">
              <View>
                <Text className="text-[20px] font-extrabold tracking-[-0.4px] text-[#102A43]">
                  Servicios disponibles
                </Text>

                <Text className="mt-[3px] text-[13px] text-slate-400">
                  Resultados cerca de ti
                </Text>
              </View>

              <View className="h-7 min-w-7 items-center justify-center rounded-[14px] bg-[#DDF5ED] px-2">
                <Text className="text-xs font-extrabold text-[#087F5B]">
                  {listings.length}
                </Text>
              </View>
            </View>
          </View>
        }

        // Mensaje cuando no hay resultados
        ListEmptyComponent={
          <Text className="mt-6 px-5 text-center text-sm text-slate-500">
            {locationLoading
              ? "Solicitando permiso de ubicación..."
              : isLoading
                ? "Cargando servicios..."
                : error ?? "No encontramos servicios en esta zona."}
          </Text>
        }

        // Tarjeta de cada servicio
        renderItem={({ item }) => (
          <View className="px-5">
            <ListingCard listing={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}