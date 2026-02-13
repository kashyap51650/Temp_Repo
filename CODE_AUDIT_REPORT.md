# Orano Med Frontend - Comprehensive Code Audit Report

**Project**: Orano Med Frontend (React + TypeScript)  
**Audit Date**: February 5, 2026  
**Auditor**: Senior Software Engineer - Code Quality Assessment Team  
**Tech Stack**: React 19, TypeScript 5.9, Vite 7, TanStack Router, TanStack Query, Redux Toolkit, Tailwind CSS 4

---

## Executive Summary

### Overall Code Health Assessment: **B+ (Good with Critical Areas for Improvement)**

The Orano Med Frontend codebase demonstrates **solid architectural foundations** with modern React patterns, comprehensive TypeScript usage, and well-structured API integration. However, several **critical issues** threaten production readiness, security, and long-term maintainability.

**Key Strengths:**

- ✅ Modern tech stack (React 19, TypeScript 5.9, Vite 7)
- ✅ Centralized API client architecture with Axios interceptors
- ✅ Consistent use of TanStack Query for server state management
- ✅ Well-organized component structure following Atomic Design principles
- ✅ Comprehensive type safety with TypeScript
- ✅ Proper environment variable configuration

**Critical Risks Identified:**

- 🚨 **ZERO test coverage** - No unit, integration, or E2E tests
- 🚨 **Security vulnerabilities** - Token storage in sessionStorage, missing CSRF protection
- 🚨 **Console.log statements** in production code
- 🚨 **Missing API endpoint leading slash** causing potential routing failures
- ⚠️ **Data mutation without immutability** in randomization logic
- ⚠️ **Inconsistent error handling** patterns across hooks
- ⚠️ **No Storybook implementation** despite CDD principles in project instructions

---

## 1. Architecture & Structure Issues

### 🔴 **CRITICAL: Missing Leading Slash in API Endpoint**

**Issue:**  
In `src/lib/api.ts`, line 159, the `MOUSE_GROUPS_WITH_ORGAN_WEIGHTS` endpoint is missing a leading slash, which will cause incorrect URL construction.

**Location:**

```typescript
// src/lib/api.ts:159
MOUSE_GROUPS_WITH_ORGAN_WEIGHTS: (experimentId: number) =>
  `api/${import.meta.env.VITE_API_VERSION}/mouse-groups/experiment/${experimentId}/groups-with-organ-weights`,
  // ❌ Missing leading slash - should be `/api/`
```

**Impact:**

- **Severity**: CRITICAL
- **Risk**: API calls will fail with 404 errors in production
- **Business Impact**: Complete feature breakdown for organ weight functionality
- **User Impact**: Unable to view/edit organ weight data

**Solution:**

```typescript
MOUSE_GROUPS_WITH_ORGAN_WEIGHTS: (experimentId: number) =>
  `/api/${import.meta.env.VITE_API_VERSION}/mouse-groups/experiment/${experimentId}/groups-with-organ-weights`,
  // ✅ Added leading slash
```

**Steps:**

1. Update `src/lib/api.ts` line 159 to add leading slash
2. Search codebase for similar patterns: `grep -r 'api/\${' src/lib/api.ts`
3. Add ESLint rule to prevent template literals without leading slash in endpoint definitions
4. Add integration test to verify all endpoint URLs are properly formatted

**Benefits:**

- Prevents runtime failures in production
- Ensures consistent URL construction across all API endpoints
- Reduces debugging time for "mysterious" 404 errors

---

### 🟡 **HIGH: Direct State Mutation in Randomization Logic**

**Issue:**  
In `useRendomizationResult.ts`, the code directly mutates the `randomizationData` object instead of creating immutable updates.

**Location:**

```typescript
// src/hooks/useRendomizationResult.ts:67-73
const handleConfirmClick = () => {
  // iterate selected group drug
  for (const [key, value] of Object.entries(selectedGroupDrug)) {
    const group = randomizationData?.groups.find((g) => g.group_code === key);
    if (group) {
      group.experiment_drug_id = Number(value); // ❌ Direct mutation
    }
  }

  if (randomizationData) {
    mutate(randomizationData);
  }
};
```

**Impact:**

- **Severity**: HIGH
- **Risk**: State inconsistency, unpredictable React re-renders
- **Debugging Difficulty**: Makes state changes hard to track
- **Redux DevTools**: Mutations bypass time-travel debugging

**Solution:**

```typescript
const handleConfirmClick = () => {
  if (!randomizationData) return;

  // ✅ Create immutable copy with updated groups
  const updatedData = {
    ...randomizationData,
    groups: randomizationData.groups.map((group) => {
      const drugId = selectedGroupDrug[group.group_code];
      if (drugId) {
        return {
          ...group,
          experiment_drug_id: Number(drugId),
        };
      }
      return group;
    }),
  };

  mutate(updatedData);
};
```

