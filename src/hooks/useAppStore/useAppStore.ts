import { create } from "zustand";
import { githubRequest } from "../../lib/github";
import { buildFileMap, buildFileTree } from "./helpers";
import type { AppState, FileChangeType, BranchData, TreeData } from "./types";

export const useAppStore = create<AppState>((set, get) => ({
  owner: "",
  repo: "",
  branch: "",
  files: {},
  tree: [],
  currentFile: null,
  fileChanges: [],
  stagedFiles: [],
  setCurrentFile: (path: string) => set({ currentFile: path }),
  setFileContent: (path: string, content: string) =>
    set((state) => {
      const prevContent = state.files[path];
      let fileChanges = [...state.fileChanges];
      // Only add a change if content is actually different
      if (prevContent !== content) {
        // If file was already marked as created, just update content
        const existing = fileChanges.find(
          (c) => c.path === path && c.type === "created"
        );
        if (existing) {
          existing.content = content;
        } else {
          // Otherwise, mark as modified (or created if it didn't exist before)
          const type: FileChangeType =
            prevContent === undefined ? "created" : "modified";
          fileChanges = fileChanges.filter(
            (c) => c.path !== path && c.type !== "modified"
          );
          fileChanges.push({ path, type, content });
        }
      }
      return {
        files: { ...state.files, [path]: content },
        fileChanges,
      };
    }),
  stageFile: (path: string) =>
    set((state) => ({
      stagedFiles: Array.from(new Set([...state.stagedFiles, path])),
    })),
  unstageFile: (path: string) =>
    set((state) => ({
      stagedFiles: state.stagedFiles.filter((p) => p !== path),
    })),
  // Fetch and set the repo tree and file contents from GitHub
  setRepoTree: async (owner: string, repo: string, branch = "main") => {
    const oldCurrentFile = get().currentFile;
    // 1. Get the default branch SHA
    const branchData = await githubRequest<BranchData>(
      `/repos/${owner}/${repo}/branches/${branch}`
    );
    const treeSha = branchData.commit.commit.tree.sha;
    // 2. Get the full tree

    const treeData = await githubRequest<TreeData>(
      `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
    );
    const tree = treeData.tree;
    // 3. Fetch all blobs (file contents)
    const blobItems = tree.filter(
      (item: { type: string }) => item.type === "blob"
    );
    const blobs: { [sha: string]: string } = {};
    await Promise.all(
      blobItems.map(async (item) => {
        const blob = await githubRequest<{ content: string }>(
          `/repos/${owner}/${repo}/git/blobs/${item.sha}`
        );
        // Blobs are base64 encoded
        // Use TextDecoder to correctly handle UTF-8 characters (like emojis)
        const decodedContent = new TextDecoder().decode(
          Uint8Array.from(atob(blob.content.replace(/\n/g, "")), (c) =>
            c.charCodeAt(0)
          )
        );
        blobs[item.sha] = decodedContent;
      })
    );
    // 4. Build FileMap and FileNode tree
    const fileMap = buildFileMap(tree, blobs);
    const fileTree = buildFileTree(tree);
    // 5. Set state
    set({
      owner,
      repo,
      branch,
      files: fileMap,
      tree: fileTree,
      currentFile:
        oldCurrentFile && fileMap[oldCurrentFile]
          ? oldCurrentFile
          : Object.keys(fileMap)[0] || null,
      fileChanges: [],
      stagedFiles: [],
    });
  },
}));
