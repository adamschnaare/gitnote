import { useEffect, useState } from "react";
import { githubRequest } from "../lib/github";

interface Repo {
  name: string;
  owner: { login: string };
}

interface Branch {
  name: string;
}

export interface RepoBranch {
  owner: string;
  repo: string;
  branch: string;
}

export default function RepoBranchSelector({
  value,
  onChange,
}: {
  value: RepoBranch;
  onChange: (v: RepoBranch) => void;
}) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  useEffect(() => {
    setLoadingRepos(true);
    // Fetch both public and private repos by requesting with visibility=all
    githubRequest<Repo[]>("/user/repos?visibility=all")
      .then(setRepos)
      .catch(() => setRepos([]))
      .finally(() => setLoadingRepos(false));
  }, []);

  useEffect(() => {
    if (!value.repo || !value.owner) return;
    setLoadingBranches(true);
    githubRequest<Branch[]>(`/repos/${value.owner}/${value.repo}/branches`)
      .then(setBranches)
      .catch(() => setBranches([]))
      .finally(() => setLoadingBranches(false));
  }, [value.repo, value.owner]);

  return (
    <div className="flex gap-2 items-center mb-2">
      <select
        className="border rounded p-1 text-xs"
        value={value.repo}
        onChange={(e) => {
          const repo = repos.find((r) => r.name === e.target.value);
          if (repo)
            onChange({ owner: repo.owner.login, repo: repo.name, branch: "" });
        }}
        disabled={loadingRepos}
      >
        <option value="">Select repo</option>
        {repos.map((r) => (
          <option key={r.name} value={r.name}>
            {r.owner.login}/{r.name}
          </option>
        ))}
      </select>
      <select
        className="border rounded p-1 text-xs"
        value={value.branch}
        onChange={(e) => onChange({ ...value, branch: e.target.value })}
        disabled={!value.repo || loadingBranches}
      >
        <option value="">Select branch</option>
        {branches.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
