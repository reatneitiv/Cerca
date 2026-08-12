import { Text, View } from "react-native";

export function Header() {
  return (
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="mb-[3px] text-[11px] font-bold tracking-[1.2px] text-slate-500">
          SERVICIOS CERCA DE TI
        </Text>

        <Text className="text-[34px] font-extrabold tracking-[-1px] text-[#102A43]">
          Cerca
        </Text>
      </View>

      <View className="h-[46px] w-[46px] items-center justify-center rounded-full bg-[#DDF5ED]">
        <Text className="text-[18px] font-extrabold text-[#087F5B]">
          C
        </Text>
      </View>
    </View>
  );
}