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
    cache: "no-cache",
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
  const branchRef = await githubRequest<{ object: { sha: string } }>(
    `/repos/${_owner}/${_repo}/git/refs/heads/${_branch}`
  );
  const latestCommitSha = branchRef.object.sha;

  const blobShas = await Promise.all(
    _files.map(async (file) => {
      const blob = await githubRequest<{ sha: string }>(
        `/repos/${_owner}/${_repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
        }
      );
      return { sha: blob.sha, path: file.path };
    })
  );

  const tree = await githubRequest<{ sha: string }>(
    `/repos/${_owner}/${_repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: latestCommitSha,
        tree: blobShas.map((blob) => ({
          path: blob.path,
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        })),
      }),
    }
  );

  const commit = await githubRequest<{ sha: string }>(
    `/repos/${_owner}/${_repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: _message,
        tree: tree.sha,
        parents: [latestCommitSha],
      }),
    }
  );

  await githubRequest(`/repos/${_owner}/${_repo}/git/refs/heads/${_branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
}