**Steps:**

1. Replace direct mutation with immutable update pattern
2. Install `eslint-plugin-functional` to detect mutations
3. Add ESLint rule: `"functional/immutable-data": "error"`
4. Audit entire codebase for similar mutation patterns
5. Add TypeScript utility types like `Readonly<T>` for state objects

**Benefits:**

- Predictable state updates following React best practices
- Better debugging with Redux DevTools
- Prevents subtle bugs from untracked state changes
- Improves testability

---

### 🟡 **MEDIUM: Component Structure Violates Single Responsibility Principle**

**Issue:**  
`DataViewModal.tsx` contains 290+ lines with mixed concerns: modal state management, data fetching logic, conditional rendering, and multiple nested modals.

**Impact:**

- **Severity**: MEDIUM
- **Maintainability**: High complexity score (cyclomatic complexity ~15+)
- **Testing**: Difficult to unit test individual behaviors
- **Code Reuse**: Logic tightly coupled to this specific modal

**Solution:**
Refactor into smaller, focused components:

```typescript
// ✅ Separate concerns into multiple files

// DataViewModal.tsx - Main orchestrator (50 lines)
export function DataViewModal({ isOpen, onClose, experiment }: DataViewModalProps) {
  const dataItems = useDataItems(experiment);
  const modalHandlers = useDataViewModalHandlers(experiment, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DataViewList
        items={dataItems}
        onAction={modalHandlers.handleAction}
        isPending={experiment.status === 'pending'}
      />
      <DataViewModals
        {...modalHandlers.modalStates}
        {...modalHandlers.handlers}
      />
    </Dialog>
  );
}

// hooks/useDataViewModalHandlers.ts - Custom hook for logic (80 lines)
export function useDataViewModalHandlers(experiment: ValidationRow, onClose: () => void) {
  // All modal state and handlers extracted here
  // ...
}

// DataViewList.tsx - Presentational component (40 lines)
export function DataViewList({ items, onAction, isPending }: Props) {
  // Pure UI rendering
}

// DataViewModals.tsx - Modal containers (60 lines)
export function DataViewModals(props: ModalProps) {
  // Conditional modal rendering
}
```

**Steps:**

1. Extract modal state management into `useDataViewModalHandlers` hook
2. Create `DataViewList` presentational component
3. Create `DataViewModals` component for conditional modal rendering
4. Extract data transformation logic into `useDataItems` hook
5. Write unit tests for each extracted piece
6. Measure cyclomatic complexity reduction (target: <10 per function)

**Benefits:**

- Each component has single responsibility
- Easier to test individual parts
- Better code reusability
- Reduced cognitive load for developers
- Follows project's Atomic Design principles

---

## 2. Code Quality Issues

### 🔴 **CRITICAL: Console.log Statements in Production Code**

**Issue:**  
Found `console.log` statements in production code that leak sensitive data and degrade performance.

**Locations:**

```typescript
// src/components/data-validation/DataViewModal.tsx:131
console.log("Saved data:", data); // ❌ Logs potentially sensitive experiment data

// src/routes/templates.tsx:72
console.log("Sharing filter:", shareData); // ❌ Logs user filter preferences

// src/pages/rbac/roles.tsx:158
console.log("Permissions configuration cancelled"); // ❌ Debug statement
```

**Impact:**

- **Severity**: CRITICAL (Security Risk)
- **Data Exposure**: Sensitive experiment data, user preferences, RBAC information
- **Performance**: Console operations slow down production builds
- **Professionalism**: Debug statements visible in browser console

**Solution:**

1. Remove all `console.log` statements
2. Replace with proper logging strategy:

```typescript
// ✅ Create logging utility
// src/lib/logger.ts
const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug("[DEBUG]", ...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn("[WARN]", ...args); // Always log warnings
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
    // Send to Sentry in production
    if (!isDevelopment && window.Sentry) {
      Sentry.captureException(args[0]);
    }
  },
};

// Usage in components
logger.debug("Saved data:", data); // Only logs in development
```

**Steps:**

1. Search all `console.log` occurrences: `grep -r "console\.log" src/`
2. Create centralized logging utility
3. Replace all `console.log` with `logger.debug`
4. Add ESLint rule to prevent future `console.log`:
   ```javascript
   // eslint.config.ts
   rules: {
     'no-console': ['error', { allow: ['warn', 'error'] }]
   }
   ```
5. Configure Vite to strip console statements in production build:
   ```typescript
   // vite.config.ts
   build: {
     terserOptions: {
       compress: {
         drop_console: true,
         drop_debugger: true,
       },
     },
   }
   ```

**Benefits:**

- No sensitive data leakage in production
- Performance improvement (no console I/O overhead)
- Centralized logging for better debugging
- Integration with error monitoring (Sentry)
- Professional production builds

---

### 🟡 **HIGH: Inconsistent Error Handling Patterns**

