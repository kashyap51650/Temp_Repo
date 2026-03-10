# Project Instructions

## 1. Project Overview

**Orano Med** is a production-ready web application for managing pharmaceutical research data, specifically focused on preclinical and hotlab experiment management.

### What It Does

- Experiment data management (efficacy studies, bio-distribution)
- Master data CRUD operations (drugs, mice, organs, etc.)
- Data upload and validation workflows
- Randomization result analysis
- User management with RBAC (Role-Based Access Control)
- Real-time notifications system
- Experiment data approval/rejection workflows

### Target Users

- Lab technicians
- Research scientists
- Data managers
- QA engineers
- System administrators

### High-Level Architecture

- **Frontend**: React 19 + TypeScript SPA with file-based routing
- **State Management**: Redux Toolkit + TanStack Query (React Query)
- **Backend Integration**: RESTful API via Axios with centralized error handling
- **Build System**: Vite with HMR for fast development

---

## 2. Tech Stack

### Frontend Core

- **React** 19.1.1 (latest stable)
- **TypeScript** 5.9.3
- **Vite** 7.1.11 (build tool)

### Routing & Navigation

- **TanStack Router** 1.132+ (file-based routing with type-safety)
- Auto-generated route tree (`routeTree.gen.ts`)

### State Management

- **Redux Toolkit** 2.9+ (global state - user, experiment)
- **TanStack Query** 5.90+ (server state, caching, mutations)
- **React Context** (notifications, theme)

### UI & Styling

- **Tailwind CSS** 4.1+ (utility-first styling with `@theme inline` syntax)
- **Radix UI** (headless accessible component primitives)
- **shadcn/ui** architecture (component library with design system integration)
- **Lucide React** + **Tabler Icons** (iconography)
- **next-themes** (dark/light mode with system preference detection)
- **class-variance-authority** (CVA for component variants)
- **Figma MCP** (design token extraction and synchronization)

### Forms & Validation

- **React Hook Form** 7.64+ (form state management)
- **Zod** 4.1+ (runtime schema validation)

### Data Handling

- **Axios** 1.13+ (HTTP client with interceptors)
- **date-fns** 4.1+ (date manipulation)
- **lodash** 4.17+ (utility functions)

### UI Components & Interactions

- **@tanstack/react-table** 8.21+ (data tables)
- **recharts** 2.15+ (data visualization)
- **@dnd-kit** 6.3+ (drag-and-drop)
- **sonner** 2.0+ (toast notifications)

### Dev Tools

- **ESLint** 9+ with TypeScript, React, a11y, import sorting
- **Prettier** 3.6+ (code formatting)
- **Husky** 9.1+ (Git hooks)
- **lint-staged** (pre-commit linting)

### Monitoring

- **Sentry** 10+ (error tracking)

---

## 3. Prerequisites

### Required Software

- **Node.js**: >= 20.19.0 or 22.x (LTS recommended)
- **npm**: >= 10.0.0 (included with Node.js)
- **Git**: Latest stable

### OS Requirements

- Linux, macOS, or WSL2 on Windows
- Minimum 8GB RAM, 4GB free disk space

### Environment Variables

Create a `.env` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_API_VERSION=v1

# React Query Configuration (optional)
VITE_REACT_QUERY_RETRY=3
VITE_REACT_QUERY_RETRY_DELAY=1000
VITE_REACT_QUERY_MAX_RETRY_DELAY=30000

# Sentry (optional, production only)
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=development
```

### Access Requirements

- **API Access**: Valid backend API URL and credentials
- **Permissions**: Project access granted by team lead
- **VPN**: May be required for production API access

---

## 4. Project Setup

### Clone Repository

```bash
git clone <repository-url>
cd orano_med_frontend_reactjs
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit with your credentials
nano .env
```

### Start Development Server

```bash
npm run dev
```

App will open at `http://localhost:5173`

### Verify Setup

- DevTools should show TanStack Query and Router devtools in bottom-right
- No console errors related to missing env variables
- Authentication page loads correctly

### Common Setup Pitfalls

**Problem**: `Cannot find module '@/components/...'`  
**Solution**: Restart VS Code or TypeScript server. The `@` alias is configured in `vite.config.ts`.

**Problem**: Route not found / 404 errors  
**Solution**: Routes are auto-generated. Run `npm run dev` to regenerate `routeTree.gen.ts`.

**Problem**: Husky hooks not running  
**Solution**: Run `npm run prepare` to initialize Git hooks.

**Problem**: Type errors in IDE but builds successfully  
**Solution**: Run `npm run type-check` to verify. Restart TypeScript server if needed.

---

## 5. Folder Structure

### Key Directories

#### `src/`

Main application source code. All development happens here.

#### `src/components/`

