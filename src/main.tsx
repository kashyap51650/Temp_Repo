import "./index.css";

import { browserTracingIntegration } from "@sentry/browser";
import * as Sentry from "@sentry/react";
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

Sentry.init({
  // dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0,
  // release: APP_VERSION,
  beforeSend(event) {
    //for fututre use
    // if (isGuardianBrowser) {
    if ((event?.exception?.values?.length ?? 0) > 0) {
      const { value: errorMessage, type: errorType } =
        event.exception?.values?.[0] || {};

      if (
        errorMessage?.includes(
          "Identifier 'originalOpen' has already been declared"
        ) &&
        errorType === "SyntaxError"
      ) {
        return null;
      }
    }
    // }
    return event;
  },
});

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
