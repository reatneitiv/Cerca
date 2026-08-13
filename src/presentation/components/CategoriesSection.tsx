import { FlatList, Pressable, Text, View } from "react-native";

import type { Category } from "@/domain/entities/category.entity";

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoriesSection({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoriesSectionProps) {
  if (!categories.length) return null;

  return (
    <View className="mt-7">
      <Text className="mb-3 text-[20px] font-extrabold tracking-[-0.4px] text-[#102A43]">
        Categorías
      </Text>

      <FlatList
        data={categories}
        horizontal
        keyExtractor={(category) => category.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedCategoryId;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={`rounded-full px-4 py-2 ${isSelected ? "bg-[#087F5B]" : "bg-white"}`}
              onPress={() => onSelectCategory(isSelected ? null : item.id)}
            >
              <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[#334E68]"}`}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