UI component library organized by Atomic Design:

- **`atoms/`**: Basic building blocks (Button, Input, Label, etc.)
- **`molecules/`**: Simple combinations (SearchableSelect, FormField)
- **`organisms/`**: Complex UI sections (DataTable, NavigationBar)
- **`templates/`**: Page layouts
- **`layouts/`**: Layout wrappers (AuthLayout, DashboardLayout)
- **Feature folders**: `user-management/`, `data-upload/`, etc.

**Rule**: Always check `components/index.ts` for available exports before creating duplicates.

#### `src/hooks/`

Custom React hooks following the `use*` naming convention:

- **Data fetching**: `useMasterData`, `useExperimentData`, `useProjects`
- **Mutations**: `useCreateExperiment`, `useUpdateUser`, `useBulkUpdate*`
- **UI state**: `useToggle`, `useModal`, `useDebounce`, `useMobile`
- **Auth**: `useAuthState`, `useProfile`

**Rule**: All API interactions must go through custom hooks, not directly in components.

#### `src/pages/` & `src/routes/`

- **`pages/`**: Page components (the actual UI)
- **`routes/`**: TanStack Router route definitions (connects URLs to pages)

**Route files** export a `Route` object using `createFileRoute()`.  
**Page files** export React components.

#### `src/lib/`

Core utilities and configurations:

- **`api.ts`**: API client, endpoints, and typed API functions
- **`auth.ts`**: Authentication helpers and TanStack Query hooks
- **`constants.ts`**: App-wide constants (file limits, study types, config)
- **`utils.ts`**: Helper functions (cn, formatters, validators)
- **`queryClient.ts`**: TanStack Query configuration

#### `src/types/`

TypeScript type definitions for API responses, forms, domain models.

#### `src/app/store/`

Redux Toolkit store and slices:

- **`slices/userSlice.ts`**: User authentication state
- **`slices/experimentSlice.ts`**: Experiment-related state

**Rule**: Use Redux only for true global state. Prefer TanStack Query for server state.

#### `src/contexts/`

React Context providers (NotificationContext, theme).

---

## 6. Development Guidelines

### Naming Conventions

**Files**:

- Components: `PascalCase.tsx` (e.g., `DeleteConfirmModal.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `useMasterData.ts`)
- Utils: `kebab-case.ts` (e.g., `password-utils.ts`)
- Types: `camelCase.ts` or `kebab-case.ts` (e.g., `auth.ts`)

**Variables & Functions**:

- Variables: `camelCase` (e.g., `experimentId`, `isLoading`)
- Components: `PascalCase` (e.g., `DataTable`, `UserCard`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_CONFIG`, `FILE_SIZE_LIMITS`)
- Boolean variables: Prefix with `is`, `has`, `should` (e.g., `isActive`, `hasPermission`)

**Types & Interfaces**:

- Interfaces: `PascalCase` (e.g., `User`, `ExperimentData`)
- Type aliases: `PascalCase` (e.g., `StudyType`)
- Avoid `I` prefix for interfaces

### Component Patterns

**✅ Functional components with TypeScript**:

```typescript
interface Props {
  userId: number;
  onUpdate?: (user: User) => void;
}

export function UserCard({ userId, onUpdate }: Props) {
  // ...
}
```

**✅ Co-locate types**:

```typescript
// Define types above the component they're used in
interface UserCardProps {
  /* ... */
}
interface UserCardState {
  /* ... */
}

export function UserCard(props: UserCardProps) {
  /* ... */
}
```

**✅ Destructure props early**:

```typescript
// Good
function Button({ label, onClick, variant = "primary" }: ButtonProps) { /* ... */ }

// Avoid
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

**✅ Use composition over inheritance**:

```typescript
// Good
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid: Monolithic components with many props
```

**❌ Avoid**:

- Class components
- `React.FC` type (prefer explicit function declarations)
- Default exports for components (use named exports)

### Hooks Rules

**✅ Follow React rules of hooks**:

- Only call at top level
- Only call from React functions
- Prefix custom hooks with `use`

**✅ Custom hook pattern**:

```typescript
export function useExperimentData(experimentId: number) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["experiments", experimentId],
    queryFn: () => apiClient.getExperiment(experimentId),
    enabled: !!experimentId,
  });

  const updateMutation = useMutation({
    mutationFn: apiClient.updateExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
  });

  return {
    experiment: data,
    isLoading,
    error,
    updateExperiment: updateMutation.mutateAsync,
  };
}
```

**✅ Destructure hook returns consistently**:

```typescript
// Good: Clear, predictable names
const { data, isLoading, error } = useQuery(/* ... */);
const { mutate: updateUser } = useMutation(/* ... */);
```

**❌ Avoid**:

- Conditional hook calls
- Hooks in loops or callbacks
- Overly complex hooks (split into smaller hooks)

### State Management Rules

**Use TanStack Query for**:

- API data fetching
- Server state caching
- Mutations with automatic refetch
- Background data synchronization

**Use Redux Toolkit for**:

- User authentication state
- Cross-cutting global UI state
- State that persists across route changes

**Use Local State (`useState`) for**:

- UI toggles (modals, dropdowns)
- Component-specific state

**Use Context for**:

- Theme preferences
- Notifications
- Deeply nested prop drilling scenarios

**❌ Never**:

- Mix query and mutation logic in components
- Duplicate server state in Redux
- Use Redux for derived state

### Error Handling

**API Errors**:

```typescript
const { data, error } = useQuery({
  queryKey: ["users"],
  queryFn: apiClient.getUsers,
});

