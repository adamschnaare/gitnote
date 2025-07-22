import { useState, useEffect } from "react";

// Custom hook to sync selected project with localStorage
export function useSelectedProject<T = any>() {
  const [project, setProject] = useState<T | null>(() => {
    const raw = localStorage.getItem("selected_project");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (project) {
      console.log("firing", project);
      localStorage.setItem("selected_project", JSON.stringify(project));
    }
  }, [project]);

  return [project, setProject] as const;
}