**Issue:**  
Error handling varies significantly across custom hooks - some use `try-catch`, others rely on TanStack Query's `onError`, and some have no error handling at all.

**Examples:**

```typescript
// ❌ Pattern 1: No error handling
export function useSomeHook() {
  return useQuery({
    queryKey: ["data"],
    queryFn: apiClient.getData,
    // No error handling!
  });
}

// ❌ Pattern 2: Silent failures
onError: (error) => {
  console.error(error); // Just logs, doesn't notify user
};

// ✅ Pattern 3: Proper handling (but inconsistent)
onError: (error: ApiError) => {
  toast.error(error.message || "Failed to load data");
};
```

**Impact:**

- **Severity**: HIGH
- **User Experience**: Silent failures confuse users
- **Debugging**: Difficult to track down errors
- **Business Risk**: Data loss or corruption without user awareness

**Solution:**
Create standardized error handling wrapper:

```typescript
// ✅ src/lib/queryErrorHandler.ts
import { toast } from "sonner";
import type { ApiError } from "./api";

export interface ErrorHandlerOptions {
  title?: string;
  silent?: boolean;
  onError?: (error: ApiError) => void;
}

export function createQueryErrorHandler(options: ErrorHandlerOptions = {}) {
  return (error: ApiError) => {
    // Always log to console in development
    if (import.meta.env.DEV) {
      console.error("[Query Error]", error);
    }

    // Send to Sentry in production
    if (!import.meta.env.DEV && window.Sentry) {
      Sentry.captureException(error, {
        extra: { message: error.message, status: error.status },
      });
    }

    // Show toast notification unless silent
    if (!options.silent) {
      toast.error(options.title || "Error", {
        description: error.message || "An unexpected error occurred",
      });
    }

    // Call custom error handler if provided
    options.onError?.(error);
  };
}

// Usage in hooks
export function useExperimentData(id: number) {
  return useQuery({
    queryKey: ["experiments", id],
    queryFn: () => experimentApi.getExperiment(id),
    onError: createQueryErrorHandler({
      title: "Failed to load experiment",
      onError: (error) => {
        // Custom handling for 404
        if (error.status === 404) {
          navigate("/experiments");
        }
      },
    }),
  });
}
```

**Steps:**

1. Create `queryErrorHandler.ts` utility
2. Create `mutationErrorHandler.ts` for mutations
3. Audit all 60+ custom hooks for error handling
4. Refactor to use standardized handlers
5. Add integration with Sentry for production monitoring
6. Document error handling patterns in project guidelines

**Benefits:**

- Consistent user experience across all errors
- Centralized error logging and monitoring
- Easier debugging with structured error data
- Sentry integration for production tracking
- Reduced code duplication

---

### 🟡 **MEDIUM: TypeScript `any` Type Usage**

**Issue:**  
Found `any` types in critical API functions, reducing type safety benefits.

**Locations:**

```typescript
// src/lib/api.ts:283
function createApiError(status: number, data: any): ApiError {
  // ❌ 'data' should be typed
}

// src/lib/api.ts:650+
getMasterData: async (slug: string, filters: { ... }) => {
  // Response type uses [key: string]: any
}
```

**Impact:**

- **Severity**: MEDIUM
- **Type Safety**: Loss of compile-time checks
- **Developer Experience**: No autocomplete for data structures
- **Refactoring Risk**: Harder to refactor without type errors

**Solution:**

```typescript
// ✅ Define proper types for error data
interface ApiErrorData {
  message?: string;
  details?: unknown;
  errors?: ValidationError[];
}

function createApiError(status: number, data: ApiErrorData): ApiError {
  const error = new Error(
    data.message || `HTTP error! status: ${status}`
  ) as ApiError;
  error.status = status;
  error.details = data;
  return error;
}

// ✅ Use generic constraints for master data
interface MasterDataItem {
  id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  // Specific fields added by extending types
}

interface DrugItem extends MasterDataItem {
  drug_name: string;
  om_number: string;
  vendor: string;
}

// Type-safe master data API
getMasterData: async <T extends MasterDataItem>(
  slug: string,
  filters: MasterDataFilters
): Promise<MasterDataResponse<T>> => {
  // Fully typed response
};
```

**Steps:**

1. Audit codebase for `any` types: `grep -r ": any" src/`
2. Create type definitions for all API response shapes
3. Replace `any` with proper types or `unknown` (for truly unknown data)
4. Enable stricter TypeScript rules:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "noImplicitAny": true,
       "strict": true,
       "strictNullChecks": true
     }
   }
   ```
5. Fix resulting type errors incrementally
6. Update ESLint to warn on `any` usage:
   ```javascript
   "@typescript-eslint/no-explicit-any": "warn"
   ```

**Benefits:**

- Full type safety across codebase
- Better IDE autocomplete and IntelliSense
- Catch errors at compile time instead of runtime
- Easier refactoring with type checking
- Self-documenting code

---

## 3. Security & Reliability Issues

### 🔴 **CRITICAL: Insecure Token Storage in sessionStorage**

**Issue:**  
Access tokens are stored in `sessionStorage`, which is vulnerable to XSS attacks.

**Location:**

```typescript
// src/lib/api.ts:306
this.axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token"); // ❌ Vulnerable to XSS
  if (token && !config.skipAuthToken) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Impact:**

