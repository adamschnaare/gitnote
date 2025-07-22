import type { GitTreeItem, FileNode, FileMap } from "./types";

// --- End Types and Interfaces ---
// Utility: Convert a flat GitHub tree to FileNode[]
export function buildFileTree(tree: GitTreeItem[]): FileNode[] {
  // Use children as an object during construction
  type FileNodeWithChildrenObj = Omit<FileNode, "children"> & {
    children?: Record<string, FileNodeWithChildrenObj>;
  };
  const root: Record<string, FileNodeWithChildrenObj> = {};
  for (const item of tree) {
    const parts = item.path.split("/");
    let curr = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (item.type === "tree") {
          curr[part] = { type: "folder", name: part, children: {} };
        } else {
          curr[part] = { type: "file", name: part };
        }
      } else {
        if (!curr[part]) {
          curr[part] = { type: "folder", name: part, children: {} };
        }
        curr = (curr[part] as FileNodeWithChildrenObj).children!;
      }
    }
  }
  // Convert root object to array and children objects to arrays
  function toArray(obj: Record<string, FileNodeWithChildrenObj>): FileNode[] {
    return Object.values(obj)
      .map((node) => {
        if (node.type === "folder" && node.children) {
          const childrenArr = toArray(node.children);
          if (childrenArr.length === 0) {
            // Hide empty folders
            return null;
          }
          return {
            type: "folder",
            name: node.name,
            children: childrenArr,
          };
        }
        // For files, do not include the children property
        return { type: "file", name: node.name };
      })
      .filter(Boolean) as FileNode[];
  }
  return toArray(root);
}
export function buildFileMap(
  tree: GitTreeItem[],
  blobs: { [sha: string]: string }
): FileMap {
  const map: FileMap = {};
  for (const item of tree) {
    if (item.type === "blob" && blobs[item.sha]) {
      map[item.path] = blobs[item.sha];
    }
  }
  return map;
}
