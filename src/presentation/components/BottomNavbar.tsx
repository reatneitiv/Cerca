import { Ionicons } from "@expo/vector-icons";
import { canModerateListings, hasCapacity } from "@/domain/auth/entities/Actor";
import { useAuth } from "@/presentation/providers/AuthProvider";
import { Animated, Pressable, Text, View } from "react-native";
import { useRef } from "react";

type BottomNavbarProps = any;

// Las rutas que no estén disponibles para la cuenta se excluyen al renderizar.
const tabs = [
  { route: "favorites", label: "Favoritos", icon: "star-outline", activeIcon: "star" },
  { route: "index", label: "Inicio", icon: "home-outline", activeIcon: "home" },
  { route: "provider", label: "Servicios", icon: "briefcase-outline", activeIcon: "briefcase" },
  { route: "moderation", label: "Moderación", icon: "shield-outline", activeIcon: "shield" },
  { route: "profile", label: "Perfil", icon: "person-outline", activeIcon: "person" },
] as const;

export function BottomNavbar({ state, descriptors, navigation }: BottomNavbarProps) {
  const { actor } = useAuth();
  const isModeratorOnly = actor?.platformRole === "moderator";
  const visibleTabs = tabs.filter((tab) => {
    if (tab.route === "favorites") return !isModeratorOnly;
    if (tab.route === "provider") return Boolean(actor && hasCapacity(actor, "provider") && !isModeratorOnly);
    if (tab.route === "moderation") return Boolean(actor && canModerateListings(actor));
    const route = state.routes.find((item: any) => item.name === tab.route);
    return route && descriptors[route.key]?.options?.href !== null;
  });
  const scales = useRef(tabs.map(() => new Animated.Value(1))).current;

  const navigateTo = (routeName: string, index: number) => {
    Animated.sequence([
      Animated.spring(scales[index], { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scales[index], { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    const route = state.routes.find((item: any) => item.name === routeName);
    if (!route) return;
    const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(route.name);
  };

  return (
    // Posicionamiento flotante sobre la pantalla
    <View className="absolute bottom-6 left-0 right-0 items-center px-6">
      {/* Contenedor principal estilo cápsula clara (mismo color que el buscador #E6F0ED) */}
      <View className="flex-row items-center justify-between rounded-full bg-[#E6F0ED] p-2 shadow-lg w-full max-w-[360px]">
        {visibleTabs.map((tab) => {
          const index = tabs.findIndex((item) => item.route === tab.route);
          const routeIndex = state.routes.findIndex((route: any) => route.name === tab.route);
          const isFocused = state.index === routeIndex;
          const iconName = isFocused ? tab.activeIcon : tab.icon;
          const label = descriptors[state.routes[routeIndex]?.key]?.options?.title ?? tab.label;

          return (
            <Pressable
              key={tab.route}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={() => navigateTo(tab.route, index)}
            >
              <Animated.View
                style={{ transform: [{ scale: scales[index] }] }}
                // Fondo verde oscuro (#087F5B) solo cuando la pestaña esté activa
                className={`flex-row items-center justify-center rounded-full px-5 py-3 ${
                  isFocused ? "bg-[#087F5B]" : "bg-transparent"
                }`}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? "#FFFFFF" : "#5C7C71"}
                />

                {/* Mostrar nombre solo si la opción está seleccionada */}
                {isFocused && (
                  <Text className="ml-2 text-xs font-bold text-white">
                    {label}
                  </Text>
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
