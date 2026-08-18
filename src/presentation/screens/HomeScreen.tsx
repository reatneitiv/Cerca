import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Category } from "@/domain/entities/category.entity";
import type { Listing, ListingSummary, PaginatedResponse } from "@/domain/entities/listing.entity";
import type { Coordinates } from "@/domain/repositories/location.repository";

import { CategoriesSection } from "@/presentation/components/CategoriesSection";
import { ListingCard } from "@/presentation/components/ListingCard";
import { AppLogo } from "@/presentation/components/shared/Header";
import { SearchBar } from "@/presentation/components/shared/SearchBar";

import { developmentSearchCoordinates } from "@//infrastructure/config/search-location.config";
import {
  getCategoriesUseCase,
  getCurrentLocationUseCase,
  getListingsUseCase,
} from "@/shared/container/container";

export default function HomeScreen() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    developmentSearchCoordinates,
  );
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [reloadKey, setReloadKey] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    // Si estamos usando una ubicación de desarrollo, no usamos el GPS
    if (developmentSearchCoordinates) {
      setLocationLoading(false);
      return;
    }

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
            "Activa el permiso de ubicación para ver servicios cerca de ti.",
          );
        } else {
          setError("No pudimos conocer tu ubicación. Inténtalo de nuevo.");
        }

        setIsLoading(false);
      })
      .finally(() => {
        setLocationLoading(false);
      });
  }, []);

  useEffect(() => {
    getCategoriesUseCase
      .execute()
      .then(setCategories)
      .catch((caughtError: unknown) => {
        console.error("Error cargando categorías:", caughtError);
      });
  }, []);

  useEffect(() => {
    if (!coordinates) return;

    let isCurrentRequest = true;
    setNextCursor(null);

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
          categoryId: selectedCategoryId ?? undefined,
        })
        .then((page: PaginatedResponse<Listing>) => {
          if (!isCurrentRequest) return;
          setListings(page.items);
          setNextCursor(page.nextCursor ?? null);
        })
        .catch((caughtError: unknown) => {
          if (!isCurrentRequest) return;
          console.error("Error cargando servicios:", caughtError);
          setError(
            "No pudimos cargar los servicios. Revisa tu conexión e inténtalo de nuevo.",
          );
        })
        .finally(() => {
          if (isCurrentRequest) setIsLoading(false);
        });
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeout);
    };
  }, [coordinates, searchQuery, selectedCategoryId, reloadKey]);

  const loadMoreListings = async () => {
    if (!coordinates || !nextCursor || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const page = await getListingsUseCase.execute({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        query: searchQuery.trim() || undefined,
        radiusKm: 10,
        limit: 20,
        categoryId: selectedCategoryId ?? undefined,
        cursor: nextCursor,
      });

      setListings((currentListings) => [...currentListings, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (caughtError) {
      console.error("Error cargando más servicios:", caughtError);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7FAFC]">
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3.5" />}
        ListHeaderComponent={
          <View className="px-5 pb-4">
            <View className="flex-row items-center py-2">
              <AppLogo size={40} />
              <Text className="ml-3 text-3xl font-black tracking-[-1px] text-slate-900">
                Cerca
              </Text>
            </View>

            <Text className="mt-1.5 max-w-[300px] text-[15px] leading-[22px] text-slate-500">
              Encuentra el servicio que necesitas, justo donde estás.
            </Text>

            <View className="mt-6 rounded-[24px] bg-[#EAF8F3] p-3.5">
              <SearchBar onChangeText={setSearchQuery} value={searchQuery} />
            </View>

            <CategoriesSection
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            <View className="mb-1 mt-7 flex-row items-center justify-between">
              <View>
                <Text className="text-[20px] font-extrabold tracking-[-0.4px] text-[#102A43]">
                  Servicios disponibles
                </Text>

                <Text className="mt-[3px] text-[13px] text-slate-400">
                  {selectedCategoryId
                    ? "Resultados de esta categoría"
                    : "Resultados cerca de ti"}
                </Text>
              </View>

              <View className="h-7 min-w-7 items-center justify-center rounded-[14px] bg-[#DDF5ED] px-2">
                <Text className="text-xs font-extrabold text-[#087F5B]">
                  {listings.length} cargados
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="mt-6 items-center px-5">
            <Text className="text-center text-sm text-slate-500">
              {locationLoading
                ? "Buscando tu ubicación..."
                : isLoading
                  ? "Cargando servicios..."
                  : (error ?? "No encontramos servicios en esta zona.")}
            </Text>

            {!locationLoading && !isLoading && error && coordinates && (
              <Pressable
                accessibilityRole="button"
                className="mt-4 rounded-xl bg-primary px-4 py-2 active:opacity-90"
                onPress={() => setReloadKey((currentKey) => currentKey + 1)}
              >
                <Text className="font-bold text-white">Reintentar</Text>
              </Pressable>
            )}
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <Text className="py-6 text-center text-sm text-slate-500">
              Cargando más servicios...
            </Text>
          ) : null
        }
        // Tarjeta de cada servicio
        renderItem={({ item }) => (
          <View className="px-5">
            <ListingCard listing={item} />
          </View>
        )}
        onEndReached={loadMoreListings}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
