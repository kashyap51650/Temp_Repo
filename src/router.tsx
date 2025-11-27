import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/queryClient";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function AppRouter() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="top-right" expand={true} richColors closeButton />
    </ThemeProvider>
  );
}
