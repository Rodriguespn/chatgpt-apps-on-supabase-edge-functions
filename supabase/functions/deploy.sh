#!/bin/bash

# Deploy MCP Server to Supabase Edge Functions
# This script builds the widget and deploys the edge function

set -e

echo "🔨 Building widget..."
cd ../../apps/widget
deno task build

echo "📦 Copying widget assets..."
mkdir -p ../../../supabase/functions/mcp-server/widget/dist/assets
cp -r dist/assets/* ../../../supabase/functions/mcp-server/widget/dist/assets/

cd ../../../supabase/functions

echo "🚀 Deploying edge function..."
supabase functions deploy mcp-server --no-verify-jwt

echo "✅ Deployment complete!"
echo ""
echo "Your function is now live at:"
echo "https://your-project.supabase.co/functions/v1/mcp-server"
