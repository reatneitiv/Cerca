import { InputPer } from "@/presentation/components/shared/Input";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6">
        {/* Fondo decorativo */}
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 items-center"
        >
          <View className="h-64 w-64 rounded-full bg-gold opacity-10" />
        </View>

        {/* Contenido */}
        <View className="flex-1 justify-center">
          {/* Encabezado */}
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-white">Cerca</Text>

            <Text className="mt-2 text-center text-base text-gray-400">
              Inicia sesión para continuar
            </Text>
          </View>

          {/* Formulario */}
          <View className="gap-4">
            <InputPer
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <InputPer
              placeholder="Contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
