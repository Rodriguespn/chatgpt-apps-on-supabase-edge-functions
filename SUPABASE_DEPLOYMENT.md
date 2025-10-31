# Supabase Edge Function Deployment Guide

This guide explains how to deploy the MCP Fridge Widget Server as a Supabase Edge Function.

## Overview

The MCP server has been adapted to run as a Supabase Edge Function, allowing you to host it serverlessly with Supabase's infrastructure.

## Project Structure

```
.
├── apps/
│   ├── server/         # Original Deno server (for local development)
│   └── widget/         # React widget
├── supabase/
│   ├── config.toml     # Supabase configuration
│   └── functions/
│       ├── deploy.sh   # Deployment helper script
│       └── mcp-server/ # Edge function
│           ├── index.ts              # Entry point
│           ├── server/               # Server modules
│           │   ├── fridgeWidget.ts  # Main exports
│           │   ├── types/           # TypeScript types
│           │   ├── data/            # Mock data
│           │   └── tools/           # MCP handlers
│           └── widget/              # Widget build artifacts
│               └── dist/assets/     # JS/CSS files
```

## Prerequisites

1. **Supabase CLI**: Install the Supabase CLI
   ```bash
   # macOS
   brew install supabase/tap/supabase

   # npm
   npm install -g supabase

   # Verify installation
   supabase --version
   ```

2. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)

3. **Supabase Project**: Create a new project in the Supabase dashboard

## Local Development

### 1. Build the Widget

First, build the React widget:

```bash
deno task widget:build
```

This creates the compiled widget assets in `apps/widget/dist/assets/`.

### 2. Start Supabase Locally

Initialize and start Supabase local development:

```bash
# Initialize (first time only)
supabase init

# Start local Supabase
supabase start
```

This will start:
- PostgreSQL database
- Studio (dashboard)
- Edge Runtime
- All other Supabase services

### 3. Serve the Edge Function

```bash
# Using deno task
deno task supabase:serve

# Or directly
supabase functions serve mcp-server --no-verify-jwt
```

The function will be available at:
```
http://localhost:54321/functions/v1/mcp-server
```

### 4. Test the Function

```bash
# Health check
curl http://localhost:54321/functions/v1/mcp-server/health

# Function info
curl http://localhost:54321/functions/v1/mcp-server/

# MCP tools list
curl -X POST http://localhost:54321/functions/v1/mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'

# Test widget HTML
curl http://localhost:54321/functions/v1/mcp-server/test-widget
```

## Deployment to Supabase

### 1. Link Your Project

Link your local project to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in the Supabase dashboard URL:
`https://app.supabase.com/project/[your-project-ref]`

### 2. Deploy Using Helper Script

The easiest way to deploy:

```bash
deno task supabase:deploy
```

This script will:
1. Build the widget
2. Copy widget assets to the edge function
3. Deploy the function to Supabase

### 3. Manual Deployment

Or deploy manually:

```bash
# Build widget
deno task widget:build

# Copy assets
mkdir -p supabase/functions/mcp-server/widget/dist/assets
cp -r apps/widget/dist/assets/* supabase/functions/mcp-server/widget/dist/assets/

# Deploy
supabase functions deploy mcp-server --no-verify-jwt
```

### 4. Verify Deployment

After deployment, your function will be available at:
```
https://[your-project-ref].supabase.co/functions/v1/mcp-server
```

Test it:
```bash
curl https://[your-project-ref].supabase.co/functions/v1/mcp-server/health
```

## Configuration

### Authentication

By default, the function doesn't require JWT authentication (`--no-verify-jwt`).

To enable authentication:

1. Remove `--no-verify-jwt` from deploy commands
2. Update `supabase/config.toml`:
   ```toml
   [functions.mcp-server]
   verify_jwt = true
   ```
3. Include JWT token in requests:
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-project.supabase.co/functions/v1/mcp-server/health
   ```

### Environment Variables

Set secrets for your edge function:

```bash
supabase secrets set KEY=value
supabase secrets set ANOTHER_KEY=another_value

# List secrets
supabase secrets list
```

Access in your function:
```typescript
const mySecret = Deno.env.get('KEY');
```

## Available Endpoints

Once deployed, your edge function exposes:

- `GET /` - Function information and available endpoints
- `GET /health` - Health check endpoint
- `POST /mcp` - MCP protocol endpoint (main interface)
- `GET /test-widget` - View the widget HTML directly

## MCP Tools

The server exposes these MCP tools:

1. **show_fridge**
   - Display fridge contents in an interactive widget
   - No parameters required

2. **add_fridge_item**
   - Add a new item to the fridge
   - Parameters: name, category, quantity, unit, etc.

## Monitoring & Logs

### View Logs

```bash
# Follow logs in real-time
supabase functions logs mcp-server --follow

# View recent logs
supabase functions logs mcp-server
```

### Supabase Dashboard

Monitor your function in the Supabase dashboard:
1. Go to Functions section
2. Select `mcp-server`
3. View invocations, logs, and metrics

## Troubleshooting

### Function Won't Deploy

```bash
# Check Supabase CLI version
supabase --version

# Update if needed
brew upgrade supabase

# Re-link project
supabase link --project-ref your-project-ref
```

### Widget Assets Missing

```bash
# Rebuild widget
cd apps/widget
deno task build

# Manually copy to edge function
cd ../..
mkdir -p supabase/functions/mcp-server/widget/dist/assets
cp -r apps/widget/dist/assets/* supabase/functions/mcp-server/widget/dist/assets/
```

### Import Errors

Ensure all imports in `supabase/functions/mcp-server/` use explicit specifiers:
- JSR packages: `jsr:@scope/package@version`
- NPM packages: `npm:package@version`
- Local files: Relative paths with `.ts` extension

### Function Times Out

Edge functions have execution limits. For long operations:
1. Optimize your code
2. Consider using Supabase database for state
3. Break work into smaller chunks

## Costs

Supabase Edge Functions pricing (as of 2024):
- Free tier: 500,000 invocations/month
- Pro tier: 2,000,000 invocations/month
- Additional: $2 per million invocations

See [Supabase Pricing](https://supabase.com/pricing) for current rates.

## Next Steps

1. **Add Database Integration**: Store fridge data in Supabase PostgreSQL instead of in-memory
2. **Add Authentication**: Implement per-user fridge data
3. **Add Webhooks**: Notify clients of changes
4. **Add Caching**: Use Supabase storage for widget assets
5. **Monitor Performance**: Set up alerts in Supabase dashboard

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Docs](https://docs.deno.com/deploy/manual)
- [Hono Documentation](https://hono.dev/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
