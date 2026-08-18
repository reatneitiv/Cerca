import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { ListingSummary } from "@/domain/entities/listing.entity";

interface FavoritesContextValue {
  favorites: ListingSummary[];
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listing: ListingSummary) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<ListingSummary[]>([]);

  const isFavorite = useCallback(
    (listingId: string) => favorites.some((listing) => listing.id === listingId),
    [favorites]
  );

  const toggleFavorite = useCallback((listing: ListingSummary) => {
    setFavorites((currentFavorites) =>
      currentFavorites.some((favorite) => favorite.id === listing.id)
        ? currentFavorites.filter((favorite) => favorite.id !== listing.id)
        : [...currentFavorites, listing]
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return context;
}
