import type { SignInInput } from "@/domain/auth/repositories/AuthRepository";
import { AuthApi } from "@/infrastructure/auth/api/AuthApi";
import { saveAccessToken, saveSession } from "@/infrastructure/auth/session/AuthSessionStorage";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import { InputPer } from "@/presentation/components/shared/Input";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_TOKEN, DEMO_MODERATOR_EMAIL, DEMO_MODERATOR_TOKEN, getLocalDemoAccounts } from "@/presentation/providers/AuthProvider";
import { parseApiError } from "@/presentation/utils/parseApiError";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setError(null);
    setLoading(true);
    try {
      if (email.trim().toLowerCase() === DEMO_MODERATOR_EMAIL && password === "Moderador123!") {
        await saveAccessToken(DEMO_MODERATOR_TOKEN);
        router.replace("/");
        return;
      }
      if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === "Admin123!") {
        await saveAccessToken(DEMO_ADMIN_TOKEN);
        router.replace("/");
        return;
      }
      const localAccount = (await getLocalDemoAccounts()).find((account) => account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password);
      if (localAccount) {
        await saveAccessToken(`cerca-local-account:${localAccount.id}`);
        router.replace("/");
        return;
      }

      const client = new FetchHttpClient();
      const api = new AuthApi(client);
      const input: SignInInput = { email: email.trim(), password };
      const session = await api.signIn(input);
      await saveSession(session);
      console.log("signed in", session.actor);
      router.replace("/");
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
      console.warn("No se pudo iniciar sesión:", parsed.message);
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
                value={email}
                onChangeText={setEmail}
              />

              <InputPer
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                className="mt-4 rounded-lg bg-app-primary p-3 items-center"
                onPress={submit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">
                    Iniciar sesión
                  </Text>
                )}
              </TouchableOpacity>
              {error ? (
                <Text className="text-red-500 mt-2">{error}</Text>
              ) : null}

              <TouchableOpacity
                onPress={() => router.push("/sign-up")}
                className="mt-3 items-center"
              >
                <Text className="text-sm text-app-primary">
                  ¿Aún no tienes una cuenta? Registrarse
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
