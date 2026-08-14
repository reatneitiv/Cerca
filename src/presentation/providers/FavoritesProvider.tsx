import { createContext, useContext, useState } from "react";

import type { ListingSummary } from "@/domain/entities/listing.entity";

interface FavoritesContextValue {
  favorites: ListingSummary[];
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listing: ListingSummary) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<ListingSummary[]>([]);

  const isFavorite = (listingId: string) => favorites.some((listing) => listing.id === listingId);

  const toggleFavorite = (listing: ListingSummary) => {
    setFavorites((currentFavorites) =>
      currentFavorites.some((favorite) => favorite.id === listing.id)
        ? currentFavorites.filter((favorite) => favorite.id !== listing.id)
        : [...currentFavorites, listing]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return context;
}