// Error is typed as ApiError (defined in lib/api.ts)
if (error) {
  return <ErrorMessage message={error.message} />;
}
```

**Mutations**:

```typescript
const mutation = useMutation({
  mutationFn: apiClient.createUser,
  onError: (error: ApiError) => {
    toast.error(error.message || "Failed to create user");
  },
  onSuccess: () => {
    toast.success("User created successfully");
  },
});
```

**Global Error Boundary**:

- Wrapped at root level in `App.tsx`
- Catches unhandled React errors
- Displays fallback UI with error details

**❌ Avoid**:

- Silent failures (always show user feedback)
- Generic error messages ("Something went wrong")
- Swallowing errors without logging

### Logging and Debugging

**Development**:

- TanStack Query DevTools (enabled in dev)
- TanStack Router DevTools (enabled in dev)
- Redux DevTools (browser extension required)

**Production**:

- Sentry for error tracking
- Avoid `console.log` (use `console.warn` or `console.error` sparingly)

**Debugging API Calls**:

```typescript
// Axios interceptors are configured in lib/api.ts
// Check Network tab in DevTools for full request/response details
```

---

## 7. API Integration Rules

### Where API Calls Live

**✅ Centralized in `lib/api.ts`**:

```typescript
export const masterDataApi = {
  getItems: async (slug: string, filters: MasterDataFilters) => {
    return apiClient.get(API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug), {
      params: filters,
    });
  },
  // ...
};
```

**✅ Wrapped in custom hooks**:

```typescript
// hooks/useMasterData.ts
export function useMasterData(slug: string) {
  return useQuery({
    queryKey: ["masterData", slug],
    queryFn: () => masterDataApi.getItems(slug, filters),
  });
}
```

**❌ Never**:

- Call `axios` or `fetch` directly in components
- Hardcode API URLs
- Duplicate API logic

### Loading & Error States

**✅ Standard pattern**:

```typescript
function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState />;

  return <Table data={data} />;
}
```

**✅ Optimistic updates**:

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ["users"] });
    const previous = queryClient.getQueryData(["users"]);

    queryClient.setQueryData(["users"], (old) => {
      // Optimistically update cache
      return old.map((u) => (u.id === newUser.id ? newUser : u));
    });

    return { previous };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(["users"], context?.previous);
  },
});
```

### Query Invalidation Rules

**✅ Invalidate related queries after mutations**:

```typescript
onSuccess: () => {
  // Invalidate all experiment queries
  queryClient.invalidateQueries({ queryKey: ["experiments"] });

  // Invalidate specific experiment
  queryClient.invalidateQueries({ queryKey: ["experiments", id] });
};
```

**✅ Invalidation hierarchy**:

```typescript
// After creating/updating/deleting:
// 1. Invalidate list queries
queryClient.invalidateQueries({ queryKey: ["users"] });

// 2. Invalidate related detail queries
queryClient.invalidateQueries({ queryKey: ["users", userId] });

// 3. Invalidate dependent data
queryClient.invalidateQueries({ queryKey: ["user-roles", userId] });
```

**❌ Avoid**:

- Over-invalidation (invalidates too many queries unnecessarily)
- Forgetting to invalidate after mutations (stale data)

### Caching Strategy

**Default Configuration** (see `lib/queryClient.ts`):

- **`staleTime`**: 0 (data immediately considered stale)
- **`gcTime`**: 10 minutes (cache persists for 10 min after unused)
- **`refetchOnWindowFocus`**: true (refetch when user returns to tab)
- **`refetchOnMount`**: "always"

**Custom Cache Times**:

```typescript
// For stable data (e.g., master data dropdowns)
useQuery({
  queryKey: ["drugs"],
  queryFn: getDrugs,
  staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG, // 5 minutes
});

// For frequently changing data (e.g., notifications)
useQuery({
  queryKey: ["notifications"],
  queryFn: getNotifications,
  staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT, // 2 minutes
  refetchInterval: 30000, // Poll every 30 seconds
});
```

