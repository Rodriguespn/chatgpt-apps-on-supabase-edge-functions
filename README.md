# Your First ChatGPT App: A Live Demo with MCP

This is the demo repository for the workshop **"Your First ChatGPT App: A Live Demo with MCP"**.

> **Note**: This is a fork from [yannj-fr/mcp-ui-fridge-test-app](https://github.com/yannj-fr/mcp-ui-fridge-test-app) authored by [@yannj-fr](https://github.com/yannj-fr).

## About This Workshop

OpenAI recently released the ChatGPT App SDK during DevDays 2025, making it possible for developers to go beyond prompts and build full apps with custom UIs directly inside ChatGPT—powered by their own MCP servers.

In this hands-on session, we'll build a ChatGPT app step by step using a smart fridge inventory system as our example. You'll learn how to:

1. **Start up an MCP server** - Using Supabase Edge Functions with `mcp-lite`
2. **Connect it to ChatGPT** - Integrate your local server via ngrok
3. **Layer on a custom UI** - Build interactive widgets with the ChatGPT App SDK

By the end, you'll have a clear blueprint for turning your own tools and apps into fully integrated ChatGPT apps 🚀 🙌

<details>
<summary><strong>How ChatGPT Apps</strong></summary>

OpenAI recently released the ChatGPT App SDK during DevDays 2025, making it possible for developers to go beyond prompts and build full apps with custom UIs directly inside ChatGPT—powered by their own MCP servers. In this talk, we use a "smart fridge" as a simple, end‑to‑end example: you’ll boot an MCP server, connect it to ChatGPT, and return an interactive widget that renders right in the chat.

- You create an App inside ChatGPT that can call your MCP server over HTTPS
- Your MCP server exposes tools (e.g., show_fridge, add_fridge_item) and optional UI widgets
- ChatGPT orchestrates tool calls and renders the UI returned by your server
- All runs securely through your public endpoint (local via ngrok or deployed)

![ChatGPT Apps flow diagram](https://framerusercontent.com/images/tqvYmO6T1WICGVm9tVUZqx4WrU8.webp?width=3228&height=2507)

For a deeper dive, check out: Inside OpenAI’s Apps SDK — How to build interactive ChatGPT apps with MCP: https://alpic.ai/blog/inside-openai-s-apps-sdk-how-to-build-interactive-chatgpt-apps-with-mcp?ref=makerswave.com

</details>

## Prerequisits

Make sure you have these installed:

- [Deno v1.40+](https://deno.com/manual/getting_started/installation)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- [Docker](https://docs.docker.com/get-docker/)
- ChatGPT Apps access — only available outside Europe or via Dev Mode; see announcement to enable Dev Mode: https://openai.com/pt-BR/index/introducing-apps-in-chatgpt/

## Repository Structure

```
chatgpt-apps-on-supabase-edge-functions/
├── deno.json                          # Root Deno configuration with tasks
├── deno.lock                          # Dependency lock file
└── supabase/
    ├── config.toml                    # Supabase configuration
    └── functions/
        └── mcp-server/                # MCP Edge Function
            ├── index.ts               # Main edge function entry point
            ├── deno.json              # Function-specific Deno config
            ├── README.md              # Edge function documentation
            ├── server/
            │   ├── fridgeWidget.ts    # Main server module
            │   ├── types/
            │   │   └── fridge.ts      # TypeScript type definitions
            │   ├── data/
            │   │   └── mockFridgeData.ts  # Mock fridge inventory data
            │   └── tools/
            │       └── fridgeWidget.ts    # MCP tool implementations
            └── widget/                     # Fridge widget assets (prebuilt)
                └── dist/
                    ├── index.js            # Compiled widget JS
                    └── style.css           # Compiled widget CSS
```

## Getting Started

### 1. Install Dependencies

From the project root directory:

```bash
deno install
```

### 2. Start Supabase Local Environment

```bash
supabase start
```

This starts the local Supabase stack.

Note: It may take a few minutes to download Docker images and initialize Supabase.

### 3. Start the Edge Function (Dev)

```bash
deno task dev
```

This command serves the MCP edge function at:

- `http://localhost:54321/functions/v1/mcp-server`

Requires the Supabase local environment to be running (see step 2).

### 4. Verify the Server is Running

```bash
# Health check
curl http://localhost:54321/functions/v1/mcp-server/health

# Test MCP endpoint
curl -X POST http://localhost:54321/functions/v1/mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

## Testing the MCP Server

### Option 1: Using MCP Inspector (Recommended for Testing)

The [MCP Inspector](https://github.com/mcpjam/inspector) is a tool for testing MCP servers with UI support.

```bash
# Run inspector (with your server running)
npx -y @mcpjam/inspector
```

Then connect to: `http://localhost:54321/functions/v1/mcp-server/mcp`

### Option 2: Testing with ChatGPT

To connect your local MCP server to ChatGPT:

Note: ChatGPT Apps are currently only available outside Europe or when Dev Mode is enabled. See the OpenAI announcement for how to enable Dev Mode: https://openai.com/pt-BR/index/introducing-apps-in-chatgpt/

#### Step 1: Expose Your Local Server

With your server running (`deno task dev`), open a new terminal:

```bash
ngrok http 54321
```

ngrok will provide you with a public URL like: `https://abc123.ngrok.io`

#### Step 2: Connect to ChatGPT

1. Go to [ChatGPT](https://chatgpt.com/)
2. Navigate to **Settings** > **Connectors** > **Create**
3. Add your edge function URL:
   ```
   https://your-ngrok-domain.ngrok.io/functions/v1/mcp-server/mcp
   ```
4. Save the connector

#### Step 3: Test the Integration

In ChatGPT, try asking:

- "What's in my fridge?"
- "Show me my fridge contents"
- "Add milk to my fridge"

The AI will use your MCP server and display the interactive widget!

## Available MCP Tools

The server exposes the following tools that you'll explore in the workshop:

1. **show_fridge** - Display fridge contents in an interactive widget
2. **add_fridge_item** - Add a new item to the fridge inventory

These tools demonstrate how MCP servers can combine backend logic with rich, interactive UIs inside ChatGPT.

## Deployment (Optional)

To deploy to Supabase:

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Deploy the function
deno task deploy
```

## Learning Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [ChatGPT App SDK Documentation](https://platform.openai.com/docs/guides/apps)
- [Supabase tutorial: MCP server with mcp-lite](https://supabase.com/docs/guides/functions/examples/mcp-server-mcp-lite)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.com/manual)

## Workshop Support

If you encounter any issues during the workshop, check the Troubleshooting section above or ask for help!

## Credits

- Workshop demo repository maintained for **"Your First ChatGPT App: A Live Demo with MCP"**
- Original project by [@yannj-fr](https://github.com/yannj-fr) - [mcp-ui-fridge-test-app](https://github.com/yannj-fr/mcp-ui-fridge-test-app)
- This fork is for educational purposes

## License

This project is a fork for educational purposes. Please refer to the original repository for license information.
