import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ListingCard } from "@/presentation/components/ListingCard";
import { useFavorites } from "@/presentation/providers/FavoritesProvider";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7FAFC]">
      <FlatList
        data={favorites}
        keyExtractor={(listing) => listing.id}
        contentContainerStyle={{ padding: 20, gap: 14, flexGrow: 1 }}
        ListHeaderComponent={<><Text className="text-2xl font-extrabold text-[#102A43]">Favoritos</Text><Text className="mb-6 mt-1 text-[15px] text-slate-500">Tus servicios guardados.</Text></>}
        ListEmptyComponent={<View className="mt-12 items-center rounded-[20px] bg-white px-6 py-10"><View className="h-16 w-16 items-center justify-center rounded-full bg-[#FFF3D6]"><Ionicons name="star-outline" size={32} color="#F59E0B" /></View><Text className="mt-5 text-lg font-bold text-[#102A43]">Aún no tienes favoritos</Text><Text className="mt-2 text-center text-sm leading-5 text-slate-500">Guarda servicios para encontrarlos rápidamente aquí.</Text></View>}
        renderItem={({ item }) => <ListingCard listing={item} />}
      />
    </SafeAreaView>
  );
}