---

## 8. UI & Styling Rules

### Core UI Development Principles

#### Accessibility (WCAG 2.1 Compliance)

**✅ Required practices**:

- **Heading hierarchy**: Maintain logical order (h1 → h2 → h3, never skip levels)
- **Descriptive alt text**: `<img alt="User profile photo showing John Doe" />`
- **ARIA attributes**: Use `aria-label`, `aria-describedby`, `role` where semantic HTML isn't sufficient
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible with visible focus states
- **Color contrast**: Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)

```typescript
// Good: Accessible button
<Button
  aria-label="Delete experiment record"
  aria-describedby="delete-warning"
  className="focus-visible:ring-2 focus-visible:ring-primary"
>
  <Trash2 />
</Button>
<span id="delete-warning" className="sr-only">
  This action cannot be undone
</span>
```

#### Responsive Design Strategy

**✅ Mobile-first approach with Tailwind breakpoints**:

```typescript
// Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Scales from 1 column on mobile to 4 on extra-large screens */}
</div>

<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Typography
</h1>
```

**✅ Prefer Flexbox and Grid for layouts**:

```typescript
// Flexbox for one-dimensional layouts
<div className="flex flex-col md:flex-row items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Grid for two-dimensional layouts
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Design System Architecture

#### Color Token System (Figma → Tailwind → shadcn/ui)

**Architecture flow**:

```
Figma Design Variables → CSS Custom Properties → shadcn/ui Semantic Colors → Tailwind Classes
```

**✅ Always use semantic color classes** (defined in `src/index.css`):

```typescript
// Good: Semantic colors
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</Button>
<div className="bg-secondary text-secondary-foreground">
  Secondary content
</div>
<span className="text-muted-foreground">Helper text</span>

// Avoid: Direct hex values or arbitrary colors
<Button className="bg-[#DD6000]">Bad Practice</Button>
```

**Project color palette** (from Figma):

- **Primary**: Clementine (`#DD6000`) - Main brand color for CTAs and primary actions
- **Secondary**: Lochmara (`#0096DB`) - Secondary actions and information
- **Accent**: Vida Loca (`#66BC29`) - Success states and highlights
- **Destructive**: Red variants - Error states and destructive actions
- **Muted**: Gray variants - Backgrounds and disabled states

**✅ Color definition in `src/index.css`**:

```css
@theme inline {
  :root {
    --primary: #dd6000;
    --primary-foreground: #ffffff;
    --secondary: #0096db;
    --secondary-foreground: #ffffff;
    --accent: #66bc29;
    --accent-foreground: #ffffff;
    /* ... more semantic tokens */
  }

  .dark {
    --primary: #ff7a1a;
    --primary-foreground: #000000;
    /* ... dark mode variants */
  }
}
```

**❌ Never hardcode colors**:

- Use semantic classes: `bg-primary`, `text-secondary`, `border-accent`
- For opacity: Use Tailwind's `/` syntax: `bg-primary/10`, `text-muted/50`
- Dark mode automatically adapts via CSS variables (no manual `dark:` classes needed for semantic colors)

#### Figma Integration Workflow

**✅ Extract design tokens from Figma MCP server**:

1. **Fetch Figma variables** (when design updates):

   ```typescript
   // Use MCP tool: mcp_figma-mcp-ser_get_variable_defs
   // Extracts color, spacing, typography tokens from Figma file
   ```

2. **Map to CSS variables** in `src/index.css`:

   ```css
   @theme inline {
     :root {
       /* Map Figma color tokens to semantic names */
       --primary: /* Figma primary color */;
       --radius: /* Figma border radius */;
       /* ... */
     }
   }
   ```

3. **Use in components via Tailwind**:
   ```typescript
   <div className="bg-primary rounded-[var(--radius)]">
     Token-driven design
   </div>
   ```

**Figma MCP Configuration** (`.vscode/mcp.json`):

```json
{
  "figma-mcp-server": {
    "endpoint": "http://localhost:3845/mcp",
    "fileKey": "your-figma-file-key"
  }
}
```

### Design System Usage

**✅ Use shadcn/ui components**:

```typescript
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Dialog } from "@/components/atoms/Dialog";

<Button variant="primary" size="md">Save</Button>
<Input placeholder="Enter name" />
```

**✅ Component anatomy**:

```typescript
// atoms/Button/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

**❌ Avoid**:

- Inline styles (use Tailwind classes)
- Custom CSS files (except `index.css` for global styles)
- Hardcoded colors (use Tailwind theme colors)

### Styling Best Practices

#### Tailwind-First Approach

**✅ Use Tailwind utility classes exclusively**:

```typescript
// Good: Tailwind utilities
<div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold">Title</h2>
  <Button size="sm">Action</Button>
