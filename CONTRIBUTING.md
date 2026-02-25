# Contributing to Orano Med Frontend

This document provides guidelines and processes for contributing to the codebase.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Message Conventions](#commit-message-conventions)
- [Code Review Process](#code-review-process)
- [Coding Standards](#coding-standards)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Testing Requirements](#testing-requirements)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

1. Read the [README.md](./README.md) for project setup
2. Set up your development environment
3. Familiarized yourself with the tech stack
4. Access to the project management system

### First Time Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd orano_med_frontend_reactjs

# 2. Install dependencies
npm install

# 3. Set up Git hooks
npm run prepare

# 4. Create .env file
cp .env.example .env
```

## 💻 Development Workflow

### 1. Sync with Latest Changes

```bash
# Checkout development branch
git checkout development

# Pull latest changes
git pull origin development
```

### 2. Create Feature Branch

```bash
# Create and checkout new branch (always prefix with TaskId)
git checkout -b TASK-123-feature/your-feature-name

# Or for bug fixes
git checkout -b TASK-456-fix/bug-description
```

### 3. Make Changes

- Write clean, maintainable code
- Follow project coding standards
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Format code
npm run format

# Test in browser
npm run dev
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with TaskId-prefixed message
git commit -m "TASK-123: add user export functionality"
```

### 6. Push to Your Fork

```bash
git push origin TASK-123-feature/your-feature-name
```

### 7. Create Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill in PR template
- Submit for review

## 🌿 Branching Strategy

### Branching & PR Workflow

#### Branches

- **`development`**: Main integration branch (all feature/fix branches branch from and merge back here)
- **`staging`**: Pre-release QA/testing branch (PRs from `development`)

**Note:** There is currently no `main`/`production` branch. All releases are managed via `staging`.

#### Branching Process

1. Create a new branch from `development` for your task (prefix with TaskId, e.g. `TASK-123-feature-x`)
2. Make changes and commit (see commit message rules below)
3. Push and create a PR to `development`
4. Copilot reviews first; after Copilot comments are resolved, a reviewer with approval permission reviews
5. After approval, squash & merge to `development`
6. When ready for release, raise PR from `development` to `staging`

### Branch Naming Conventions

**Format**: `<TaskId>-<branch-name>`

**Examples**:

```bash
TASK-123-feature/add-user-export
TASK-456-fix/experiment-validation-bug
TASK-789-refactor/api-client-structure
TASK-321-chore/upgrade-react-19
```

### Branch Lifecycle

```
development
    ↓
TASK-123-feature-x (feature/fix branch)
    ↓ (develop & test)
    ↓ (Copilot review)
    ↓ (reviewer approval)
    ↓
development (squash & merge)
    ↓
staging (release/QA)
```

## 📝 Commit Message Conventions

**Format**: `<TaskId>: <commit message>`

- Always prefix with TaskId (e.g. `TASK-123: add user export to CSV`)
- Use imperative mood ("add" not "added")
- No period at the end
- Max 72 characters

### Examples

```bash
TASK-123: add user export to CSV
TASK-456: fix experiment validation bug
TASK-789: refactor API client structure
TASK-321: upgrade TanStack Query to v5.90
TASK-654: update API integration docs
```

### Bad Examples

```
Added new feature
Fixed bug
Update
Changes
WIP
```

## 🔍 Code Review Process

### Submitting for Review

1. **Self-review first**
   - Read your own changes
   - Check for common mistakes
   - Ensure all checks pass

2. **PR Description**
   - Explain what changed and why
   - Link related issues
   - Add screenshots for UI changes
   - List breaking changes

3. **Review Flow**
   - Copilot reviews first (resolve all Copilot comments)
   - A reviewer with approval permission reviews and approves
   - Squash & merge to `development`

### Review Criteria

Reviewers check for:

- ✅ **Functionality**: Code works as intended
- ✅ **Code Quality**: Clean, readable, maintainable
- ✅ **Performance**: No performance regressions
- ✅ **Security**: No security vulnerabilities
- ✅ **Tests**: Adequate test coverage
- ✅ **Documentation**: Updated if needed
- ✅ **Accessibility**: WCAG compliance
- ✅ **TypeScript**: Proper typing
- ✅ **Best Practices**: Follows project conventions

### Common Rejection Reasons

1. **Missing error handling**
2. **Hardcoded values** (should be constants)
3. **Duplicate logic** (should reuse existing code)
4. **Poor naming** (unclear variable/function names)
5. **Missing TypeScript types** (`any` types)
6. **Accessibility issues**
7. **Performance problems**
8. **Inconsistent with project patterns**
9. **Incomplete implementation**
10. **Breaking changes without discussion**

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "TASK-123: address review feedback"

# Push updates
git push origin TASK-123-feature/your-feature
```

## 💎 Coding Standards

### General Principles

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **Single Responsibility**: One component, one purpose
- **Composition over Inheritance**

### Naming Conventions

**Files**:

```
✅ PascalCase for components:     Button.tsx, UserCard.tsx
✅ camelCase for hooks:            useMasterData.ts, useAuth.ts
✅ kebab-case for utilities:       password-utils.ts
```

**Variables & Functions**:

```typescript
✅ camelCase:          const experimentId = 1
✅ PascalCase:         function UserCard() {}
✅ UPPER_SNAKE_CASE:   const API_BASE_URL = "..."
✅ Boolean prefix:     isLoading, hasPermission, shouldRender
```

### Component Patterns

✅ **Functional components with TypeScript**:

```typescript
interface Props {
  userId: number;
  onUpdate?: (user: User) => void;
}

export function UserCard({ userId, onUpdate }: Props) {
  // Component logic
}
```

✅ **Destructure props early**:

```typescript
function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  // Use label, onClick, variant
}
```

❌ **Avoid in new code**:

- Class components
- `React.FC` type — prefer explicit prop interfaces. Existing usages can remain and be migrated opportunistically when those files are modified.
- Default exports for components — prefer named exports. Existing default exports do not need immediate refactoring; update them gradually when touching a component.
- Prop drilling (use Context/Redux)

### Hooks Rules

✅ **Follow Rules of Hooks**:

```typescript
// ✅ Top level only
const { data } = useQuery(...)

// ❌ Not in conditions
if (condition) {
  const { data } = useQuery(...) // WRONG!
}
```

✅ **Custom hooks**:

```typescript
export function useExperimentData(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["experiments", id],
    queryFn: () => apiClient.getExperiment(id),
  });

  return { experiment: data, isLoading, error };
}
```

### State Management

Use the right tool:

- **TanStack Query**: API data, server state
- **Redux Toolkit**: Global app state
- **Local State**: Component-specific UI state
- **Context**: Theme, notifications

### Error Handling

Always handle errors:

```typescript
const { data, error } = useQuery({
  queryKey: ["users"],
  queryFn: apiClient.getUsers,
});

