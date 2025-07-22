// --- Types and Interfaces ---

export interface FileNode {
  type: "file" | "folder";
  name: string;
  children?: FileNode[];
}

export interface FileMap {
  [path: string]: string;
}

export type FileChangeType = "created" | "modified" | "deleted" | "moved";

export interface FileChange {
  path: string;
  type: FileChangeType;
  content?: string;
  sha?: string;
  originalPath?: string; // for moved files
}

export interface AppState {
  owner: string;
  repo: string;
  branch: string;
  files: FileMap;
  tree: FileNode[];
  currentFile: string | null;
  fileChanges: FileChange[];
  stagedFiles: string[];
  setCurrentFile: (path: string) => void;
  setFileContent: (path: string, content: string) => void;
  stageFile: (path: string) => void;
  unstageFile: (path: string) => void;
  setRepoTree: (owner: string, repo: string, branch?: string) => Promise<void>;
}
// Utility: Build FileMap from blobs (paths to content)
export interface GitTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export interface BranchData {
  commit: {
    commit: {
      tree: {
        sha: string;
      };
    };
  };
}

export interface TreeData {
  tree: Array<{
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
  }>;
}