</div>

// Avoid: Inline styles
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#fff' }}>
  Bad practice
</div>
```

**✅ Component-specific styling with `cn()` utility**:

```typescript
import { cn } from "@/lib/utils";

interface CardProps {
  variant?: "default" | "bordered" | "elevated";
  className?: string;
}

export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4",
        {
          "bg-card": variant === "default",
          "border-2 border-border": variant === "bordered",
          "shadow-lg": variant === "elevated",
        },
        className
      )}
      {...props}
    />
  );
}
```

**✅ When custom CSS is absolutely necessary**:

Only add to `src/index.css` for:

- Global resets or base styles
- Complex animations not achievable with Tailwind
- Third-party library overrides

```css
/* src/index.css */
@layer base {
  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

#### Design Token Mapping

**✅ Map all design properties to CSS variables**:

```typescript
// Spacing tokens
<div className="p-[var(--spacing-md)] gap-[var(--spacing-sm)]">
  {/* Uses design system spacing */}
</div>

// Typography tokens
<h1 className="text-[length:var(--font-size-2xl)] leading-[var(--line-height-tight)]">
  Token-based typography
</h1>

// Border radius tokens
<Card className="rounded-[var(--radius)] border-[length:var(--border-width)]">
  Consistent radius
</Card>
```

**⚠️ Priority**: Always pull tokens from Figma MCP when available, never hardcode design values.

#### Component Structure Rules

**✅ Place UI components in `/components/ui`**:

```bash
src/components/ui/
  ├── button.tsx          # shadcn/ui generated
  ├── input.tsx
  ├── dialog.tsx
  └── custom-card.tsx     # Custom additions following same pattern
```

**✅ Component file template**:

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define variants using CVA
const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Export props interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

// Component with forwardRef for ref support
export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

#### Code Readability Standards

**✅ Consistent formatting**:

- **Indentation**: 2 spaces (configured in Prettier)
- **Line length**: Max 100 characters for readability
- **Import order**: React → Third-party → Local (enforced by ESLint)

```typescript
// Good: Well-structured imports
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { cn } from "@/lib/utils";
```

**✅ Comment non-obvious logic**:

```typescript
// Calculate weighted average for randomization
// Formula: sum(weight * value) / sum(weights)
const weightedAverage =
  groups.reduce((acc, group) => {
    return acc + group.weight * group.avgWeight;
  }, 0) / totalWeight;
```

#### Performance Optimizations

**✅ Minimize DOM nesting**:

```typescript
// Good: Flat structure
<div className="flex items-center gap-2">
  <Icon />
  <span>Text</span>
</div>

// Avoid: Unnecessary wrappers
<div>
  <div>
    <div className="flex">
      <div><Icon /></div>
      <div><span>Text</span></div>
    </div>
  </div>
</div>
```

**✅ Lazy load images**:

```typescript
<img
  src="/large-image.jpg"
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

**✅ External links security**:

```typescript
<a
  href="https://external-site.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary hover:underline"
>
  External Link
</a>
```

### Theme System Implementation

**✅ Dark/Light mode managed by `ThemeProvider`**:

```typescript
// src/components/theme-provider.tsx
import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**✅ Theme-aware components automatically adapt**:

```typescript
// No manual dark: classes needed for semantic colors
<Card className="bg-card text-card-foreground">
  {/* Automatically switches between light/dark via CSS variables */}
</Card>

// Use dark: prefix only for non-semantic custom styles
<div className="bg-gray-100 dark:bg-gray-800">
  Custom styling with manual dark mode
</div>
```

### Component Documentation Standards

**✅ Document each component**:

````typescript
/**
 * SearchableSelect Component
 *
 * A dropdown select with built-in search functionality and multi-select support.
 *
 * @example
 * ```tsx
 * <SearchableSelect
 *   options={[{ id: '1', label: 'Option 1', value: 'opt1' }]}
 *   value="opt1"
 *   onValueChange={(val) => console.log(val)}
 *   placeholder="Select an option"
 * />
 * ```
 *
 * @param options - Array of selectable options with id, label, and value
 * @param value - Currently selected value(s)
 * @param onValueChange - Callback when selection changes
 * @param multiple - Enable multi-select mode
 * @param showSearch - Force show/hide search input (auto-detects if >5 options)
 */
export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
  showSearch?: boolean;
  // ...
}
````

### Project Configuration Files

**Key configuration for UI system**:

1. **`components.json`** - shadcn/ui configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

2. **`src/index.css`** - Tailwind v4 theme with Figma mappings:

```css
@import "tailwindcss";

@theme inline {
  /* Design tokens from Figma */
  :root {
    --primary: #dd6000;
    --secondary: #0096db;
    --accent: #66bc29;
    /* ... semantic color system */
  }
}
```

