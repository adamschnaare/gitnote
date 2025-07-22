import { useState } from "react";
import { signInWithGitHub, signOutUser } from "../lib/firebase";
import {
  saveGitHubAccessToken,
  clearGitHubAccessToken,
} from "../lib/githubAuth";

export default function GitHubAuthPanel() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGitHub();
      // The GitHub access token is in result._tokenResponse.oauthAccessToken
      const token = (result as any)?._tokenResponse?.oauthAccessToken;
      if (token) {
        saveGitHubAccessToken(token);
      }
    } catch (e: any) {
      setError(e.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOutUser();
    clearGitHubAccessToken();
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-muted max-w-md mx-auto items-center justify-center">
      <div className="font-bold">Sign in with GitHub</div>
      <button
        className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm disabled:opacity-50"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in with GitHub"}
      </button>
      <button
        className="text-xs text-red-500 hover:underline"
        onClick={handleSignOut}
      >
        Sign out
      </button>
      {error && <div className="text-xs text-red-500">{error}</div>}
      <div className="text-xs text-muted-foreground mt-2">
        You will be redirected to GitHub to authorize access.
      </div>
    </div>
  );
}
