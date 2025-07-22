import { useSelectedProject } from "../hooks/useSelectedProject";
import { signOutUser } from "../lib/firebase";
import FileExplorer from "./FileExplorer";
import MarkdownEditor from "./MarkdownEditor";
import StagedChangesPanel from "./StagedChangesPanel";
import { Button } from "./ui/button";

export default function Layout() {
  const [, setProject] = useSelectedProject();

  const handleLogout = async () => {
    await signOutUser();
    setProject(null); // Clear project selection on logout
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="flex p-2 border-b-1 justify-between">
        <Button onClick={() => setProject(null)}>Switch Project</Button>
        <Button className="md:hidden">File Explorer</Button>
        <Button onClick={handleLogout}>Log out</Button>
      </div>
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-muted border-r border-border p-4">
          <div className="font-bold mb-4">File Explorer</div>
          <FileExplorer />
        </aside>
        {/* Main content */}
        <main className="flex-1 flex flex-col md:flex-row">
          <section className="flex-1 p-4 overflow-auto border-b md:border-b-0 md:border-r border-border">
            <MarkdownEditor />
          </section>
          <aside className="w-full md:w-80 bg-muted border-t md:border-t-0 md:border-l border-border p-4">
            <StagedChangesPanel />
          </aside>
        </main>
      </div>
    </div>
  );
}
