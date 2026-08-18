import { useRouter } from "expo-router";
import { clearSession } from "@/infrastructure/auth/session/AuthSessionStorage";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export default function LogoutButton(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await clearSession();
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