3. **`vite.config.ts`** - Path aliases and Tailwind integration:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Adding shadcn/ui Components

**✅ Install components via CLI**:

```bash
# Single component
npx shadcn@latest add button

# Multiple components
npx shadcn@latest add card dialog dropdown-menu

# All components
npx shadcn@latest add --all
```

**✅ Components auto-install with**:

- Proper TypeScript types
- Tailwind class integration
- Radix UI accessibility
- CSS variable theming

**⚠️ Do not manually edit shadcn/ui components** in `/components/ui` unless extending functionality. Create wrapper components instead.

### Component Reuse Guidelines

**✅ Check existing components before creating new ones**:

```bash
# List available UI components
ls src/components/ui/
ls src/components/atoms/

# Check component exports
cat src/components/index.ts
```

**✅ Extend existing components for complex needs**:

```typescript
// Build molecules from atoms
import { Select } from "@/components/atoms/Select";
import { Input } from "@/components/atoms/Input";

export function SearchableSelect({ options, ...props }) {
  const [search, setSearch] = useState("");
  const filtered = options.filter(/* ... */);

  return (
    <Select>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      <SelectContent>{/* filtered options */}</SelectContent>
    </Select>
  );
}
```

**✅ Use Radix UI primitives for built-in accessibility**:

```typescript
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// Radix automatically handles:
// - Focus trap and restoration
// - ESC key to close
// - Screen reader announcements
// - Portal rendering
<Dialog>
  <DialogTrigger>Open Modal</DialogTrigger>
  <DialogContent>
    <h2>Modal Title</h2>
    <p>Content with full accessibility</p>
  </DialogContent>
</Dialog>
```

**❌ Avoid**:

- Duplicating existing components (search first!)
- Over-customizing atoms with excessive props (create a molecule instead)
- Building custom interactive elements from scratch (use Radix UI primitives)
- `<div onClick>` for clickable elements (use `<button>`)
- Missing `alt` text on images
- Color-only indicators without text/icon alternatives

### Responsive Utilities

**✅ Use `useMobile()` hook for conditional rendering**:

```typescript
import { useMobile } from "@/hooks/useMobile";

export function DataView() {
  const isMobile = useMobile();

  return isMobile ? <MobileCardView /> : <DesktopTableView />;
}
```

**❌ Responsive design pitfalls**:

- Fixed pixel widths (`width: 300px` → use `max-w-md` or `w-[300px]`)
- Horizontal scrolling on mobile (test at 375px width)
- Text smaller than 14px on mobile devices
- Breakpoint-specific logic in multiple places (centralize with hooks)

---

## 9. Performance & Safety Rules

### Avoiding Infinite Re-Renders

**❌ setState in render body**:

```typescript
// BAD: Causes infinite loop
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // ❌ Called on every render
  return <div>{count}</div>;
}
```

**✅ setState in event handlers or effects**:

```typescript
function Component() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Click</button>;
}
```

**❌ Object/array literals in useEffect deps**:

```typescript
// BAD: New object reference on every render
useEffect(() => {
  fetchData(filters);
}, [{ page: 1, size: 10 }]); // ❌ Always triggers effect
```

**✅ Stable references**:

```typescript
const filters = useMemo(() => ({ page: 1, size: 10 }), []);
useEffect(() => {
  fetchData(filters);
}, [filters]); // ✅ Only triggers when filters change
```

### useEffect Dependency Rules

**✅ Include ALL dependencies**:

```typescript
useEffect(() => {
  if (userId) {
    fetchUser(userId);
  }
}, [userId]); // ✅ userId is used inside effect
```

**❌ Empty deps array with external values**:

```typescript
// BAD: Stale closure
useEffect(() => {
  fetchUser(userId); // ❌ userId not in deps
}, []); // Always uses initial userId value
```

**✅ ESLint will warn you** - do not disable the warning unless absolutely necessary.

**✅ Cleanup functions**:

```typescript
useEffect(() => {
  const controller = new AbortController();

  fetchData(controller.signal);

  return () => controller.abort(); // ✅ Cancel on unmount
}, []);
```

### Memoization Rules

**✅ Use `useMemo` for expensive computations**:

```typescript
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

**✅ Use `useCallback` for functions passed to child components**:

```typescript
const handleUpdate = useCallback((id: number) => {
  updateUser(id);
}, [updateUser]);

return <UserCard onUpdate={handleUpdate} />; // Prevents re-render
```

**❌ Don't over-optimize**:

```typescript
// BAD: Premature optimization
const sum = useMemo(() => a + b, [a, b]); // ❌ Simple math doesn't need memo
```

**Rule of thumb**: Only memoize if:

1. Computation is expensive (loops, sorting, filtering large arrays)
2. Function is passed to optimized child component (wrapped in `React.memo`)
3. Profiler shows performance issue

### Large List / Table Optimizations

**✅ Use TanStack Table pagination**:

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 20 } },
});
```

