import { Ionicons } from "@expo/vector-icons";
import { hasCapacity } from "@/domain/auth/entities/Actor";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { parseApiError } from "@/presentation/utils/parseApiError";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoutButton from "@/presentation/components/LogoutButton";

export default function ProfileScreen() {
  const [becomingProvider, setBecomingProvider] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const { actor, becomeProvider } = useAuth();

  async function handleBecomeProvider() {
    setMessage(null);
    setBecomingProvider(true);

    try {
      await becomeProvider();
      setMessage("Ahora puedes publicar y gestionar tus servicios.");
    } catch (error) {
      setMessage(parseApiError(error).message);
    } finally {
      setBecomingProvider(false);
    }
  }

  const isProvider = actor ? hasCapacity(actor, "provider") : false;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7FAFC]">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-extrabold text-[#102A43]">Perfil</Text>

        <View className="mt-6 items-center rounded-[20px] bg-white px-5 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-[#DDF5ED]">
            <Ionicons name="person" size={38} color="#087F5B" />
          </View>
          <Text className="mt-4 text-lg font-bold text-[#102A43]">Mi cuenta</Text>
          <Text className="mt-1 text-sm text-slate-500">Gestiona la información de tu cuenta.</Text>
          {isProvider ? (
            <View className="mt-6 flex-row items-center rounded-xl bg-[#DDF5ED] px-4 py-3">
              <Ionicons name="checkmark-circle" size={20} color="#087F5B" />
              <Text className="ml-2 text-sm font-semibold text-[#087F5B]">
                Ya eres proveedor
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={handleBecomeProvider}
              disabled={becomingProvider}
              className="mt-6 min-h-12 items-center justify-center rounded-xl bg-[#087F5B] px-5 active:opacity-90 disabled:opacity-60"
              accessibilityLabel="Convertirme en proveedor"
            >
              {becomingProvider ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-sm font-bold text-white">Convertirme en proveedor</Text>
              )}
            </Pressable>
          )}
          {message ? (
            <Text className="mt-3 text-center text-sm text-slate-600">{message}</Text>
          ) : null}
          <View className="mt-6">
            <LogoutButton />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