- **Severity**: CRITICAL (Security Vulnerability)
- **Attack Vector**: XSS scripts can steal tokens from sessionStorage
- **Compliance**: Fails OWASP security standards
- **Business Risk**: Unauthorized access to sensitive pharmaceutical data
- **Regulatory**: Potential HIPAA/FDA compliance violations

**Solution:**
Implement secure token management:

```typescript
// ✅ Option 1: HttpOnly Cookies (Recommended)
// Backend sets: Set-Cookie: access_token=xxx; HttpOnly; Secure; SameSite=Strict

// Frontend - no manual token handling needed
// Cookies automatically sent with requests

// src/lib/api.ts
this.axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Option 2: Secure token manager with encryption (if cookies not possible)
// src/lib/tokenManager.ts
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

class SecureTokenManager {
  private readonly STORAGE_KEY = "__auth_token__";

  setToken(token: string): void {
    // Encrypt before storing
    const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
    sessionStorage.setItem(this.STORAGE_KEY, encrypted);

    // Set expiration
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    sessionStorage.setItem("__token_expires__", expiresAt.toString());
  }

  getToken(): string | null {
    const encrypted = sessionStorage.getItem(this.STORAGE_KEY);
    if (!encrypted) return null;

    // Check expiration
    const expiresAt = sessionStorage.getItem("__token_expires__");
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      this.clearToken();
      return null;
    }

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem("__token_expires__");
  }
}

export const tokenManager = new SecureTokenManager();
```

**Steps:**

1. **Backend coordination**: Work with backend team to implement HttpOnly cookies
2. **Update API client**: Remove `sessionStorage.getItem("access_token")`
3. **Enable credentials**: Set `withCredentials: true` in axios config
4. **Add CSRF protection**: Implement CSRF token validation
5. **Security headers**: Ensure backend sends:
   - `Content-Security-Policy`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Strict-Transport-Security`
6. **Penetration testing**: Conduct security audit post-implementation
7. **Update authentication flow** in all auth-related components

**Benefits:**

- XSS attack mitigation (cookies not accessible via JavaScript)
- CSRF protection with SameSite cookie attribute
- OWASP compliance
- Regulatory compliance (HIPAA/FDA)
- Enhanced user data security

---

### 🟡 **HIGH: Missing CSRF Protection**

**Issue:**  
No CSRF token implementation for state-changing operations (POST, PUT, DELETE).

**Impact:**

- **Severity**: HIGH (Security Risk)
- **Attack Vector**: Cross-Site Request Forgery attacks
- **Affected Operations**: Create/Update/Delete experiments, user management, data uploads

**Solution:**

```typescript
// ✅ src/lib/api.ts - Add CSRF token interceptor
this.axiosInstance.interceptors.request.use(
  (config) => {
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  }
);

// ✅ index.html - Backend should inject CSRF token
<meta name="csrf-token" content="<%= csrfToken %>" />
```

**Steps:**

1. Coordinate with backend to generate CSRF tokens
2. Add CSRF token meta tag to `index.html`
3. Implement request interceptor to attach token
4. Add CSRF validation on backend for all state-changing endpoints
5. Handle CSRF token rotation on authentication
6. Add error handling for CSRF validation failures

**Benefits:**

- Protection against CSRF attacks
- Security best practice implementation
- Compliance with OWASP guidelines

---

### 🟡 **MEDIUM: No Rate Limiting or Request Throttling**

**Issue:**  
No client-side protection against rapid API requests or denial-of-service scenarios.

**Impact:**

- **Severity**: MEDIUM
- **Risk**: Backend overload from rapid clicking or bugs
- **User Experience**: Accidental duplicate submissions

**Solution:**

```typescript
// ✅ src/hooks/useThrottledMutation.ts
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useRef } from "react";

export function useThrottledMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>,
  throttleMs: number = 1000
) {
  const lastCallRef = useRef<number>(0);

  return useMutation({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall < throttleMs) {
        throw new Error("Please wait before trying again");
      }

      lastCallRef.current = now;
      return options.mutationFn!(variables);
    },
  });
}

