import { useState } from "react";
import { createCommit } from "../lib/github";
import { useAppStore } from "../hooks/useAppStore/useAppStore";
import RepoBranchSelector from "./RepoBranchSelector";
import type { RepoBranch } from "./RepoBranchSelector";

export default function StagedChangesPanel() {
  const fileChanges = useAppStore((s) => s.fileChanges);
  const stagedFiles = useAppStore((s) => s.stagedFiles);
  const files = useAppStore((s) => s.files);
  const stageFile = useAppStore((s) => s.stageFile);
  const unstageFile = useAppStore((s) => s.unstageFile);
  const [commitMsg, setCommitMsg] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [repoBranch, setRepoBranch] = useState<RepoBranch>({
    owner: "",
    repo: "",
    branch: "",
  });

  const unstaged = fileChanges.filter((c) => !stagedFiles.includes(c.path));
  const staged = fileChanges.filter((c) => stagedFiles.includes(c.path));

  async function handleCommit() {
    setLoading(true);
    setStatus(null);
    try {
      if (!repoBranch.owner || !repoBranch.repo || !repoBranch.branch)
        throw new Error("Select repo and branch");
      await createCommit(
        repoBranch.owner,
        repoBranch.repo,
        repoBranch.branch,
        commitMsg,
        staged.map((c) => ({ path: c.path, content: files[c.path] ?? "" }))
      );
      setStatus("Commit pushed!");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setStatus(e.message || "Commit failed");
      } else {
        setStatus("Commit failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="font-bold mb-2">Staged Changes</div>
      {staged.length === 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          No files staged
        </div>
      )}
      <ul className="mb-4">
        {staged.map((c) => (
          <li key={c.path} className="flex items-center gap-2 text-sm mb-1">
            <span className="rounded bg-green-100 text-green-800 px-1 text-xs">
              {c.type}
            </span>
            <span>{c.path}</span>
            <button
              className="ml-auto text-xs text-red-500 hover:underline"
              onClick={() => unstageFile(c.path)}
            >
              Unstage
            </button>
          </li>
        ))}
      </ul>
      {staged.length > 0 && (
        <form
          className="flex flex-col gap-2 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCommit();
          }}
        >
          <RepoBranchSelector value={repoBranch} onChange={setRepoBranch} />
          <input
            className="border rounded p-1 text-xs"
            placeholder="Commit message"
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs disabled:opacity-50"
            disabled={loading || !commitMsg}
          >
            {loading ? "Committing..." : "Commit & Push"}
          </button>
          {status && (
            <div className="text-xs text-muted-foreground">{status}</div>
          )}
        </form>
      )}
      <div className="font-bold mb-2">Unstaged Changes</div>
      {unstaged.length === 0 && (
        <div className="text-xs text-muted-foreground">No unstaged changes</div>
      )}
      <ul>
        {unstaged.map((c) => (
          <li key={c.path} className="flex items-center gap-2 text-sm mb-1">
            <span className="rounded bg-yellow-100 text-yellow-800 px-1 text-xs">
              {c.type}
            </span>
            <span>{c.path}</span>
            <button
              className="ml-auto text-xs text-blue-500 hover:underline"
              onClick={() => stageFile(c.path)}
            >
              Stage
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