**✅ Server-side pagination** (preferred):

```typescript
const { data } = useQuery({
  queryKey: ["users", page, pageSize],
  queryFn: () => apiClient.getUsers({ page, size: pageSize }),
});
```

**✅ Virtualization for very long lists** (>1000 items):

```typescript
// Use @tanstack/react-virtual (not yet in codebase - add if needed)
```

**❌ Avoid**:

- Rendering all items at once (>100 items)
- Complex calculations in render functions

---

## 10. Testing Guidelines

### Unit Testing Expectations

**Currently**: No testing framework configured in this project.

**If tests are added** (recommended: Vitest + React Testing Library):

**What MUST be tested**:

- Utility functions (`lib/utils.ts`, `lib/password-utils.ts`)
- Form validation logic (Zod schemas)
- Custom hooks with complex logic
- Redux reducers and actions
- API client functions (mocked)

**What SHOULD be tested**:

- Critical user flows (login, data submission)
- Components with complex conditional rendering
- Error boundary fallback UI

**What should NOT be tested**:

- Radix UI component internals (already tested by Radix)
- TanStack Query hooks (already tested by TanStack)
- Simple presentational components with no logic

### Example Test Structure (Future)

```typescript
// utils.test.ts
import { describe, it, expect } from "vitest";
import { cn, formatDate } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("text-red", "bg-blue")).toBe("text-red bg-blue");
  });
});
```

---

## 11. Git & Code Review Rules

### Branch Naming

**Format**: `<type>/<short-description>`

**Types**:

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `chore/` - Dependencies, configs, tooling
- `docs/` - Documentation only

**Examples**:

- `feature/add-user-export`
- `fix/experiment-validation-bug`
- `refactor/api-client-structure`
- `chore/upgrade-react-19`

### Commit Message Format

**Format**: `<type>: <short summary>`

**Types**: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

**Examples**:

```
feat: add bulk update for body weights
fix: prevent infinite loop in useExperimentData
refactor: extract validation logic to separate hook
chore: upgrade TanStack Query to v5.90
docs: update API integration instructions
```

**Rules**:

- Present tense ("add" not "added")
- No period at the end
- Max 72 characters
- Descriptive enough to understand change without reading code

### PR Checklist

**Before submitting**:

- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No console.log statements
- [ ] Environment variables documented if added
- [ ] Route tree regenerated if routes changed
- [ ] Manual testing completed
- [ ] PR description explains **why** change is needed
- [ ] Breaking changes documented

**PR Description Template**:

```markdown
## What

Brief description of what changed

## Why

Why this change is necessary

## How to test

1. Navigate to X page
2. Click Y button
3. Verify Z happens

## Screenshots (if UI change)

[Attach before/after screenshots]
```

### Common Reasons PRs Are Rejected

1. **Missing error handling** - API calls without try-catch or error states
2. **Hardcoded values** - URLs, IDs, strings that should be constants
3. **Duplicate logic** - Not reusing existing hooks/components
4. **Poor naming** - Unclear variable/function names
5. **Missing TypeScript types** - `any` types, untyped props
6. **Accessibility issues** - Missing ARIA labels, semantic HTML
7. **Performance issues** - Infinite loops, missing memoization in critical paths
8. **Inconsistent patterns** - Not following project conventions
9. **Incomplete features** - Half-implemented functionality
10. **Breaking changes without discussion** - Changing shared APIs without team agreement

---

## 12. Common Mistakes & Anti-Patterns

### ❌ setState Loops

**Bad**:

```typescript
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // ❌ Triggers re-render → effect runs again
  }, [count]); // Loop!
}
```

**Good**:

```typescript
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0); // ✅ Only runs once
  }, []); // No dependencies
}
```

### ❌ Overusing useEffect

**Bad**:

```typescript
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`); // ❌ Unnecessary effect
}, [firstName, lastName]);
```

**Good**:

```typescript
const fullName = `${firstName} ${lastName}`; // ✅ Derived state
```

**Rule**: If you can calculate something during render, don't use useEffect.

### ❌ Duplicated Logic

**Bad**:

```typescript
// In ComponentA.tsx
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => apiClient.get("/api/v1/users"),
});

// In ComponentB.tsx (duplicate!)
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => apiClient.get("/api/v1/users"),
});
```

**Good**:

```typescript
// hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get(API_CONFIG.ENDPOINTS.USERS.LIST),
  });
}