// Usage
const createExperiment = useThrottledMutation(
  {
    mutationFn: experimentApi.create,
    onSuccess: () => toast.success("Created!"),
  },
  2000 // 2 second throttle
);
```

**Steps:**

1. Create throttling utilities for mutations
2. Apply to all create/update/delete operations
3. Add debouncing for search inputs (already have `useDebounce`)
4. Implement request deduplication in TanStack Query config
5. Add loading states to prevent double-clicks
6. Consider implementing request queue for bulk operations

**Benefits:**

- Prevents accidental duplicate submissions
- Reduces backend load
- Better user experience with loading states
- Protection against bugs causing request floods

---

## 4. Testing & Documentation Issues

### 🔴 **CRITICAL: Zero Test Coverage**

**Issue:**  
**ZERO** test files found in the entire codebase. No unit tests, integration tests, or E2E tests.

**Evidence:**

```bash
find src -name "*.test.*" -o -name "*.spec.*" | wc -l
# Output: 0
```

**Impact:**

- **Severity**: CRITICAL
- **Business Risk**: No safety net for refactoring or updates
- **Regression Risk**: HIGH - Any change can break existing features
- **Code Quality**: Cannot verify correctness of business logic
- **CI/CD**: No automated validation before deployment
- **Maintainability**: Fear-driven development (afraid to change code)

**Solution:**
Implement comprehensive testing strategy:

```typescript
// ✅ Example: Unit test for utility function
// src/lib/__tests__/api.test.ts
import { describe, it, expect } from 'vitest';
import { extractValidationErrors, handleApiError } from '../api';

describe('extractValidationErrors', () => {
  it('should extract error message from validation errors', () => {
    const error = {
      message: 'Validation failed',
      status: 400,
      details: [
        {
          field: 'email',
          message: 'Invalid email format',
          type: 'string',
          input: 'invalid@',
          context: { error: 'Email must be valid' },
        },
      ],
    } as ApiError;

    const result = extractValidationErrors(error);
    expect(result).toBe('Email must be valid');
  });

  it('should return original message if no validation errors', () => {
    const error = {
      message: 'Server error',
      status: 500,
      details: null,
    } as ApiError;

    const result = extractValidationErrors(error);
    expect(result).toBe('Server error');
  });
});

// ✅ Example: Hook test with React Testing Library
// src/hooks/__tests__/useRendomizationResult.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRendomizationResult } from '../useRendomizationResult';
import { randomizationApi } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  randomizationApi: {
    previewRandomization: vi.fn(),
    confirmRandomization: vi.fn(),
  },
}));

describe('useRendomizationResult', () => {
  it('should handle confirm click with immutable updates', async () => {
    const { result } = renderHook(() => useRendomizationResult());

    // Setup initial state
    act(() => {
      result.current.setSelectedGroupDrug({ 'G1': '123', 'G2': '456' });
    });

    // Mock API response
    vi.mocked(randomizationApi.confirmRandomization).mockResolvedValue({
      success: true,
      data: { id: 1 },
    });

    // Trigger confirm
    act(() => {
      result.current.handleConfirmClick();
    });

    await waitFor(() => {
      expect(randomizationApi.confirmRandomization).toHaveBeenCalledWith(
        expect.objectContaining({
          groups: expect.arrayContaining([
            expect.objectContaining({ experiment_drug_id: 123 }),
          ]),
        })
      );
    });
  });
});

// ✅ Example: Component test
// src/components/__tests__/DataViewModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataViewModal } from '../data-validation/DataViewModal';

describe('DataViewModal', () => {
  it('should render experiment name in title', () => {
    const experiment = {
      id: 1,
      experimentName: 'EXP-001',
      status: 'pending',
      studyType: 'Efficacy',
      dataType: 'Weight Sheet',
    };

    render(
      <DataViewModal
        isOpen={true}
        onClose={vi.fn()}
        experiment={experiment}
      />
    );

    expect(screen.getByText(/EXP-001/)).toBeInTheDocument();
  });

  it('should not show edit/approve buttons for non-pending experiments', () => {
    const experiment = {
      id: 1,
      experimentName: 'EXP-001',
      status: 'approved',
      studyType: 'Efficacy',
      dataType: 'Weight Sheet',
    };

    render(
      <DataViewModal
        isOpen={true}
        onClose={vi.fn()}
        experiment={experiment}
      />
    );

    expect(screen.queryByTitle('Edit')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Approve')).not.toBeInTheDocument();
  });
});
```

**Test Coverage Targets:**

| Category                                   | Target | Priority |
| ------------------------------------------ | ------ | -------- |
| **Utility Functions** (`lib/`)             | 90%    | HIGH     |
| **API Client** (`lib/api.ts`)              | 85%    | CRITICAL |
| **Custom Hooks** (`hooks/`)                | 80%    | HIGH     |
| **Business Logic Components**              | 75%    | HIGH     |
| **UI Components** (`atoms/molecules/`)     | 60%    | MEDIUM   |
| **Integration Tests** (E2E critical paths) | 100%   | CRITICAL |

**Steps:**

1. **Setup testing infrastructure** (Week 1):

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   npm install -D @testing-library/user-event msw
   npm install -D @vitest/ui @vitest/coverage-v8
   ```

2. **Configure Vitest** (`vitest.config.ts`):

   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";
   import path from "path";

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: "jsdom",
       setupFiles: ["./src/test/setup.ts"],
       coverage: {
         provider: "v8",
         reporter: ["text", "json", "html"],
         exclude: [
           "node_modules/",
           "src/test/",
           "**/*.d.ts",
           "**/*.config.*",
           "**/mockData.ts",
         ],
       },
     },
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

