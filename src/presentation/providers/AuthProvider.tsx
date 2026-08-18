import type { Actor } from "@/domain/auth/entities/Actor";
import { AuthApi } from "@/infrastructure/auth/api/AuthApi";
import { getAccessToken, onSessionCleared } from "@/infrastructure/auth/session/AuthSessionStorage";
import { FetchHttpClient } from "@/infrastructure/http/FetchHttpClient";
import * as SecureStore from "expo-secure-store";
import React from "react";

export const DEMO_MODERATOR_EMAIL = "moderador@cerca.test";
export const DEMO_MODERATOR_TOKEN = "cerca-demo-moderator";
export const DEMO_ADMIN_EMAIL = "admin@cerca.test";
export const DEMO_ADMIN_TOKEN = "cerca-demo-admin";
const LOCAL_ACCOUNTS_KEY = "cerca-local-demo-accounts";
const LOCAL_ACCOUNT_TOKEN_PREFIX = "cerca-local-account:";

export type LocalDemoAccount = {
  id: string;
  email: string;
  password: string;
  platformRole: Actor["platformRole"];
  capacities: Actor["capacities"];
};

export async function getLocalDemoAccounts(): Promise<LocalDemoAccount[]> {
  const stored = await SecureStore.getItemAsync(LOCAL_ACCOUNTS_KEY);
  if (!stored) return [];
  try { return JSON.parse(stored) as LocalDemoAccount[]; } catch { return []; }
}

export async function saveLocalDemoAccount(account: LocalDemoAccount): Promise<void> {
  const accounts = await getLocalDemoAccounts();
  await SecureStore.setItemAsync(LOCAL_ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
}

const demoModerator: Actor = {
  id: "demo-moderator",
  capacities: ["customer", "provider"],
  platformRole: "moderator",
};

const demoAdmin: Actor = {
  id: "demo-admin",
  capacities: ["customer", "provider"],
  platformRole: "admin",
};

type AuthContextValue = {
  actor: Actor | null;
  refreshActor: () => Promise<Actor | null>;
  becomeProvider: () => Promise<Actor>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [actor, setActor] = React.useState<Actor | null>(null);

  React.useEffect(() => onSessionCleared(() => setActor(null)), []);

  // Inicializar actor cuando la app se abre
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = await getAccessToken();

      if (__DEV__) {
        console.log("[AUTH INIT]", token ? "Token encontrado al abrir app" : "Sin token");
      }

      if (!token) {
        setActor(null);
        return;
      }

      if (token === DEMO_MODERATOR_TOKEN) {
        setActor(demoModerator);
        return;
      }

      if (token === DEMO_ADMIN_TOKEN) {
        setActor(demoAdmin);
        return;
      }

      if (token.startsWith(LOCAL_ACCOUNT_TOKEN_PREFIX)) {
        const id = token.slice(LOCAL_ACCOUNT_TOKEN_PREFIX.length);
        const account = (await getLocalDemoAccounts()).find((item) => item.id === id);
        if (account) {
          const localActor: Actor = { id: account.id, capacities: account.capacities, platformRole: account.platformRole };
          setActor(localActor);
          return;
        }
      }

      try {
        const currentActor = await new AuthApi(new FetchHttpClient()).getCurrentActor();
        setActor(currentActor);
      } catch (error) {
        setActor(null);
      }
    };

    initializeAuth();
  }, []);

  const refreshActor = React.useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setActor(null);
      return null;
    }

    if (token === DEMO_MODERATOR_TOKEN) {
      setActor(demoModerator);
      return demoModerator;
    }

    if (token === DEMO_ADMIN_TOKEN) {
      setActor(demoAdmin);
      return demoAdmin;
    }

    if (token.startsWith(LOCAL_ACCOUNT_TOKEN_PREFIX)) {
      const id = token.slice(LOCAL_ACCOUNT_TOKEN_PREFIX.length);
      const account = (await getLocalDemoAccounts()).find((item) => item.id === id);
      if (account) {
        const localActor: Actor = { id: account.id, capacities: account.capacities, platformRole: account.platformRole };
        setActor(localActor);
        return localActor;
      }
    }

    try {
      const currentActor = await new AuthApi(new FetchHttpClient()).getCurrentActor();
      setActor(currentActor);
      return currentActor;
    } catch (error) {
      // Token inválido o expirado - FetchHttpClient ya lo limpió
      // No lanzar error, solo retornar null
      setActor(null);
      return null;
    }
  }, []);

  const becomeProvider = React.useCallback(async () => {
    const updatedActor = await new AuthApi(new FetchHttpClient()).becomeProvider();
    setActor(updatedActor);
    return updatedActor;
  }, []);

  return (
    <AuthContext.Provider value={{ actor, refreshActor, becomeProvider }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
