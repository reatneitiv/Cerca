import type { SignUpInput } from "@/domain/auth/repositories/AuthRepository";
import { AuthApi } from "@/infrastructure/auth/api/AuthApi";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import { InputPer } from "@/presentation/components/shared/Input";
import { parseApiError } from "@/presentation/utils/parseApiError";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    try {
      const client = new FetchHttpClient();
      const api = new AuthApi(client);
      const payload: SignUpInput = {
        email,
        password,
        displayName,
        capacities: ["customer"],
      };
      const session = await api.signUp(payload);
      await SecureStore.setItemAsync("accessToken", session.accessToken);
      await SecureStore.setItemAsync("refreshToken", session.refreshToken);
      console.log("signed up", session.actor);
      router.push("/");
    } catch (e) {
      const parsed = parseApiError(e);
      if (
        parsed.fieldErrors &&
        parsed.fieldErrors.password &&
        parsed.fieldErrors.password.length > 0
      ) {
        setError(parsed.fieldErrors.password[0]);
      } else {
        setError(parsed.message);
      }
      setToast(parsed.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app-background">
      {toast ? (
        <View className="absolute top-4 left-4 right-4 z-50 items-center">
          <View className="bg-black/80 rounded-md px-4 py-2">
            <Text className="text-white">{toast}</Text>
          </View>
        </View>
      ) : null}
      <View className="flex-1 px-6 justify-center">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-app-heading">Cerca</Text>
          <Text className="mt-2 text-center text-base text-app-primary">
            Crea tu cuenta
          </Text>
        </View>

        <View className="rounded-[18px] bg-app-surface p-6 shadow-sm">
          <View className="gap-4">
            <InputPer
              placeholder="Nombre visible"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <InputPer
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <InputPer
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              className="mt-4 rounded-lg bg-app-primary p-3 items-center"
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Crear cuenta</Text>
              )}
            </TouchableOpacity>
            {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="mt-3 items-center"
            >
              <Text className="text-sm text-app-primary">
                ¿Ya tienes una cuenta? Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