3. **Priority order for test implementation** (Weeks 2-8):
   - **Week 2-3**: Utility functions and API client (50 tests)
   - **Week 4-5**: Critical hooks (randomization, auth, experiments) (80 tests)
   - **Week 6**: Business logic components (60 tests)
   - **Week 7**: Integration tests for critical user flows (20 tests)
   - **Week 8**: Remaining hooks and components (40 tests)

4. **Add CI/CD integration**:

   ```yaml
   # .github/workflows/test.yml
   name: Test
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
         - run: npm ci
         - run: npm run test -- --coverage
         - run: npm run type-check
         - run: npm run lint
   ```

5. **Enforce test requirements**:
   - Block PRs with <70% coverage
   - Require tests for all new features
   - Add pre-commit hook to run tests

6. **Mock API responses** with MSW:

   ```typescript
   // src/test/mocks/handlers.ts
   import { rest } from "msw";
   import { API_CONFIG } from "@/lib/api";

   export const handlers = [
     rest.get(API_CONFIG.ENDPOINTS.EXPERIMENTS.LIST, (req, res, ctx) => {
       return res(
         ctx.status(200),
         ctx.json({
           success: true,
           data: { items: [], pagination: {} },
         })
       );
     }),
   ];
   ```

**Benefits:**

- Catch bugs before production
- Safe refactoring with confidence
- Documentation through tests (living documentation)
- Faster debugging (pinpoint exact failure)
- Better code design (testable code is better code)
- CI/CD automation
- Reduced QA time and costs

---

### 🟡 **HIGH: Missing Storybook Implementation**

**Issue:**  
No Storybook setup despite project instructions emphasizing Component Driven Development (CDD) and Atomic Design.

**Impact:**

- **Severity**: HIGH
- **Collaboration**: Designers cannot review components in isolation
- **Documentation**: No component library documentation
- **Development Speed**: Slower development without isolated component testing
- **Onboarding**: New developers lack component reference

**Solution:**

```bash
# Install Storybook
npx storybook@latest init

# Add necessary addons
npm install -D @storybook/addon-a11y @storybook/addon-interactions
```

```typescript
// ✅ .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;

// ✅ Example story: Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Experiment
      </>
    ),
    variant: 'primary',
  },
};
```

**Steps:**

1. Install and configure Storybook (Week 1)
2. Create stories for all atomic components (Week 2-3)
3. Create stories for molecules and organisms (Week 4-5)
4. Add accessibility checks with `addon-a11y`
5. Deploy Storybook to hosting (Chromatic/Netlify)
6. Integrate into CI/CD pipeline
7. Add visual regression testing

**Benefits:**

- Component library documentation
- Isolated component development
- Design-dev collaboration tool
- Visual regression testing
- Accessibility validation
- Onboarding resource

---

### 🟡 **MEDIUM: Insufficient Code Documentation**

**Issue:**  
Many complex functions lack JSDoc comments explaining parameters, return values, and usage.

**Example:**

````typescript
// ❌ No documentation
export function useRendomizationResult() {
  // Complex logic with no explanation
  // ...
}

// ✅ Proper documentation
/**
 * Custom hook for managing randomization result workflow
 *
 * Handles preview, confirmation, and navigation for experiment randomization.
 * Manages drug selection per group and buffer groups for weight sheet randomization.
 *
 * @returns {Object} Randomization management utilities
 * @returns {Record<string, string>} selectedGroupDrug - Drug ID selected for each group
 * @returns {Function} setSelectedGroupDrug - Update drug selection
 * @returns {RandomizationPreviewData | null} randomizationData - Preview data from API
 * @returns {boolean} isConfirmationPending - Loading state for confirmation
 * @returns {Function} previewRandomizationfn - Trigger preview API call
 * @returns {Function} handleConfirmClick - Confirm randomization with selected drugs
 * @returns {Function} handleBack - Navigate back to data validation
 * @returns {boolean} isPending - Loading state for preview
 * @returns {boolean} isError - Error state for preview
 * @returns {string[]} bufferGroups - List of buffer group names
 * @returns {Function} setBufferGroups - Update buffer groups
 *
 * @example
 * ```tsx
 * const {
 *   selectedGroupDrug,
 *   setSelectedGroupDrug,
 *   handleConfirmClick,
 *   isPending,
 * } = useRendomizationResult();
 *
 * // Select drug for group
 * setSelectedGroupDrug({ 'G1': '123' });
 *
 * // Confirm randomization
 * handleConfirmClick();
 * ```
 */
