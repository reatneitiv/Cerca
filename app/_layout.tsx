import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '../src/shared/queryClient';
import { FavoritesProvider } from '../src/presentation/providers/FavoritesProvider';
import { AuthProvider } from '../src/presentation/providers/AuthProvider';
import "../global.css";

// initialize i18n
import '../src/shared/i18n';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
