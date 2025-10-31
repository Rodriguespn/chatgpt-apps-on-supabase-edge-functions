# MCP Fridge Widget - Supabase Edge Function

This directory contains the Supabase Edge Function for the MCP Fridge Widget Server.

## Structure

```
mcp-server/
├── index.ts              # Main edge function entry point
├── server/              # Server modules
│   ├── fridgeWidget.ts  # Main export module
│   ├── types/           # TypeScript types
│   ├── data/            # Mock data
│   └── tools/           # MCP tool handlers
└── widget/              # Built widget assets
    └── dist/assets/     # Compiled React widget (JS/CSS)
```

## Local Development

### Prerequisites

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
# or
npm install -g supabase
```

2. Build the widget first (from project root):
```bash
cd apps/widget
deno task build
```

### Running Locally

From the project root:

```bash
# Start Supabase local development
supabase start

# Serve the edge function
supabase functions serve mcp-server --no-verify-jwt
```

The function will be available at: `http://localhost:54321/functions/v1/mcp-server`

### Testing Endpoints

```bash
# Health check
curl http://localhost:54321/functions/v1/mcp-server/health

# MCP endpoint
curl -X POST http://localhost:54321/functions/v1/mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'

# Test widget
curl http://localhost:54321/functions/v1/mcp-server/test-widget
```

## Deployment

### Deploy to Supabase

1. Link to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

2. Deploy the function:
```bash
supabase functions deploy mcp-server --no-verify-jwt
```

The function will be available at: `https://your-project.supabase.co/functions/v1/mcp-server`

### Environment Variables

If you need to set environment variables:

```bash
supabase secrets set VARIABLE_NAME=value
```

## Endpoints

- `GET /` - Function information
- `GET /health` - Health check
- `POST /mcp` - MCP protocol endpoint
- `GET /test-widget` - View the widget HTML

## MCP Tools

The server exposes the following MCP tools:

1. **show_fridge** - Display fridge contents in an interactive widget
2. **add_fridge_item** - Add a new item to the fridge inventory

## Notes

- The edge function uses Hono for routing
- Widget assets (JS/CSS) are embedded inline for better performance
- No authentication required by default (set `verify_jwt = true` in config.toml if needed)
