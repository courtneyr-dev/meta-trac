# WordPress Meta Trac MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to WordPress Meta Trac data. Built with TypeScript and deployed on Cloudflare Workers.

This is a fork of [trac-mcp](https://github.com/Jameswlepage/trac-mcp) adapted for **WordPress Meta Trac** (https://meta.trac.wordpress.org), which tracks WordPress.org infrastructure and services.

## Overview

This MCP server transforms WordPress Meta Trac into an AI-accessible knowledge base, enabling intelligent queries about WordPress.org infrastructure, plugin directory, theme directory, WordCamp, and other WordPress.org services.

## Features

- **Multi-Instance Support**: Works with both Core Trac and Meta Trac via configuration
- Search Meta Trac tickets by keywords, components, or status
- Get detailed ticket information including descriptions, status, and metadata
- Access changeset information with full diff content
- Monitor recent WordPress.org infrastructure activity
- Retrieve project metadata like components, milestones, and priorities
- **Intelligent Query Routing**: Automatically detects ticket numbers, revisions, and keywords
- **Smart Caching**: Optimizes fetch operations for better performance

## Supported Trac Instances

| Instance | Base URL | Description |
|----------|----------|-------------|
| **Core** | https://core.trac.wordpress.org | WordPress software development |
| **Meta** | https://meta.trac.wordpress.org | WordPress.org infrastructure |

## Available Tools

### Standard MCP Tools

For Claude Desktop, MCP Inspector, and other standard MCP clients:

#### searchTickets
Search through WordPress Trac tickets with intelligent filtering.

```json
{
  "tool": "searchTickets",
  "args": {
    "query": "plugin directory",
    "limit": 10,
    "status": "open"
  }
}
```

#### getTicket
Retrieve comprehensive information about specific tickets.

```json
{
  "tool": "getTicket",
  "args": {
    "id": 100,
    "includeComments": true
  }
}
```

#### getChangeset
Access detailed information about code commits and changes.

```json
{
  "tool": "getChangeset",
  "args": {
    "revision": 1,
    "includeDiff": true,
    "diffLimit": 2000
  }
}
```

#### getTimeline
Monitor recent WordPress.org infrastructure activity.

```json
{
  "tool": "getTimeline",
  "args": {
    "days": 7,
    "limit": 20
  }
}
```

#### getTracInfo
Get organizational data like components and milestones.

```json
{
  "tool": "getTracInfo",
  "args": {
    "type": "milestones"
  }
}
```

### ChatGPT Deep Research Tools

For ChatGPT's Deep Research feature (simplified interface):

#### search
Intelligent search that automatically routes to the right data based on your query.

```json
{
  "tool": "search",
  "args": {
    "query": "plugin directory issues"
  }
}
```

#### fetch
Get detailed information about a specific item by ID.

```json
{
  "tool": "fetch",
  "args": {
    "id": "100"
  }
}
```

## Installation

### Deploy to Cloudflare Workers

```bash
# Clone the repository
git clone https://github.com/yourusername/meta-trac.git
cd meta-trac

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Deploy to Meta Trac (default)
npm run deploy

# Or deploy to specific environment
npm run deploy:meta       # Meta Trac
npm run deploy:production # Core Trac
```

### Environment Variables

Configure the Trac instance using environment variables:

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `TRAC_INSTANCE` | `core`, `meta` | `meta` | Which Trac instance to connect to |
| `TRAC_BASE_URL` | URL | (auto) | Override the base URL |

### wrangler.toml Configuration

```toml
# For Meta Trac (default)
[vars]
TRAC_INSTANCE = "meta"

# For Core Trac
[env.production]
vars = { TRAC_INSTANCE = "core" }

# For Meta Trac production
[env.meta]
vars = { TRAC_INSTANCE = "meta" }
```

## Connect to AI Assistant

### Standard MCP (Claude Desktop, etc.)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "meta-trac": {
      "command": "npx",
      "args": ["mcp-remote", "https://your-worker-url/mcp"]
    }
  }
}
```

### ChatGPT Deep Research

1. Open ChatGPT Settings -> Connectors tab
2. Add Server -> Import remote MCP server:
   ```
   https://your-worker-url/mcp/chatgpt
   ```
3. Enable in Composer -> Deep Research tool
4. Add as research source if needed

## Development

### Local Development

```bash
# Start development server (Meta Trac)
npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector http://localhost:8787/mcp
```

### Testing

```bash
# Run type checking
npm run type-check

# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Test deployment
curl https://your-worker-url/health
```

### Example Queries for Meta Trac

```bash
# Search for plugin directory issues
curl -X POST https://your-worker-url/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"searchTickets","arguments":{"query":"plugin directory"}},"id":1}'

# Get a specific ticket
curl -X POST https://your-worker-url/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"getTicket","arguments":{"id":100}},"id":1}'
```

## Architecture

- **Runtime**: Cloudflare Workers for global edge deployment
- **Language**: TypeScript with Zod validation
- **Protocol**: Model Context Protocol (MCP) for universal AI compatibility
- **APIs**: Public WordPress Trac CSV/RSS endpoints (no authentication required)

## Meta Trac Components

Meta Trac tracks WordPress.org infrastructure including:

- **Plugin Directory** - Plugin hosting and management
- **Theme Directory** - Theme hosting and management
- **Profiles** - User profiles (BuddyPress)
- **Internationalization** - Translation tools (GlotPress)
- **WordCamp Central** - WordCamp event management
- **Learn** - learn.wordpress.org
- **SSO** - Single sign-on for WordPress.org
- **Jobs** - jobs.wordpress.net
- **And more...**

## Deployment Checklist

1. [ ] Configure `wrangler.toml` with your Cloudflare account
2. [ ] Set `TRAC_INSTANCE` environment variable
3. [ ] Run `wrangler login`
4. [ ] Deploy with `npm run deploy:meta`
5. [ ] Verify health check: `curl https://your-url/health`
6. [ ] Test MCP endpoint: POST to `/mcp` with initialize request
7. [ ] Add to Claude Desktop or ChatGPT

## Known Limitations

- Comment history is not available via CSV API (visit ticket URL for full discussion)
- Components list requires fetching from ticket samples
- Some Meta Trac tickets may have different field structures than Core Trac

## License

This project is licensed under the GNU General Public License v2 or later - see the [GPL License](https://www.gnu.org/licenses/gpl-3.0.en.html#license-text) for details.

## Contributing

Contributions are welcome! This server demonstrates how to build production-ready MCP servers with multi-instance Trac support.

## Credits

Based on [trac-mcp](https://github.com/Jameswlepage/trac-mcp) by James LePage.
