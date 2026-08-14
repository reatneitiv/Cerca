import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// Componente del Logo SVG en el color de tu marca
function AppLogo({ size = 36, color = "#087F5B" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Parte superior (techo / A) */}
      <Path
        d="M 50 15 L 75 73 L 64 77 L 50 40 L 36 77 L 25 73 Z"
        fill={color}
      />
      {/* Parte inferior (arco) */}
      <Path
        d="M 31 82 C 43 73, 57 73, 69 82 L 77 91 C 61 78, 39 78, 23 91 Z"
        fill={color}
      />
    </Svg>
  );
}

export function Header() {
  return (
    <View className="flex-row items-center justify-between py-2">
      {/* LOGO MÁS GRANDE + NOMBRE "CERCA" DESTACADO */}
      <View className="flex-row items-center space-x-3">
        <AppLogo size={36} color="#087F5B" />
        <Text className="text-3xl font-black tracking-[-1px] text-slate-900">
          Cerca
        </Text>
      </View>

      {/* SECCIÓN DERECHA: SALUDO + AVATAR */}
      <View className="flex-row items-center space-x-2.5">
        <Text className="text-sm font-medium text-[#71717A]">
          Hello, Estiven
        </Text>

        <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-app-primary-soft">
          <Text className="text-[17px] font-extrabold text-app-primary">E</Text>
        </View>
      </View>
    </View>
  );
}