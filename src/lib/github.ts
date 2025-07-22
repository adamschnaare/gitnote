// github.ts: GitHub API integration utilities
import { getGitHubAccessToken } from "./githubAuth";

// Make an authenticated GitHub API request using Firebase GitHub access token
export async function githubRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getGitHubAccessToken();
  console.log("endpoint", endpoint);
  if (!token) throw new Error("No GitHub access token found (Firebase Auth)");
  const res = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

// Example: create a commit (simplified, for demo)
// Placeholder for future implementation. Parameters are intentionally unused.

export async function createCommit(
  _owner: string,
  _repo: string,
  _branch: string,
  _message: string,
  _files: { path: string; content: string }[]
) {
  // This is a placeholder. Real implementation requires:
  // 1. Get latest commit SHA for branch
  // 2. Create blobs for each file
  // 3. Create a tree
  // 4. Create a commit
  // 5. Update the branch ref
  // See: https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28
  throw new Error("Not implemented: See github.ts for details.");
}
