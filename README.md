# MCP Adapter Test

This project demonstrates an MCP-UI application that bridges between the Model Context Protocol (MCP) and the ChatGPT Apps SDK.

## Project Structure

```
mcp-adapter-test/
├── apps/
│   ├── widget/              # React Widget Application
│   └── server/              # MCP Server Application
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── CLAUDE.md               # Claude Code guidance
└── README.md
```

## Components

### Widget (`apps/widget/`)

A React application that displays fridge contents with:
- Zone-based organization (shelves, drawers, door compartments)
- Item cards with status indicators (fresh, expiring soon, expired)
- Responsive design
- Built with Vite for fast development

### Server (`apps/server/`)

An MCP server that:
- Serves the compiled widget as a UIResource
- Provides tools for fridge data visualization
- Includes ChatGPT Apps SDK compatibility layer

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run widget in development mode
pnpm widget:dev

# Run server in development mode
pnpm server:dev

# Run both in parallel
pnpm dev
```

### Building

```bash
# Build widget only
pnpm widget:build

# Build server only
pnpm server:build

# Build both
pnpm build
```

### Preview

```bash
# Preview the built widget
pnpm widget:preview

# Start the production server
pnpm server:start
```

## Data Format

See [`apps/widget/FRIDGE_DATA_FORMAT.md`](apps/widget/FRIDGE_DATA_FORMAT.md) for the complete JSON schema documentation.

## Tech Stack

- **Package Manager**: pnpm (with workspaces)
- **Widget**: React 18 + TypeScript + Vite
- **Server**: Node.js + TypeScript + MCP SDK
- **Styling**: CSS Modules

## Development Workflow

1. **Widget Development**: Run `pnpm widget:dev` to develop the React widget with hot reload
2. **Build Widget**: Run `pnpm widget:build` to create the minified bundle
3. **Embed in Server**: The server embeds the widget bundle and serves it as a UIResource
4. **Test Server**: Run `pnpm server:dev` to test the MCP server

## License

MIT
