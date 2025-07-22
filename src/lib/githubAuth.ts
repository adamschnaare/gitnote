import { useEffect, useState } from "react";
import { auth, onAuthChange } from "./firebase";
import type { User } from "firebase/auth";
// React hook to get the current GitHub access token reactively
export function useGitHubAuth(): string | null {
  const [token, setToken] = useState<string | null>(() =>
    getGitHubAccessToken()
  );
  useEffect(() => {
    const unsubscribe = onAuthChange(() => {
      setToken(getGitHubAccessToken());
    });
    // Also listen to localStorage changes (for multi-tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "firebase_github_access_token") {
        setToken(getGitHubAccessToken());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return token;
}

export function getGitHubAccessToken(): string | null {
  const user = auth.currentUser as User | null;
  if (!user) return null;
  // Find the GitHub provider data
  const providerData = user.providerData.find(
    (p) => p.providerId === "github.com"
  );

  console.log("providerData", providerData);
  // The access token is stored in user.stsTokenManager.accessToken (for custom claims)
  // But for GitHub, Firebase does not expose the OAuth access token by default.
  // We need to get it from the signInWithPopup result and store it somewhere (e.g. localStorage)
  // For now, try to get it from localStorage (set after sign-in)
  return localStorage.getItem("firebase_github_access_token");
}

export function saveGitHubAccessToken(token: string) {
  localStorage.setItem("firebase_github_access_token", token);
}
export function clearGitHubAccessToken() {
  localStorage.removeItem("firebase_github_access_token");
}