export function useRendomizationResult() {
  // ...
}
````

**Steps:**

1. Add JSDoc to all public APIs
2. Document complex algorithms with inline comments
3. Use TypeScript for type documentation
4. Generate API documentation with TypeDoc
5. Create README files for major modules

**Benefits:**

- Better developer onboarding
- Self-documenting code
- IDE IntelliSense improvements
- Reduced support questions

---

## 5. Performance & Optimization Issues

### 🟡 **MEDIUM: No Code Splitting Beyond Routes**

**Issue:**  
Large components and features are not lazy-loaded, increasing initial bundle size.

**Evidence:**

```typescript
// ❌ All components eagerly imported
import { DataViewModal } from "./DataViewModal";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetModal } from "./BioDWeightSheetModal";
// etc... (7+ heavy modals)
```

**Impact:**

- **Severity**: MEDIUM
- **Initial Load**: Larger bundle = slower first load
- **User Experience**: Delayed Time to Interactive (TTI)
- **Lighthouse Score**: Likely <90 performance score

**Solution:**

```typescript
// ✅ Lazy load heavy components
const BioDOrganViewModal = lazy(() => import('./BioDOrganViewModal'));
const BioDWeightSheetModal = lazy(() => import('./BioDWeightSheetModal'));
const CalliperingSheetModal = lazy(() => import('./CalliperingSheetEditModal'));

// Wrap in Suspense
<Suspense fallback={<ModalSkeleton />}>
  {viewModal.isOpen && (
    <BioDOrganViewModal
      isOpen={viewModal.isOpen}
      onClose={viewModal.closeModal}
      experimentName={experiment.experimentName}
    />
  )}
</Suspense>
```

**Steps:**

1. Identify heavy components (>50KB)
2. Lazy load modals, charts, and data grids
3. Add Suspense boundaries with skeletons
4. Measure bundle size impact: `npm run build -- --analyze`
5. Set budget alerts in Vite config
6. Optimize recharts imports (tree-shakeable)

**Benefits:**

- Faster initial page load
- Better Lighthouse scores
- Improved Time to Interactive (TTI)
- Better mobile experience

---

### 🟡 **MEDIUM: Missing Memoization for Expensive Operations**

**Issue:**  
Expensive computations and callbacks are not memoized, causing unnecessary re-renders.

**Example:**

```typescript
// ❌ No memoization
function DataViewModal({ experiment }: Props) {
  const dataItems = getDataViewItems(
    experiment.experimentName,
    experiment.studyType,
    experiment.dataType
  ); // Recalculated on every render

  const handleAction = (item, action) => {
    // New function reference on every render
    // ...
  };
}

// ✅ With memoization
function DataViewModal({ experiment }: Props) {
  const dataItems = useMemo(
    () =>
      getDataViewItems(
        experiment.experimentName,
        experiment.studyType,
        experiment.dataType
      ),
    [experiment.experimentName, experiment.studyType, experiment.dataType]
  );

  const handleAction = useCallback(
    (item: DataViewItem, action: string) => {
      // Stable function reference
      // ...
    },
    [
      /* dependencies */
    ]
  );
}
```

**Steps:**

1. Profile components with React DevTools Profiler
2. Memoize expensive computations with `useMemo`
3. Memoize callbacks with `useCallback`
4. Wrap child components with `React.memo` where beneficial
5. Avoid premature optimization - measure first

**Benefits:**

- Reduced re-renders
- Better performance for complex UIs
- Smoother user experience

---

## 6. Accessibility Issues

### 🟡 **MEDIUM: Incomplete ARIA Labels**

**Issue:**  
While ESLint includes `jsx-a11y` plugin, some interactive elements lack proper accessibility attributes.

**Solution:**

- Audit all buttons, inputs, and custom controls
- Add `aria-label` to icon-only buttons
- Ensure proper heading hierarchy
- Add screen reader announcements for dynamic content
- Test with screen readers (NVDA/JAWS)

**Steps:**

1. Run accessibility audit: `npm install -D @axe-core/react`
2. Fix reported issues
3. Add accessibility tests to Storybook
4. Manual testing with screen readers
5. WCAG 2.1 AA compliance verification

---

## 7. Dependencies & Configuration Issues

### 🟢 **LOW: Dependency Management**

**Positive Finding:**  
Dependencies are well-maintained and up-to-date. Good use of modern versions:

- React 19.1.1 ✅
- TypeScript 5.9.3 ✅
- Vite 7.1.11 ✅
- TanStack Query 5.90+ ✅

**Minor Issues:**

