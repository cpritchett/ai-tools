# AI Tools MCP Server

A Model Context Protocol (MCP) server implementation of the AGENT.md setup functionality, providing the same capabilities as the bash script but accessible through the MCP protocol.

## Overview

This MCP server exposes the AGENT.md setup functionality as a set of tools that can be called by MCP-compatible clients. It implements the same core features as the `setup-agent-md.sh` bash script:

- Set up AGENT.md specification with AI tool compatibility
- Backup existing AI tool configuration files safely
- Create symbolic links for multi-tool compatibility
- Generate LLM integration prompts for merging configurations
- Verify setup correctness

## Supported AI Tools

The MCP server supports the same AI tools as the bash script:

- **Claude Code** (`CLAUDE.md`)
- **GitHub Copilot** (`.github/copilot-instructions.md`)
- **Kiro AI** (`.kiro/steering/project.md`)
- **Cursor** (`.cursorrules`)
- **Windsurf** (`.windsurfrules`)
- **Continue** (`.continuerc.json`)
- **Roo** (`.roorc`)
- **Cline** (`.clinerc`)

## Available Tools

### `setup_agent_md`

Main setup function that implements the complete AGENT.md specification setup process.

**Parameters:**
- `targetDirectory` (optional): Target directory path (defaults to current directory)
- `enabledTools` (optional): Array of AI tools to enable
- `enableAll` (optional): Enable all AI tools (default: false)

**Example:**
```json
{
  "targetDirectory": "/path/to/project",
  "enabledTools": ["claude", "copilot", "cursor"],
  "enableAll": false
}
```

### `list_supported_tools`

Returns a list of all supported AI tools and their configuration details.

### `backup_existing_configs`

Safely backs up existing AI tool configuration files before making changes.

**Parameters:**
- `targetDirectory` (optional): Target directory path
- `tools` (optional): Array of tools to backup configs for

### `create_symlinks`

Creates symbolic links from AI tool configuration files to AGENT.md.

**Parameters:**
- `targetDirectory` (optional): Target directory path
- `tools` (optional): Array of tools to create symlinks for

### `generate_integration_prompt`

Generates an LLM integration prompt for merging backed up configuration files.

**Parameters:**
- `backupDirectory`: Directory containing backed up config files
- `backedUpFiles`: Array of backed up file paths

### `verify_setup`

Verifies that the AGENT.md setup is correct by checking files and symlinks.

**Parameters:**
- `targetDirectory` (optional): Target directory path
- `tools` (optional): Array of tools to verify

## Usage

### Running the MCP Server

```bash
# Start the MCP server
npm run mcp

# Or run directly with node
node tools/mcp-server/index.js
```

### Testing

Run the built-in test suite to verify functionality:

```bash
npm run test
```

### Interactive Demo

See the MCP server in action with a live demo:

```bash
node tools/mcp-server/demo.js
```

This demo creates a temporary project and demonstrates all MCP server capabilities.

### Example MCP Client Usage

The server communicates via JSON-RPC over stdio following the MCP protocol. Example tool call:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "setup_agent_md",
    "arguments": {
      "enabledTools": ["claude", "copilot"]
    }
  }
}
```

## Benefits Over Bash Script

1. **Protocol Standardization**: Uses MCP protocol for consistent integration
2. **Language Agnostic**: Can be called from any MCP-compatible client
3. **Structured Input/Output**: JSON schema for parameters and responses
4. **Better Error Handling**: Structured error responses
5. **Programmatic Access**: Easy to integrate into automated workflows
6. **Type Safety**: TypeScript implementation with proper typing

## Architecture

The MCP server is implemented in TypeScript and compiled to JavaScript:

- **Source**: `tools/mcp-server/index.ts`
- **Compiled**: `dist/index.js`
- **Entry Point**: `tools/mcp-server/index.js`
- **Tests**: `tools/mcp-server/test.js`

## Development

### Building

```bash
npm run build
```

### Adding New Tools

To add support for a new AI tool:

1. Add the tool configuration to the `AI_TOOLS` object in `index.ts`
2. The tool will automatically be supported by all MCP functions
3. Rebuild with `npm run build`
4. Test with `npm run test`

### Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions

## Compatibility

The MCP server maintains full compatibility with the bash script functionality while providing a modern, protocol-based interface. Both implementations can coexist and be used as needed.