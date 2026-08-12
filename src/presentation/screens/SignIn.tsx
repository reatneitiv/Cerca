import { InputPer } from "@/presentation/components/shared/Input";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <View className="flex-1 px-6">
        <View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 items-center"
        >
          <View className="mt-10 h-64 w-64 rounded-full bg-app-primary-soft opacity-30" />
        </View>

        <View className="flex-1 justify-center">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-app-heading">Cerca</Text>

            <Text className="mt-2 text-center text-base text-app-primary">
              Inicia sesión para continuar
            </Text>
          </View>

          <View className="rounded-[18px] bg-app-surface p-6 shadow-sm">
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
      </View>
    </SafeAreaView>
  );
}