- `@sentry/tracing@7.x` is deprecated (should use `@sentry/react@10.x` only)
- Consider removing unused `react-router@7.x` and `react-router-dom@7.x` (using TanStack Router)

**Solution:**

```bash
npm uninstall @sentry/tracing react-router react-router-dom
npm audit fix
```

---

## 8. Internationalization (i18n)

### 🔴 **CRITICAL: No i18n Implementation**

**Issue:**  
All strings are hardcoded in English. No internationalization framework despite project instructions mentioning i18n requirements.

**Impact:**

- **Severity**: CRITICAL (for international deployments)
- **Business Impact**: Cannot support multi-language users
- **Maintainability**: Hardcoded strings scattered throughout code

**Solution:**

```bash
npm install react-intl
```

```typescript
// ✅ src/i18n/messages.ts
export const messages = {
  en: {
    'experiment.create': 'Create Experiment',
    'experiment.edit': 'Edit Experiment',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
  },
  fr: {
    'experiment.create': 'Créer une expérience',
    'experiment.edit': 'Modifier l\'expérience',
    'button.save': 'Enregistrer',
    'button.cancel': 'Annuler',
  },
};

// ✅ Usage
import { FormattedMessage, useIntl } from 'react-intl';

function CreateExperimentButton() {
  const intl = useIntl();

  return (
    <Button>
      <FormattedMessage id="experiment.create" />
    </Button>
  );
}
```

**Steps:**

1. Install `react-intl`
2. Extract all hardcoded strings
3. Create translation key files
4. Wrap app with `IntlProvider`
5. Replace hardcoded strings with `FormattedMessage`
6. Add language switcher UI

---

## Final Recommendations & Action Plan

### Immediate Actions (Week 1) - CRITICAL

1. **Fix API endpoint bug** (Missing leading slash) - 1 hour
2. **Remove console.log statements** - 2 hours
3. **Implement secure token storage** - 1 day
4. **Fix data mutation in randomization** - 3 hours
5. **Setup test infrastructure** - 1 day //ignore

### Short-term (Weeks 2-4) - HIGH Priority

1. **Implement test coverage** (target 70%) - 3 weeks //ignore
2. **Add CSRF protection** - 2 days //tbd
3. **Standardize error handling** - 3 days
4. **Refactor large components** (DataViewModal) - 1 week
5. **Setup Storybook** - 1 week //ignore
6. **Add code splitting** - 2 days

### Medium-term (Weeks 5-8) - MEDIUM Priority

1. **Complete test coverage** (target 85%) - 4 weeks //ignore
2. **Implement i18n** - 2 weeks //dicy
3. **Performance optimization** (memoization, lazy loading) - 1 week
4. **Remove `any` types** - 1 week
5. **Add JSDoc documentation** - 1 week
6. **Accessibility audit & fixes** - 1 week //npm run audit

### Long-term (Months 3-6) - Continuous Improvement

1. **Visual regression testing** (Chromatic)
2. **E2E testing** (Playwright/Cypress)
3. **Performance monitoring** (Web Vitals)
4. **Security audits** (quarterly)
5. **Dependency updates** (monthly)
6. **Code quality metrics** (SonarQube)

---

## Metrics & Success Criteria

### Current State

- **Test Coverage**: 0%
- **TypeScript Strict Mode**: Partial
- **Security Grade**: C (Critical vulnerabilities)
- **Performance**: Unknown (needs Lighthouse audit)
- **Bundle Size**: Unknown (needs analysis)

### Target State (3 months)

- **Test Coverage**: 85%+
- **TypeScript Strict Mode**: 100%
- **Security Grade**: A (OWASP compliant)
- **Performance**: Lighthouse >90
- **Bundle Size**: <500KB initial load

### KPIs to Track

- Test coverage percentage
- Number of security vulnerabilities
- Lighthouse performance score
- Bundle size (initial + total)
- Build time
- Number of TypeScript errors
- ESLint warnings count
- Time to first byte (TTFB)
- Cumulative Layout Shift (CLS)

---

## Conclusion

The Orano Med Frontend codebase demonstrates **solid architectural foundations** with modern React patterns and comprehensive TypeScript usage. However, **critical security vulnerabilities** and **complete absence of testing** pose significant risks to production deployment.

**The project is NOT production-ready** without addressing:

1. Security vulnerabilities (token storage, CSRF protection)
2. Test coverage implementation
3. Critical bug fixes (API endpoint, data mutation)
4. Console.log removal

With focused effort on the recommended action plan, the codebase can achieve **production-ready status within 8 weeks**.

**Overall Assessment: B+ with Critical Blockers**

- Architecture: A-
- Code Quality: B
- Security: C (🚨 Blocker)
- Testing: F (🚨 Blocker)
- Performance: B+ (estimated)
- Maintainability: B+

---

**Report Generated**: February 5, 2026  
**Next Review**: May 5, 2026 (post-remediation)  
**Audit Version**: 1.0
