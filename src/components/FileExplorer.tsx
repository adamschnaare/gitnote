import { Folder, FileText } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore/useAppStore";
import { useEffect } from "react";
import { useSelectedProject } from "../hooks/useSelectedProject";

type FileNode = {
  type: "file" | "folder";
  name: string;
  children?: FileNode[];
};

function FileTree({
  tree,
  parentPath = "",
}: {
  tree: FileNode[];
  parentPath?: string;
}) {
  const setCurrentFile = useAppStore((s) => s.setCurrentFile);
  return (
    <ul className="pl-2">
      {tree.map((item) => {
        const path = parentPath ? `${parentPath}/${item.name}` : item.name;
        if (item.type === "folder") {
          return (
            <li key={path} className="mb-1">
              <div className="flex items-center gap-1 font-medium">
                <Folder className="w-4 h-4 text-primary" />
                {item.name}
              </div>
              {item.children && (
                <FileTree tree={item.children} parentPath={path} />
              )}
            </li>
          );
        } else {
          return (
            <li
              key={path}
              className="flex items-center gap-1 ml-5 text-sm cursor-pointer hover:underline"
              onClick={() => setCurrentFile(path)}
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              {item.name}
            </li>
          );
        }
      })}
    </ul>
  );
}

export default function FileExplorer() {
  const [project] = useSelectedProject();
  const setRepoTree = useAppStore((s) => s.setRepoTree);
  const tree = useAppStore((s) => s.tree);

  // When project changes, fetch and set the repo tree
  useEffect(() => {
    if (project && project.owner && project.name) {
      console.log("trying");
      setRepoTree(project.owner.login, project.name);
    }
  }, [project, setRepoTree]);

  return (
    <nav>
      <FileTree tree={tree} />
    </nav>
  );
}
