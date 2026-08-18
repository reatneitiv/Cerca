import { hasCapacity } from "@/domain/auth/entities/Actor";
import type { Category } from "@/domain/entities/category.entity";
import type { ListingSummary } from "@/domain/entities/listing.entity";
import { ListingApi } from "@/infrastructure/api/ListingApi";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { parseApiError } from "@/presentation/utils/parseApiError";
import { getCategoriesUseCase, getCurrentLocationUseCase } from "@/shared/container/container";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderScreen() {
  const { actor } = useAuth();
  const isProvider = actor ? hasCapacity(actor, "provider") : false;
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [pricingModel, setPricingModel] = React.useState<"fixed" | "hourly" | "quote">("fixed");
  const [minimumHours, setMinimumHours] = React.useState("1");
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [myListings, setMyListings] = React.useState<ListingSummary[]>([]);
  const [loadingListings, setLoadingListings] = React.useState(true);
  const [updatingListingId, setUpdatingListingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getCategoriesUseCase.execute().then(setCategories).catch(() => {
      setMessage("No pudimos cargar las categorías. Inténtalo de nuevo.");
    });
  }, []);

  const loadMyListings = React.useCallback(async () => {
    setLoadingListings(true);
    try {
      const listings = await new ListingApi(new FetchHttpClient()).mine();
      setMyListings(listings);
    } catch (error) {
      setMessage(parseApiError(error).message);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  React.useEffect(() => {
    if (isProvider) void loadMyListings();
  }, [isProvider, loadMyListings]);

  async function handlePublish() {
    if (!title.trim() || !description.trim() || !selectedCategory) {
      setMessage("Completa todos los campos requeridos.");
      return;
    }

    const amount = price.trim() ? Number(price.replace(",", ".")) : 0;
    const hours = pricingModel === "hourly" ? Number(minimumHours) : 1;

    if (pricingModel === "fixed" && (!Number.isFinite(amount) || amount <= 0)) {
      setMessage("Ingresa un precio válido mayor a 0.");
      return;
    }
    if (pricingModel === "hourly") {
      if (!Number.isFinite(amount) || amount <= 0) {
        setMessage("Ingresa una tarifa por hora válida.");
        return;
      }
      if (!Number.isInteger(hours) || hours < 1) {
        setMessage("Las horas mínimas deben ser un número entero mayor a 0.");
        return;
      }
    }

    setSubmitting(true);
    setMessage(null);
    try {
      // Obtener ubicación del usuario
      let location;
      try {
        location = await getCurrentLocationUseCase.execute();
      } catch (locationError) {
        if (
          locationError instanceof Error &&
          locationError.message === "LOCATION_PERMISSION_DENIED"
        ) {
          setMessage("Activa el permiso de ubicación para publicar un servicio.");
        } else {
          setMessage("No pudimos obtener tu ubicación. Inténtalo de nuevo.");
        }
        setSubmitting(false);
        return;
      }

      const api = new ListingApi(new FetchHttpClient());
      
      let pricing;
      if (pricingModel === "fixed") {
        pricing = { model: "fixed" as const, price: { amountMinor: Math.round(amount * 100), currency: "COP" } };
      } else if (pricingModel === "hourly") {
        pricing = { model: "hourly" as const, hourlyRate: { amountMinor: Math.round(amount * 100), currency: "COP" }, minimumHours: hours };
      } else {
        pricing = { 
          model: "quote" as const, 
          startingFrom: amount > 0 ? { amountMinor: Math.round(amount * 100), currency: "COP" } : undefined
        };
      }

      const listing = await api.create({
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategory,
        location,
        pricing,
      });
      await api.publish(listing.id);
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedCategory(null);
      setMessage("Servicio publicado. Ya aparece en los servicios disponibles.");
      await loadMyListings();
    } catch (error) {
      setMessage(parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleListingStatus(listing: ListingSummary) {
    setUpdatingListingId(listing.id);
    setMessage(null);
    try {
      const api = new ListingApi(new FetchHttpClient());
      if (listing.status === "published") await api.pause(listing.id);
      else await api.publish(listing.id);
      await loadMyListings();
    } catch (error) {
      setMessage(parseApiError(error).message);
    } finally {
      setUpdatingListingId(null);
    }
  }

  if (!isProvider) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 items-center justify-center bg-[#F7FAFC] px-6">
        <Text className="text-center text-base text-slate-600">
          Esta sección está disponible para cuentas proveedoras.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7FAFC]">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-6 pb-32">
        <Text className="text-2xl font-extrabold text-[#102A43]">Mis servicios</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Crea y publica los servicios que ofreces.
        </Text>

        <View className="mt-7 rounded-[20px] bg-white p-5">
          <View className="flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#DDF5ED]">
              <Ionicons name="briefcase" size={20} color="#087F5B" />
            </View>
            <Text className="ml-3 text-lg font-bold text-[#102A43]">Publicar servicio</Text>
          </View>

          <Text className="mt-5 text-sm font-semibold text-[#334E68]">Título</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Ej. Clases de guitarra" className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />

          <Text className="mt-4 text-sm font-semibold text-[#334E68]">Descripción</Text>
          <TextInput value={description} onChangeText={setDescription} placeholder="Cuenta qué ofreces" multiline textAlignVertical="top" className="mt-2 min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />

          <Text className="mt-4 text-sm font-semibold text-[#334E68]">Categoría</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {categories.map((category) => {
              const selected = selectedCategory === category.id;
              return <Pressable key={category.id} onPress={() => setSelectedCategory(category.id)} className={`rounded-full px-3 py-2 ${selected ? "bg-[#087F5B]" : "bg-[#EAF8F3]"}`}><Text className={selected ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[#334E68]"}>{category.name}</Text></Pressable>;
            })}
          </View>

          <Text className="mt-4 text-sm font-semibold text-[#334E68]">Precio (COP)</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {([
              ["fixed", "Precio fijo"],
              ["hourly", "Por hora"],
              ["quote", "Presupuesto"],
            ] as const).map(([model, label]) => {
              const selected = pricingModel === model;
              return <Pressable key={model} onPress={() => setPricingModel(model)} className={`rounded-full px-3 py-2 ${selected ? "bg-[#087F5B]" : "bg-[#EAF8F3]"}`}><Text className={selected ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[#334E68]"}>{label}</Text></Pressable>;
            })}
          </View>
          <TextInput value={price} onChangeText={setPrice} placeholder={pricingModel === "quote" ? "Desde (opcional)" : "Ej. 50000"} keyboardType="decimal-pad" className="mt-3 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
          {pricingModel === "hourly" ? (
            <>
              <Text className="mt-3 text-sm font-semibold text-[#334E68]">Horas mínimas</Text>
              <TextInput value={minimumHours} onChangeText={setMinimumHours} keyboardType="number-pad" className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900" />
            </>
          ) : null}

          <Pressable onPress={handlePublish} disabled={submitting} className="mt-6 min-h-12 items-center justify-center rounded-xl bg-[#087F5B] px-5 active:opacity-90 disabled:opacity-60">
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="font-bold text-white">Publicar servicio</Text>}
          </Pressable>
          {message ? <Text className="mt-4 text-center text-sm text-slate-600">{message}</Text> : null}
        </View>

        <View className="mt-7">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-extrabold text-[#102A43]">Mis publicaciones</Text>
            <Pressable onPress={() => void loadMyListings()} accessibilityLabel="Actualizar mis publicaciones">
              <Ionicons name="refresh" size={21} color="#087F5B" />
            </Pressable>
          </View>

          {loadingListings ? (
            <ActivityIndicator className="mt-6" color="#087F5B" />
          ) : myListings.length === 0 ? (
            <View className="mt-4 rounded-2xl bg-white p-5">
              <Text className="font-semibold text-[#334E68]">Aún no has publicado servicios.</Text>
              <Text className="mt-1 text-sm text-slate-500">Completa el formulario de arriba para crear el primero.</Text>
            </View>
          ) : (
            <View className="mt-4 gap-3">
              {myListings.map((listing) => {
                const isPublished = listing.status === "published";
                const changing = updatingListingId === listing.id;
                return (
                  <View key={listing.id} className="rounded-2xl bg-white p-4">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-base font-bold text-[#102A43]">{listing.title}</Text>
                        <Text className="mt-1 text-sm text-slate-500">{isPublished ? "Publicado" : "Pausado o en borrador"}</Text>
                      </View>
                      <Pressable
                        onPress={() => void handleListingStatus(listing)}
                        disabled={changing}
                        className="rounded-lg bg-[#EAF8F3] px-3 py-2 disabled:opacity-60"
                      >
                        {changing ? <ActivityIndicator size="small" color="#087F5B" /> : <Text className="text-xs font-bold text-[#087F5B]">{isPublished ? "Pausar" : "Publicar"}</Text>}
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
