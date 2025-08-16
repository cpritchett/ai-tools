# MCP Server Usage Examples

This document provides examples of how to use the AI Tools MCP Server with different MCP clients.

## Claude Desktop Integration

To use the MCP server with Claude Desktop, add it to your Claude configuration:

### macOS
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "ai-tools": {
      "command": "node",
      "args": ["/path/to/ai-tools/tools/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

### Windows
```json
// %APPDATA%\Claude\claude_desktop_config.json
{
  "mcpServers": {
    "ai-tools": {
      "command": "node",
      "args": ["C:\\path\\to\\ai-tools\\tools\\mcp-server\\index.js"],
      "env": {}
    }
  }
}
```

## Error Handling

All MCP server responses follow the JSON-RPC 2.0 specification. Errors are returned in this format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": "Error: Target directory is not a git repository"
  }
}
```

Success responses contain the result in the `result` field:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "✅ AGENT.md setup completed successfully!"
      }
    ]
  }
}
```