// Both components
const { data } = useUsers(); // ✅ Shared cache
```

### ❌ Hardcoded Values

**Bad**:

```typescript
if (user.role === "admin") {
  /* ... */
} // ❌ Magic string
const maxSize = 10485760; // ❌ Magic number
fetch("https://api.example.com/users"); // ❌ Hardcoded URL
```

**Good**:

```typescript
if (user.role === USER_ROLES.ADMIN) {
  /* ... */
} // ✅ Constant
const maxSize = FILE_SIZE_LIMITS.LARGE_FILE; // ✅ Named constant
fetch(API_CONFIG.ENDPOINTS.USERS.LIST); // ✅ Centralized config
```

### ❌ Not Using TypeScript Properly

**Bad**:

```typescript
function processData(data: any) {
  // ❌ any type
  return data.map((item) => item.name); // No type safety
}
```

**Good**:

```typescript
interface DataItem {
  id: number;
  name: string;
}

function processData(data: DataItem[]) {
  // ✅ Typed
  return data.map((item) => item.name); // Type-safe
}
```

### ❌ Ignoring Loading/Error States

**Bad**:

```typescript
function UserList() {
  const { data } = useUsers();
  return <div>{data.map(/* ... */)}</div>; // ❌ Crashes if data is undefined
}
```

**Good**:

```typescript
function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  if (!data) return null;

  return <div>{data.map(/* ... */)}</div>;
}
```

---

## 13. Deployment / Build Notes

### Build Command

```bash
# Production build
npm run build

# Output: dist/ folder
```

### Build Output

- Optimized JS bundles with code splitting
- Minified CSS
- Source maps (for debugging production issues)
- Static assets in `dist/assets/`

### Environment-Specific Behavior

**Development** (`npm run dev`):

- HMR enabled
- DevTools visible
- Verbose error messages
- Source maps enabled

**Production** (after `npm run build`):

- Code minified and obfuscated
- DevTools hidden
- Sentry error tracking active
- Environment variables baked into bundle

### Preview Production Build

```bash
npm run build
npm run preview
```

Opens production build at `http://localhost:4173`

### Docker Builds

**Development**:

```bash
docker build -f Dockerfile.dev -t orano-med:dev .
docker run -p 5173:5173 orano-med:dev
```

**Production**:

```bash
docker build -f Dockerfile.prod -t orano-med:prod .
docker run -p 80:80 orano-med:prod
```

### Known Issues

1. **Large bundle size** - Consider lazy loading routes if bundle exceeds 1MB
2. **Vite HMR issues in Docker** - May need to set `server.watch.usePolling: true` in `vite.config.ts`
3. **Environment variables not loading** - Must prefix with `VITE_` to be exposed to client
4. **Route 404 on refresh** - Configure server (nginx) to fallback to `index.html` for SPA routing

---

## 14. Support & Ownership

### Project Maintainers

- **Primary Owner**: [Team Lead Name / Team Name]
- **Tech Lead**: [Tech Lead Name]
- **Code Reviewers**: [List of reviewers]

### How to Raise Issues

**For Bugs**:

1. Check existing issues in project tracker (Jira/Github Issues)
2. Reproduce bug in development environment
3. Create ticket with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS details
   - Screenshots/console errors
   - Severity (Critical/High/Medium/Low)

**For Features**:

1. Discuss with product owner first
2. Create feature request with:
   - User story / use case
   - Acceptance criteria
   - Mock-ups (if applicable)
   - Dependencies

**For Questions**:

- Slack: `#orano-med-dev` channel
- Team meetings: Weekly sync on Wednesdays 2 PM
- Documentation: Check Confluence / internal wiki first

### Where Documentation Lives

- **API Docs**: [Link to API documentation]
- **Design System**: Storybook at [URL] (if available)
- **Architecture Docs**: Confluence at [URL]
- **User Guides**: [Link to user documentation]
- **This File**: `/INSTRUCTIONS.md` (keep updated!)

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Production build
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix ESLint issues
npm run format                 # Format with Prettier
npm run format:check           # Check formatting
npm run type-check             # TypeScript check (no emit)
npm run type-check:watch       # Watch mode

# UI Components
npx shadcn@latest add button    # Add single component
npx shadcn@latest add card dialog  # Add multiple
npm run organize-components    # Re-organize atomic structure
npm run setup-atomic           # Add + organize

# Git
npm run prepare                # Setup Husky hooks
```

---

**Last Updated**: January 2026  
**Document Version**: 1.0  
**Maintained By**: [Your Name/Team]

---

## Appendix: Useful Links

### Core Framework Documentation

- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Routing & State Management

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### UI & Styling

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Class Variance Authority](https://cva.style/docs)
- [Lucide Icons](https://lucide.dev/)

### Forms & Validation

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

### Accessibility

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