if (error) {
  return <ErrorMessage message={error.message} />;
}
```

### TypeScript Standards

```typescript
// ✅ Use interfaces for objects
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Use type for unions/primitives
type Status = "active" | "inactive";

// ✅ Avoid any
const data: unknown = fetchData(); // Use unknown instead

// ✅ Type function parameters
function updateUser(id: number, data: Partial<User>): Promise<User> {
  // ...
}
```

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast (WCAG AA)
- Add alt text to images

```typescript
<Button
  aria-label="Delete experiment"
  aria-describedby="delete-warning"
>
  <Trash2Icon />
</Button>
```

## 📤 Pull Request Guidelines

### Before Submitting

```bash
# 1. Sync with latest
git pull origin development

# 2. Rebase if needed
git rebase development

# 3. Run all checks
npm run type-check
npm run lint
npm run format

# 4. Test thoroughly
npm run dev
```

### PR Checklist

- [ ] Code builds without errors
- [ ] No TypeScript errors
- [ ] Linter passes
- [ ] Code formatted
- [ ] No console.log statements
- [ ] Environment variables documented
- [ ] Route tree regenerated (if routes changed)
- [ ] Manually tested
- [ ] PR description complete
- [ ] Breaking changes documented

### After Approval

Squash & merge is done via GitHub PR UI after reviewer approval.

## 🧪 Testing Requirements

### Manual Testing

1. Test all user flows
2. Check responsive design
3. Verify accessibility
4. Test error scenarios
5. Check browser compatibility

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 📚 Additional Resources

- [Project Instructions](.github/copilot-instructions.md)
- [System Architecture](./SYSTEM-ARCHITECTURE.md)
- [README](./README.md)

---

**Last Updated**: February 2026
