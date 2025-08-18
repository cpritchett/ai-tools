# AGENT.md MCP Server

A Model Context Protocol (MCP) server that implements the [AGENT.md specification](https://ampcode.com/AGENT.md) for standardizing AI coding assistant configurations across development projects.

## 🎯 Overview

This MCP server provides programmatic access to AGENT.md setup functionality, enabling any MCP-compatible client to configure AI tool compatibility in repositories. It creates a unified configuration source that all major AI coding assistants can read, eliminating the need to maintain separate configuration files for each tool.

## ✨ Features

- **🔌 MCP Protocol Integration** - Standard interface for AI tool integration
- **🛡️ Safe Configuration Management** - Automatic backup and restore of existing configs
- **🔗 Symbolic Link Creation** - Proper relative paths for cross-directory compatibility
- **🧠 LLM Integration Prompts** - Generate merge prompts for intelligent config consolidation
- **✅ Setup Verification** - Validate configurations and repository state
- **🎯 8 AI Tool Support** - Claude, Copilot, Kiro, Cursor, Windsurf, Continue, Roo, Cline

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Start MCP Server

```bash
npm run mcp
# or
npm start
```

### Run Interactive Demo

```bash
npm run demo
```

### Run Tests

```bash
npm run test
```

### Build from TypeScript

```bash
npm run build
```

## 🔧 MCP Client Integration

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "agent-md": {
      "command": "node",
      "args": ["/path/to/agent-md-mcp-server/index.js"]
    }
  }
}
```

### Programmatic Usage

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client(transport);
await client.connect();

// Setup AGENT.md with specific tools
const result = await client.callTool({
  name: 'setup_agent_md',
  arguments: {
    targetDirectory: '/path/to/project',
    enabledTools: ['claude', 'copilot', 'cursor'],
    enableAll: false
  }
});
```

## 📖 Supported AI Tools

| Tool           | Configuration File                | Symbolic Link | Default |
| -------------- | --------------------------------- | ------------- | ------- |
| Claude Code    | `CLAUDE.md`                       | → `AGENT.md`  | ✅      |
| GitHub Copilot | `.github/copilot-instructions.md` | → `../AGENT.md` | ✅      |
| Kiro AI        | `.kiro/steering/project.md`       | → `../../AGENT.md` | ❌      |
| Cursor         | `.cursorrules`                    | → `AGENT.md`  | ❌      |
| Windsurf       | `.windsurfrules`                  | → `AGENT.md`  | ❌      |
| Continue       | `.continuerc.json`                | → `AGENT.md`  | ❌      |
| Roo            | `.roorc`                          | → `AGENT.md`  | ❌      |
| Cline          | `.clinerc`                        | → `AGENT.md`  | ❌      |

## 🛠️ Available MCP Tools

### `setup_agent_md`

Main setup function implementing complete AGENT.md specification setup.

**Parameters:**
- `targetDirectory` (optional): Target directory path (defaults to current directory)
- `enabledTools` (optional): Array of AI tools to enable (`["claude", "copilot", ...]`)
- `enableAll` (optional): Enable all AI tools (default: false)

### `list_supported_tools`

Returns comprehensive information about all supported AI tools.

### `backup_existing_configs`

Creates timestamped backups of existing AI tool configuration files.

**Parameters:**
- `targetDirectory` (optional): Target directory path
- `enabledTools`: Array of AI tools to backup

### `create_symlinks`

Creates symbolic links for AI tool compatibility.

**Parameters:**
- `targetDirectory` (optional): Target directory path  
- `enabledTools`: Array of AI tools to create symlinks for

### `verify_setup`

Validates AGENT.md setup and symlink integrity.

**Parameters:**
- `targetDirectory` (optional): Target directory path

### `generate_integration_prompt`

Generates LLM prompts for intelligently merging existing configurations.

**Parameters:**
- `targetDirectory` (optional): Target directory path
- `enabledTools`: Array of AI tools to analyze

## 🏗️ Project Structure

```text
agent-md-mcp-server/
├── README.md              # This documentation
├── index.ts               # TypeScript source (main server)
├── index.js               # Compiled JavaScript entry point
├── test.js                # Comprehensive test suite
├── demo.js                # Interactive demonstration
├── package.json           # Node.js package configuration
├── tsconfig.json          # TypeScript configuration
└── docs/                  # Additional documentation
    └── mcp-examples.md    # Usage examples
```

## 🎨 Philosophy

### Single Source of Truth

Instead of maintaining separate configuration files for each AI tool, this server enables a unified approach where all AI assistants read from a single `AGENT.md` file.

### Standards-Based

Implements the official [AGENT.md specification](https://ampcode.com/AGENT.md) to ensure future compatibility and interoperability across the AI tooling ecosystem.

### Safe Operations

Prioritizes safety with automatic backups, validation checks, and rollback capabilities before making any configuration changes.

### Developer Experience

Focuses on reducing friction and maintenance overhead while improving consistency and quality of AI-assisted development workflows.

## 🧪 Development

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Type Check

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

_Streamlining AI-assisted development through standardized configuration protocols._