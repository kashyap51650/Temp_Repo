import React from "react";

import { Button } from "@/components/atoms";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/molecules/Breadcrumb/Breadcrumb";

interface BreadcrumbItemType {
  label: string;
  clickable?: boolean;
}

interface ProjectFoldersHeaderProps {
  breadcrumbs: BreadcrumbItemType[];
  onClickHandlers?: Array<() => void>;
  title?: string;
  subtitle?: string;
}

export function ProjectFoldersHeader({
  breadcrumbs,
  onClickHandlers = [],
  title = "Project Folders",
  subtitle = "Manage your projects, experiments, and study data",
}: Readonly<ProjectFoldersHeaderProps>) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2 text-black">{title}</h1>
      <p className="text-gray-600 mb-0">{subtitle}</p>
      <div className="mt-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  {item.clickable ? (
                    <BreadcrumbLink asChild>
                      <Button
                        variant="link"
                        onClick={onClickHandlers[idx]}
                        className="bg-transparent px-0 py-0 h-auto text-muted-foreground hover:text-primary font-medium underline-offset-2"
                      >
                        {item.label}
                      </Button>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
