import ReactMarkdown from "react-markdown";
import { useAppStore } from "../hooks/useAppStore/useAppStore";
import { useState } from "react";
import { Button } from "./ui/button";

export default function MarkdownEditor() {
  const currentFile = useAppStore((s) => s.currentFile);
  const files = useAppStore((s) => s.files);
  const setFileContent = useAppStore((s) => s.setFileContent);
  const [preview, setPreview] = useState(true);

  if (!currentFile) {
    return <div className="text-muted-foreground">No file selected.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-xs text-muted-foreground">
          {currentFile}
        </span>
        <Button variant="outline" onClick={() => setPreview((p) => !p)}>
          {preview ? "Editor" : "Preview"}
        </Button>
      </div>
      <div className="flex-1 flex gap-4 overflow-hidden">
        <textarea
          className={`flex-1 resize-none p-2 border rounded font-mono bg-background text-foreground ${
            preview ? "hidden md:block" : "block"
          }`}
          value={files[currentFile] ?? ""}
          onChange={(e) => setFileContent(currentFile, e.target.value)}
          spellCheck={false}
        />
        <div
          className={`flex-1 overflow-auto border rounded bg-background p-2 ${
            preview ? "block" : "hidden md:block"
          }`}
        >
          <ReactMarkdown>{files[currentFile] ?? ""}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
