import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export default function LogoutButton(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      router.replace("/sign-in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      onPress={handleLogout}
      className="px-3 py-1 rounded-lg bg-app-danger"
      accessibilityLabel="Cerrar sesión"
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-sm font-semibold color-heading">
          Cerrar sesión
        </Text>
      )}
    </TouchableOpacity>
  );
}
