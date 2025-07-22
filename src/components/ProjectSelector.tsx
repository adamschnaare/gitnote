import { useEffect, useState } from "react";
import { githubRequest } from "../lib/github";

interface Repo {
  name: string;
  owner: { login: string };
  description?: string;
}

export default function ProjectSelector({
  value,
  onChange,
}: {
  value: Repo | null;
  onChange: (repo: Repo) => void;
}) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllRepos() {
      setLoading(true);
      let all: Repo[] = [];
      let page = 1;
      let hasMore = true;
      try {
        while (hasMore) {
          const pageRepos = await githubRequest<Repo[]>(
            `/user/repos?per_page=100&page=${page}`
          );
          all = all.concat(pageRepos);
          hasMore = pageRepos.length === 100;
          page++;
        }
        setRepos(all);
      } catch {
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllRepos();
  }, []);

  async function handleCreateRepo(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const repo = await githubRequest<Repo>("/user/repos", {
        method: "POST",
        body: JSON.stringify({ name: newRepoName, auto_init: true }),
        headers: { "Content-Type": "application/json" },
      });
      setRepos([repo, ...repos]);
      onChange(repo);
      setNewRepoName("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to create repo");
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-muted max-w-md mx-auto">
      <div className="font-bold">Select a Project (GitHub Repo)</div>
      <select
        className="border rounded p-2 text-sm"
        value={value?.name || ""}
        onChange={(e) => {
          const repo = repos.find((r) => r.name === e.target.value);
          if (repo) onChange(repo);
        }}
        disabled={loading}
      >
        <option value="">-- Select a repo --</option>
        {repos.map((r) => (
          <option key={r.name} value={r.name}>
            {r.owner.login}/{r.name}
          </option>
        ))}
      </select>
      <form onSubmit={handleCreateRepo} className="flex gap-2 items-center">
        <input
          className="border rounded p-1 text-xs flex-1"
          placeholder="New repo name"
          value={newRepoName}
          onChange={(e) => setNewRepoName(e.target.value)}
          required
          disabled={creating}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs disabled:opacity-50"
          disabled={creating || !newRepoName}
        >
          {creating ? "Creating..." : "Create Repo"}
        </button>
      </form>
      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
}
