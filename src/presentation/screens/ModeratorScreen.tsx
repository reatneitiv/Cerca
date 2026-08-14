import { canModerateListings } from "@/domain/auth/entities/Actor";
import { ModerationApi, type ListingModerationAction } from "@/infrastructure/api/ModerationApi";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import { saveLocalDemoAccount, useAuth } from "@/presentation/providers/AuthProvider";
import { parseApiError } from "@/presentation/utils/parseApiError";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function ModeratorScreen() {
  const { actor } = useAuth();
  const { listingId: routeListingId } = useLocalSearchParams<{ listingId?: string }>();
  const [listingId, setListingId] = React.useState(routeListingId ?? "");
  const [reason, setReason] = React.useState("");
  const [action, setAction] = React.useState<ListingModerationAction>("under_review");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const isModerator = actor ? canModerateListings(actor) : false;
  const isAdmin = actor?.platformRole === "admin";
  const [accountEmail, setAccountEmail] = React.useState("");
  const [accountPassword, setAccountPassword] = React.useState("");
  const [accountKind, setAccountKind] = React.useState<"user" | "provider" | "moderator">("user");

  React.useEffect(() => {
    if (routeListingId) setListingId(routeListingId);
  }, [routeListingId]);

  async function submit() {
    if (!listingId.trim() || !reason.trim()) {
      setMessage("Indica el identificador del servicio y el motivo de la decisión.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await new ModerationApi(new FetchHttpClient()).moderateListing(listingId.trim(), action, reason.trim());
      setMessage(action === "removed" ? "Servicio retirado. El proveedor recibirá la decisión del servidor." : "Servicio enviado a revisión.");
      setListingId("");
      setReason("");
    } catch (error) {
      setMessage(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }

  async function createLocalAccount() {
    if (!accountEmail.trim() || accountPassword.length < 6) {
      setMessage("Indica un correo y una contraseña de al menos 6 caracteres.");
      return;
    }
    await saveLocalDemoAccount({
      id: `local-${Date.now()}`,
      email: accountEmail.trim().toLowerCase(),
      password: accountPassword,
      platformRole: accountKind === "moderator" ? "moderator" : "user",
      capacities: accountKind === "provider" ? ["customer", "provider"] : ["customer"],
    });
    setAccountEmail("");
    setAccountPassword("");
    setMessage("Cuenta de demostración creada. Ya puedes cerrar sesión e ingresar con ella.");
  }

  if (!isModerator) {
    return <SafeAreaView edges={["top"]} className="flex-1 items-center justify-center bg-[#F7FAFC] px-6"><Text className="text-center text-base text-slate-600">No tienes permisos de moderación.</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7FAFC]">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-6 pb-36" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-[#102A43]">Moderación</Text>
        <Text className="mt-1 text-sm text-slate-500">Revisa anuncios denunciados, aplica las políticas y comunica el motivo al usuario.</Text>
        <View className="mt-7 rounded-[20px] bg-white p-5">
          <Text className="text-lg font-bold text-[#102A43]">Decisión sobre un servicio</Text>
          <Text className="mt-5 text-sm font-semibold text-[#334E68]">ID del servicio</Text>
          <TextInput value={listingId} onChangeText={setListingId} placeholder="Elige “Moderar servicio” desde una tarjeta" autoCapitalize="none" className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
          <Text className="mt-4 text-sm font-semibold text-[#334E68]">Acción</Text>
          <View className="mt-2 flex-row gap-2">
            {([['under_review', 'En revisión'], ['removed', 'Retirar']] as const).map(([nextAction, label]) => <Pressable key={nextAction} onPress={() => setAction(nextAction)} className={`rounded-full px-4 py-2 ${action === nextAction ? 'bg-[#087F5B]' : 'bg-[#EAF8F3]'}`}><Text className={action === nextAction ? 'font-semibold text-white' : 'font-semibold text-[#334E68]'}>{label}</Text></Pressable>)}
          </View>
          <Text className="mt-4 text-sm font-semibold text-[#334E68]">Alerta para el usuario</Text>
          <TextInput value={reason} onChangeText={setReason} placeholder="Explica qué política se incumplió" multiline textAlignVertical="top" className="mt-2 min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
          <Pressable onPress={submit} disabled={loading} className="mt-6 min-h-12 items-center justify-center rounded-xl bg-[#087F5B] disabled:opacity-60">
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-bold text-white">Guardar decisión</Text>}
          </Pressable>
          {message ? <Text className="mt-4 text-center text-sm text-slate-600">{message}</Text> : null}
        </View>
        {isAdmin ? (
          <View className="mt-5 rounded-[20px] bg-white p-5">
            <Text className="text-lg font-bold text-[#102A43]">Crear cuenta</Text>
            <Text className="mt-1 text-sm text-slate-500">Demo local: usuario, proveedor o moderador.</Text>
            <TextInput value={accountEmail} onChangeText={setAccountEmail} placeholder="Correo" autoCapitalize="none" keyboardType="email-address" className="mt-4 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
            <TextInput value={accountPassword} onChangeText={setAccountPassword} placeholder="Contraseña" secureTextEntry className="mt-3 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
            <View className="mt-3 flex-row flex-wrap gap-2">
              {([['user', 'Usuario'], ['provider', 'Proveedor'], ['moderator', 'Moderador']] as const).map(([kind, label]) => <Pressable key={kind} onPress={() => setAccountKind(kind)} className={`rounded-full px-3 py-2 ${accountKind === kind ? 'bg-[#087F5B]' : 'bg-[#EAF8F3]'}`}><Text className={accountKind === kind ? 'font-semibold text-white' : 'font-semibold text-[#334E68]'}>{label}</Text></Pressable>)}
            </View>
            <Pressable onPress={() => void createLocalAccount()} className="mt-4 min-h-12 items-center justify-center rounded-xl bg-[#087F5B]"><Text className="font-bold text-white">Crear cuenta</Text></Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
