import Layout from "./components/Layout";
import GitHubAuthPanel from "./components/GitHubAuthPanel";
import ProjectSelector from "./components/ProjectSelector";
import { useGitHubAuth } from "./lib/githubAuth";
import { signOutUser } from "./lib/firebase";

import { useSelectedProject } from "./hooks/useSelectedProject";

function App() {
  const token = useGitHubAuth();
  const hasToken = !!token;
  const [project, setProject] = useSelectedProject();

  if (!hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <GitHubAuthPanel />
      </div>
    );
  }

  // Log out button (always visible when authenticated)
  const handleLogout = async () => {
    await signOutUser();
    setProject(null); // Clear project selection on logout
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <button
          className="absolute top-4 right-4 text-xs text-red-500 hover:underline border px-2 py-1 rounded"
          onClick={handleLogout}
        >
          Log out
        </button>
        <ProjectSelector value={project} onChange={setProject} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Layout />
    </div>
  );
}

export default App;
