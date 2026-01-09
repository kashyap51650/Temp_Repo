import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bot, FolderOpen, Search } from "lucide-react";
import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { ProjectFoldersContent } from "@/components/project-folders/ProjectFoldersContent";
import { parseSearchParams } from "@/lib/utils";

export const Route = createFileRoute("/project-folders")({
  component: ProjectFoldersComponent,
  validateSearch: (search) => {
    return {
      projectId: parseSearchParams(search.projectId),
      experimentId: parseSearchParams(search.experimentId),
      studyTypeId: parseSearchParams(search.studyTypeId),
    };
  },
});

function ProjectFoldersComponent() {
  const [activeTab, setActiveTab] = useState("project-folders");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger
              value="project-folders"
              className="flex items-center gap-2"
            >
              <FolderOpen className="size-4" />
              Project Folders
            </TabsTrigger>
            <TabsTrigger
              value="data-search"
              className="flex items-center gap-2"
            >
              <Search className="size-4" />
              Data Search
            </TabsTrigger>
            <TabsTrigger
              value="ai-assistant"
              className="flex items-center gap-2"
            >
              <Bot className="size-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="project-folders" className="mt-0">
          <ProjectFoldersContent />
        </TabsContent>

        <TabsContent value="data-search" className="mt-0">
          <div className="text-muted-foreground mb-6 px-6">
            Search and filter through experiment data across all projects
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="mt-0">
          <div className="text-muted-foreground mb-6 px-6">
            Get intelligent assistance for data analysis and project management
          </div>
        </TabsContent>
      </Tabs>
      <Outlet />
    </div>
  );
}
