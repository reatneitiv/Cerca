import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
import { BottomNavbar } from '@/presentation/components/BottomNavbar';
import { canModerateListings, hasCapacity } from '@/domain/auth/entities/Actor';
import { useAuth } from '@/presentation/providers/AuthProvider';

export default function TabLayout() {
  const router = useRouter();
  const { actor, refreshActor } = useAuth();
  const [checking, setChecking] = useState(true);
  const isModeratorOnly = actor?.platformRole === "moderator";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!mounted) return;
        if (!token) {
          router.replace('/sign-in');
        } else {
          await refreshActor();
          if (mounted) setChecking(false);
        }
      } catch (_e) {
        if (mounted) router.replace('/sign-in');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshActor, router]);

  if (checking) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );

  return (
    <Tabs
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isModeratorOnly ? "Servicios" : "Inicio",
        }}
      />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritos', href: isModeratorOnly ? null : undefined }} />
      <Tabs.Screen
        name="provider"
        options={{
          title: "Servicios",
          href: actor && hasCapacity(actor, "provider") && !isModeratorOnly ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="moderation"
        options={{
          title: "Moderación",
          href: actor && canModerateListings(actor) ? undefined : null,
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
