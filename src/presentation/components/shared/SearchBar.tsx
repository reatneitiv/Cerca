import { appColors } from "@/shared/colors";
import { Text, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="min-h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
      <Text
        accessibilityElementsHidden
        className="mr-2.5 text-[27px] leading-[29px] text-app-primary"
      >
        ⌕
      </Text>

      <TextInput
        accessibilityLabel="Buscar un servicio"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder="Buscar un servicio..."
        placeholderTextColor={appColors.textMuted}
        returnKeyType="search"
        className="flex-1 py-0 text-base text-slate-900"
        value={value}
      />
    </View>
  );
}
