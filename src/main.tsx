import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import { NotificationProvider } from "@/contexts/NotificationContext";

import App from "./App.tsx";
import ErrorBoundary from "./app/ErrorBoundary.tsx";
import store from "./app/store/index.ts";
import { SocketProvider } from "./contexts/SocketProvider.tsx";
import queryClient from "./lib/queryClient";
import { initSentry, reportWebVitals } from "./lib/sentry-logger";

initSentry();
reportWebVitals();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <NotificationProvider>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </NotificationProvider>
          </SocketProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </StrictMode>
);
