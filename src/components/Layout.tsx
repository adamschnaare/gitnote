import FileExplorer from "./FileExplorer";
import MarkdownEditor from "./MarkdownEditor";
import StagedChangesPanel from "./StagedChangesPanel";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
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
  );
}
