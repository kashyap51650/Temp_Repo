# System Architecture

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Core Libraries](#core-libraries)
- [Development Tools](#development-tools)
- [State Management](#state-management)
- [Routing](#routing)
- [UI Components](#ui-components)
- [Forms & Validation](#forms--validation)
- [Data Management](#data-management)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling & Monitoring](#error-handling--monitoring)
- [Build](#build)
- [Performance Optimizations](#performance-optimizations)
- [Security](#security)

## Overview

Orano Med Frontend is a **single-page application (SPA)** built with modern React ecosystem, designed for managing pharmaceutical research data and experiment management.

### Key Characteristics

- **Type-Safe**: Full TypeScript implementation
- **Component-Based**: Atomic design architecture
- **Performance-First**: Code splitting, lazy loading, caching
- **Accessible**: WCAG 2.1 AA compliant
- **Scalable**: Modular architecture for easy maintenance

## Technology Stack

### Frontend Core

| Technology     | Version | Purpose                                    |
| -------------- | ------- | ------------------------------------------ |
| **React**      | 19.1.1  | UI library with latest concurrent features |
| **TypeScript** | 5.9.3   | Static type checking and enhanced DX       |
| **Vite**       | 7.1.11  | Build tool with HMR and optimized bundling |

**Why React 19?**

- Improved performance with automatic batching
- Concurrent rendering features
- Suspense for data fetching
- Enhanced developer experience

**Why TypeScript?**

- Catch errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

**Why Vite?**

- Lightning-fast cold start
- Instant HMR (Hot Module Replacement)
- Optimized production builds
- Native ES modules support

### Routing & Navigation

| Library                      | Version | Purpose                        |
| ---------------------------- | ------- | ------------------------------ |
| **TanStack Router**          | 1.132+  | Type-safe file-based routing   |
| **TanStack Router DevTools** | 1.132+  | Route debugging and inspection |

**Features**:

- File-based routing (routes auto-generated)
- Type-safe navigation and search params
- Nested layouts
- Route guards and authentication
- Code splitting per route

**Example Route Structure**:

```
src/routes/
├── __root.tsx                    // Root layout
├── index.tsx                     // Home (/)
├── auth/
│   ├── login.tsx                 // /auth/login
│   └── forgot-password.tsx       // /auth/forgot-password
├── data-upload.tsx               // /data-upload
├── data-validate.tsx             // /data-validate
├── master-data.tsx               // /master-data
├── user-management.tsx           // /user-management
├── randomization-results.tsx     // /randomization-results
└── settings.tsx                  // /settings
```

### State Management

| Library            | Version  | Purpose                  |
| ------------------ | -------- | ------------------------ |
| **Redux Toolkit**  | 2.9+     | Global application state |
| **TanStack Query** | 5.90+    | Server state management  |
| **React Context**  | Built-in | Theme, notifications     |

**State Strategy**:

1. **TanStack Query** (Server State)
   - API data fetching
   - Automatic caching
   - Background refetching
   - Mutations with optimistic updates

2. **Redux Toolkit** (Client State)
   - Global UI preferences (sidebar, theme, table page size)
   - Experiment creation metadata (active experiment, randomization status)
   - Note: Authentication is **not** managed in Redux — auth tokens are stored in `sessionStorage` and auth state is derived via TanStack Query hooks (`src/lib/auth.ts`)

3. **React Context** (Scoped State)
   - Theme provider
   - Notification system
   - Socket connections

4. **Local State** (Component State)
   - Form inputs
   - UI toggles
   - Component-specific data

**Example: TanStack Query**:

```typescript
export function useExperiments() {
  return useQuery({
    queryKey: ["experiments"],
    queryFn: apiClient.getExperiments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### UI & Styling

| Library                      | Version | Purpose                          |
| ---------------------------- | ------- | -------------------------------- |
| **Tailwind CSS**             | 4.1+    | Utility-first CSS framework      |
| **Radix UI**                 | Various | Headless accessible components   |
| **shadcn/ui**                | Latest  | Component library built on Radix |
| **Lucide React**             | 0.544+  | Icon library                     |
| **Tabler Icons**             | 3.35+   | Additional icons                 |
| **class-variance-authority** | 0.7+    | Component variants               |
| **tailwind-merge**           | 3.3+    | Merge Tailwind classes           |
| **clsx**                     | 2.1+    | Conditional className utility    |

**Design System**:

- **Tailwind CSS v4**: Latest version with improved performance
- **CSS Variables**: Design tokens for theming
- **Atomic Design**: Components organized by complexity
- **Responsive**: Mobile-first breakpoints

**Component Architecture**:

```
Atoms       → Button, Input, Label
Molecules   → SearchableSelect, FormField
Organisms   → DataTable, NavigationBar
Templates   → DashboardLayout
Pages       → ExperimentListPage
```

**Tailwind Configuration**:

```css
/* Uses @theme inline syntax (v4) */
@theme inline {
  --primary: #dd6000;
  --secondary: #0096db;
  --accent: #66bc29;
}
```

### Forms & Validation

| Library                 | Version | Purpose                   |
| ----------------------- | ------- | ------------------------- |
| **React Hook Form**     | 7.64+   | Form state management     |
| **Zod**                 | 4.1+    | Runtime schema validation |
| **@hookform/resolvers** | 5.2+    | Zod integration           |

**Why This Stack?**

- **Performance**: Minimal re-renders
- **Type Safety**: Full TypeScript integration
- **Developer Experience**: Simple API
- **Validation**: Schema-based with Zod

**Example Form**:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

## Core Libraries

### Data Fetching & Caching

**TanStack Query (React Query) 5.90+**

Features:

- Automatic caching and refetching
- Optimistic updates
- Background synchronization
- Pagination support
- Infinite queries

Configuration:

```typescript
// lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        // Never retry on 401 — user must re-authenticate
        if ((error as ApiError)?.status === 401) return false;
        // Retry up to configurable max (default 3, from VITE_QUERY_MAX_RETRIES)
        return failureCount < (Number(REACT_QUERY_CONFIG.GLOBAL_RETRY) || 3);
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff, cap 30 s
    },
  },
});
```

### HTTP Client

**Axios 1.13+**

Features:

- Request/response interceptors
- Automatic error handling
- Request/response transformation
- Timeout configuration
- Custom timeouts per request

Configuration:

```typescript
// lib/api.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Interceptors for auth tokens
apiClient.interceptors.request.use(addAuthToken);
apiClient.interceptors.response.use(handleResponse, handleError);
```

### Data Visualization

| Library                   | Version | Purpose              |
| ------------------------- | ------- | -------------------- |
| **recharts**              | 2.15+   | Chart library        |
| **@tanstack/react-table** | 8.21+   | Powerful data tables |

**TanStack Table Features**:

- Column sorting
- Filtering and search
- Pagination
- Row selection
- Virtual scrolling support

### Drag & Drop

| Library                | Version | Purpose            |
| ---------------------- | ------- | ------------------ |
| **@dnd-kit/core**      | 6.3+    | Drag and drop core |
| **@dnd-kit/sortable**  | 10.0+   | Sortable lists     |
| **@dnd-kit/modifiers** | 9.0+    | DnD modifiers      |
| **@dnd-kit/utilities** | 3.2+    | DnD utilities      |

### Date Handling

**date-fns 4.1+**

Why date-fns over moment.js?

- Tree-shakeable (smaller bundle)
- Immutable
- TypeScript support
- Modern API

### Utilities

| Library              | Version | Purpose             |
| -------------------- | ------- | ------------------- |
| **lodash**           | 4.17+   | Utility functions   |
| **sonner**           | 2.0+    | Toast notifications |
| **socket.io-client** | 4.8+    | WebSocket client    |

## Development Tools

### Code Quality

| Tool                  | Version | Purpose                       |
| --------------------- | ------- | ----------------------------- |
| **ESLint**            | 9+      | JavaScript/TypeScript linting |
| **Prettier**          | 3.6+    | Code formatting               |
| **TypeScript ESLint** | 8.45+   | TypeScript-specific rules     |

**ESLint Plugins**:

- `eslint-plugin-react` - React-specific rules
- `eslint-plugin-react-hooks` - Hooks rules
- `eslint-plugin-jsx-a11y` - Accessibility rules
- `eslint-plugin-import` - Import/export rules
- `eslint-plugin-simple-import-sort` - Auto-sort imports
- `eslint-plugin-prettier` - Prettier integration

**Configuration**:

```typescript
// eslint.config.ts
export default [
  // TypeScript, React, a11y rules
  // Import sorting
  // Prettier integration
];
```

### Git Hooks

| Tool            | Version | Purpose                     |
| --------------- | ------- | --------------------------- |
| **Husky**       | 9.1+    | Git hooks management        |
| **lint-staged** | 16.2+   | Run linters on staged files |

**Pre-commit Hook**:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,css,scss,md}": ["prettier --write", "eslint --fix"]
  }
}
```

### Monitoring

**Sentry 10+**

Features:

- Error tracking
- Performance monitoring
- Release tracking
- User feedback
- Source maps support

Configuration:

```typescript
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});
```

## Architecture Patterns

### Component Architecture

**Atomic Design Methodology**

1. **Atoms**: Basic UI elements
   - Button, Input, Label, Badge
   - Can't be broken down further
   - Reusable across entire app

2. **Molecules**: Simple combinations
   - SearchableSelect, FormField, DataCard
   - Composed of multiple atoms
   - Single responsibility

3. **Organisms**: Complex sections
   - DataTable, NavigationBar, UserProfile
   - Composed of molecules and atoms
   - Specific functionality

4. **Templates**: Page layouts
   - DashboardLayout, AuthLayout
   - Define page structure
   - No business logic

5. **Pages**: Actual pages
   - ExperimentListPage, LoginPage
   - Connect to data layer
   - Business logic

### Folder Structure

```
src/
├── api/                          # API layer
│   ├── AuthApi.ts
│   ├── DataUploadApi.ts
│   ├── MasterDataApi.ts
│   └── index.ts
│
├── app/                          # Global app state
│   └── store/
│       ├── index.ts
│       └── slices/
│
├── components/                   # UI components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   ├── layouts/
│   └── [feature-folders]/
│
├── contexts/                     # React contexts
│   ├── NotificationContext.tsx
│   └── SocketProvider.tsx
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useMasterData.ts
│   └── index.ts
│
├── lib/                          # Core utilities
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth helpers
│   ├── constants.ts              # Constants
│   ├── utils.ts                  # Utilities
│   ├── permissions.ts            # RBAC permissions
│   └── sentry-logger.ts          # Sentry integration
│
├── pages/                        # Page components
│   ├── experiments/
│   ├── auth/
│   └── settings/
│
├── routes/                       # TanStack Router
│   ├── __root.tsx
│   ├── index.tsx
│   └── [route-files]/
│
├── schemas/                      # Zod schemas
│   ├── authSchema.ts
│   └── dataUploadSchema.ts
│
├── types/                        # TypeScript types
│   ├── auth.ts
│   ├── experiment.ts
│   └── index.ts
│
└── utils/                        # Utility functions
    └── formatting.ts
```

### Data Flow

```
User Interaction
    ↓
Component
    ↓
Custom Hook (useQuery/useMutation)
    ↓
API Client (Axios)
    ↓
Backend API
    ↓
Response
    ↓
TanStack Query Cache
    ↓
Component Re-render
```

## API Integration

### API Client Architecture

**Centralized in `lib/api.ts`**:

```typescript
// Base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Endpoints are prefixed with /api/${VITE_API_VERSION}/
export const API_CONFIG = {
  ENDPOINTS: {
    AUTH: {
      LOGIN: `/api/${import.meta.env.VITE_API_VERSION}/auth/login`,
      LOGOUT: `/api/${import.meta.env.VITE_API_VERSION}/auth/logout`,
    },
    USERS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/users/`,
      DETAIL: (userId: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/users/${userId}`,
    },
  },
};
```

**API Modules** (in `src/api/`):

- `AuthApi.ts` - Authentication endpoints
- `DataUploadApi.ts` - Data upload endpoints
- `MasterDataApi.ts` - Master data CRUD
- `NotificationApi.ts` - Notifications
- `UserManagementApi.ts` - User management

### Custom Hooks Pattern

```typescript
// hooks/useExperiments.ts
// generateQueryKey (from @/lib/utils) filters out null/undefined values
// for consistent, safe query key generation across the codebase
export function useExperiments(filters: Filters) {
  return useQuery({
    queryKey: generateQueryKey("experiments", filters),
    queryFn: () => experimentsApi.list(filters),
  });
}

export function useCreateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: experimentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiments"],
      });
      toast.success("Experiment created");
    },
  });
}
```

## Authentication & Authorization

### Authentication Flow

1. User submits credentials
2. API returns JWT access token
3. Token is persisted to `sessionStorage` via the auth helper (`src/lib/auth.ts`)
4. TanStack Query initializes/caches auth-related state (current user, permissions)
5. Axios interceptor reads the token from `sessionStorage` and attaches it to all outgoing API requests
6. On successful authentication, the user is redirected to the dashboard

### Authorization (RBAC)

**Permission System**:

```typescript
// lib/permissions.ts
export const PERMISSIONS = {
  DATA_UPLOAD: {
    PRECLINICAL: {
      EFFICACY: "data_upload__preclinical__efficacy:upload",
      BIO_DISTRIBUTION: "data_upload__preclinical__biod:weight_sheet_upload",
    },
  },
  USER_MANAGEMENT: {
    VIEW: "user_management:view_user",
    CREATE: "user_management:create_user",
    UPDATE: "user_management:update_user",
    DELETE: "user_management:delete_user",
  },
};
```

**Permission Checking**:

```typescript
const { hasPermission } = usePermissions();

if (hasPermission(PERMISSIONS.USER_MANAGEMENT.CREATE)) {
  // Show create button
}
```

## Error Handling & Monitoring

### Error Boundaries

React Error Boundaries catch component errors:

```typescript
// app/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    logError(error, { context: errorInfo });
  }
}
```

### API Error Handling

Axios interceptors handle API errors:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Sentry Integration

**Custom Logger**:

```typescript
// lib/sentry-logger.ts
export function logError(error: Error | string, options?: { tags?; context? }) {
  // Log to console in dev
  // Send to Sentry in production
}
```

## Build

### Build Process

```bash
# Type check
tsc -b

# Vite build
vite build
```

**Output**:

- Optimized JavaScript bundles
- Code splitting per route
- Minified CSS
- Asset optimization
- Source maps

## Performance Optimizations

### Code Splitting

- Route-based splitting (automatic with TanStack Router)
- Dynamic imports for heavy components
- Lazy loading for non-critical features

### Caching Strategy

**TanStack Query**:

- `staleTime`: How long data is fresh
- `gcTime`: How long to keep in cache
- Background refetching

### Bundle Optimization

- Tree shaking (automatic with Vite)
- Minimal bundle size
- Gzip compression
- Asset optimization

## Security

### Implemented Measures

1. **XSS Protection**:
   - React escapes by default
   - Sanitize user input
   - CSP headers

2. **CSRF Protection**:
   - Token-based auth

3. **Data Sanitization**:
   - Sanitize before sending to Sentry
   - Sanitize form inputs

4. **Environment Variables**:
   - Never commit secrets
   - Use `.env` files
   - Prefix with `VITE_` for client exposure

5. **Dependencies**:
   - Regular updates
   - Security audits
   - Override vulnerable packages

---

**Last Updated**: February 2026
