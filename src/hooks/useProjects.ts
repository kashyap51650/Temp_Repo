import { useCallback, useEffect, useRef, useState } from "react";

import { type Project, projectApi } from "@/api";
import { toast } from "@/components/atoms/Sonner/toast";
import { useIsAuthenticated } from "@/lib/auth";

import { handleApiError } from "../lib/api";
import useDebounce from "./useDebounce";

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  searchProjects: (searchTerm: string) => void;
  refreshProjects: () => void;
  createProject: (
    projectName: string,
    description: string
  ) => Promise<Project | null>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isAuthenticated = useIsAuthenticated();

  const isInitialized = useRef(false);
  const loadingRef = useRef(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadProjects = useCallback(async (search?: string) => {
    if (loadingRef.current || !isAuthenticated) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const response = search
        ? await projectApi.searchProjects(search)
        : await projectApi.getProjects();

      if (response.success) {
        setProjects(response.data);
      } else {
        const errorMessage = response.message || "Failed to load projects";
        setError(errorMessage);
        toast.error("Failed to load projects", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load projects");
      setError(errorMessage);
      console.error("Error loading projects:", err);

      toast.error("Failed to load projects", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const searchProjects = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const refreshProjects = useCallback(() => {
    loadProjects(searchTerm);
  }, [loadProjects, searchTerm]);

  const createProject = useCallback(
    async (
      projectName: string,
      description: string
    ): Promise<Project | null> => {
      try {
        setError(null);
        const response = await projectApi.createProject({
          project_name: projectName,
          description: description,
        });

        if (response.success) {
          setProjects((prev) => [...prev, response.data]);

          toast.success("Project created successfully", {
            description: `"${projectName}" has been created`,
          });

          return response.data;
        } else {
          const errorMessage = response.message || "Failed to create project";
          setError(errorMessage);
          toast.error("Failed to create project", {
            description: errorMessage,
          });

          return null;
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to create project");
        setError(errorMessage);
        console.error("Error creating project:", err);

        toast.error("Failed to create project", {
          description: errorMessage,
        });

        return null;
      }
    },
    []
  );

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadProjects();
    }
  }, [loadProjects]);

  useEffect(() => {
    if (isInitialized.current) {
      if (debouncedSearchTerm) {
        loadProjects(debouncedSearchTerm);
      } else if (debouncedSearchTerm === "" && searchTerm === "") {
        loadProjects();
      }
    }
  }, [debouncedSearchTerm, loadProjects, searchTerm]);

  return {
    projects,
    loading,
    error,
    searchProjects,
    refreshProjects,
    createProject,
  };
}
