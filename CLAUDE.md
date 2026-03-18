# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies and initialize database (first-time setup)
npm run setup

# Development server (Turbopack)
npm run dev

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Build for production
npm run build

# Lint
npm run lint

# Reset database
npm run db:reset
```

Set `ANTHROPIC_API_KEY` in `.env` to use real AI generation; without it, static mock responses are returned.

## Architecture

UIGen is a Next.js 15 (App Router) application that lets users describe React components in a chat, then streams AI-generated code into a live preview—no files are written to disk.

### Data flow

1. **User sends a message** → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. **API route** reconstructs a `VirtualFileSystem` from serialized `files` sent in the request body, then calls `streamText` (Vercel AI SDK) with two tools: `str_replace_editor` and `file_manager`
3. **Claude** calls those tools to create/edit files inside the in-memory `VirtualFileSystem`
4. **Client** receives streamed tool calls via `ChatContext` (`src/lib/contexts/chat-context.tsx`) and applies them to the client-side `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`)
5. **PreviewFrame** (`src/components/preview/PreviewFrame.tsx`) watches `refreshTrigger`, transpiles all virtual files with Babel (via `jsx-transformer.ts`), and renders the output inside an `<iframe>` using an import-map

### Key modules

| Path | Role |
|------|------|
| `src/lib/file-system.ts` | `VirtualFileSystem` class — in-memory tree with full CRUD, serialization, and text-editor helpers |
| `src/lib/tools/str-replace.ts` | AI tool: string-replace operations on virtual files |
| `src/lib/tools/file-manager.ts` | AI tool: create/delete/rename virtual files |
| `src/lib/transform/jsx-transformer.ts` | Babel-based JSX/TSX → JS transpiler; builds the iframe's import map |
| `src/lib/prompts/generation.tsx` | System prompt sent to Claude on every chat request |
| `src/lib/contexts/file-system-context.tsx` | Client React context wrapping `VirtualFileSystem`; exposes `handleToolCall` for streaming updates |
| `src/lib/contexts/chat-context.tsx` | Client React context managing chat messages and wiring tool calls to the file system |
| `src/lib/auth.ts` | JWT-based sessions (7-day, httpOnly cookie); server-only |
| `src/lib/provider.ts` | Returns the Vercel AI SDK model (Anthropic by default, mock when no API key) |

### AI-generated component conventions

The system prompt (`src/lib/prompts/generation.tsx`) enforces:
- Every project must have a root `/App.jsx` as the default-export entry point
- Style with Tailwind CSS only (no inline styles)
- Internal imports use the `@/` alias (e.g., `import Foo from '@/components/Foo'`)
- No HTML files

### Auth & persistence

- JWT sessions stored in `auth-token` httpOnly cookie; secret from `JWT_SECRET` env var
- SQLite database via Prisma (`prisma/schema.prisma`): `User` and `Project` models
- `Project.messages` and `Project.data` store JSON-serialized chat history and virtual FS snapshots
- Anonymous users can generate components; persistence requires sign-up
- Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem`

### Testing

Tests use Vitest + jsdom + React Testing Library. Test files live alongside source in `__tests__/` subdirectories.
