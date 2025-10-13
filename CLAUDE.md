# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project consists of two separate TypeScript components:

1. **React Widget** (TypeScript + React + Vite): Compiled and minified into a bundle that gets embedded as text in MCP UI resources
2. **MCP Server** (TypeScript): Provides a tool that serves the minified widget as a UIResource

**Key Architecture:**
- The React widget is built by Vite into a minified bundle (HTML/JS/CSS)
- The MCP server includes this minified bundle as text in a UIResource
- The server exposes a tool that serves this UIResource
- An external adapter script (transparent to this project) handles MCP-UI ↔ ChatGPT Apps SDK conversion

## Development Commands

This project uses **pnpm** as the package manager and **Vite** as the build tool for the widget.

### React Widget Commands (from apps/widget/)
- `pnpm install` - Install widget dependencies
- `pnpm dev` - Start Vite dev server with hot reload for widget development
- `pnpm build` - Build and minify the widget bundle
- `pnpm preview` - Preview the built widget locally
- `pnpm test` - Run widget tests

### MCP Server Commands (from apps/server/)
- `pnpm install` - Install server dependencies
- `pnpm dev` - Start server in development mode
- `pnpm build` - Compile TypeScript server code
- `pnpm start` - Start the MCP server (serves the widget as UIResource)
- `pnpm test` - Run server tests

## Project Structure

```
mcp-adapter-test/
├── apps/
│   ├── widget/              # React Widget Application
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── types/       # TypeScript types
│   │   └── public/          # Static assets
│   │
│   └── server/              # MCP Server Application
│       └── src/
│           ├── tools/       # MCP tool definitions
│           ├── resources/   # UIResource creation logic
│           └── types/       # TypeScript types
│
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── CLAUDE.md
└── README.md
```

## Architecture

### Component Separation

#### 1. React Widget (apps/widget/)
- **Tech Stack**: React + TypeScript + Vite
- **Purpose**: Provides the interactive UI that users see
- **Build Process**:
  - Vite compiles and minifies into a single bundle
  - Output is embedded as text/HTML in the MCP server
  - Includes external adapter script for MCP-UI/ChatGPT Apps SDK communication
- **Development**: Can be developed independently with Vite dev server

#### 2. MCP Server (apps/server/)
- **Tech Stack**: TypeScript (Node.js)
- **Purpose**:
  - Implements MCP protocol (JSON-RPC 2.0)
  - Exposes tool(s) that serve the widget as UIResource
  - Embeds the minified widget bundle as text in UIResource responses
- **Key Function**: `createUIResource()` returns the widget embedded in a UIResource

### Integration Flow

```
1. Widget Development:
   React Components → Vite Build → Minified Bundle (HTML/JS/CSS)

2. Server Integration:
   Minified Bundle → Embedded as text → UIResource → MCP Tool Response

3. Runtime (handled by external adapter, transparent to this project):
   UIResource → Rendered in MCP-UI Client → Adapter Script → ChatGPT Apps SDK
```

### Data Flow

```
User
  ↓
MCP Client (Claude, etc.)
  ↓ [calls tool]
MCP Server (TypeScript)
  ↓ [returns UIResource with embedded widget]
Widget (React app + external adapter script)
  ↓ [adapter script translates events]
ChatGPT Apps SDK
```

### Key Points

- The widget (`apps/widget/`) and server (`apps/server/`) are **separate applications** in a pnpm workspace
- The widget is **statically embedded** in the server's UIResource responses
- The **adapter layer is external** - not part of this repository
- Changes to the widget require rebuilding and updating the server's embedded bundle

## Notes

This CLAUDE.md will be updated as the project structure and specific implementation details are established.
