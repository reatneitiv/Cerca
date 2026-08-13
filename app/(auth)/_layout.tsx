import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!mounted) return;
        if (token) {
          router.replace('/');
        } else {
          setChecking(false);
        }
      } catch (_e) {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );

  return <Slot />;
}
