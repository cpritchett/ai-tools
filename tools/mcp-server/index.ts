#!/usr/bin/env node

// MCP Server for AI Tools - AGENT.md Setup
// Implements the same functionality as setup-agent-md.sh but as an MCP server

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

const exec = promisify(execCallback);

// Supported AI tools configuration
const AI_TOOLS = {
  claude: {
    name: 'Claude Code',
    file: 'CLAUDE.md',
    description: 'Claude Code compatibility',
    defaultEnabled: true,
  },
  copilot: {
    name: 'GitHub Copilot',
    file: '.github/copilot-instructions.md',
    description: 'GitHub Copilot compatibility',
    defaultEnabled: true,
  },
  kiro: {
    name: 'Kiro AI',
    file: '.kiro/steering/project.md',
    description: 'Kiro AI compatibility',
    defaultEnabled: false,
  },
  cursor: {
    name: 'Cursor',
    file: '.cursorrules',
    description: 'Cursor compatibility',
    defaultEnabled: false,
  },
  windsurf: {
    name: 'Windsurf',
    file: '.windsurfrules',
    description: 'Windsurf compatibility',
    defaultEnabled: false,
  },
  continue: {
    name: 'Continue',
    file: '.continuerc.json',
    description: 'Continue compatibility',
    defaultEnabled: false,
  },
  roo: {
    name: 'Roo',
    file: '.roorc',
    description: 'Roo compatibility',
    defaultEnabled: false,
  },
  cline: {
    name: 'Cline',
    file: '.clinerc',
    description: 'Cline compatibility',
    defaultEnabled: false,
  },
};

const AGENT_MD_TEMPLATE = `# AGENT.md Configuration

This is a configuration file for AI coding assistants following the [AGENT.md specification](https://ampcode.com/AGENT.md).

## Project Overview

[Describe your project here - what it does, its purpose, and key characteristics]

## Development Workflow

**IMPORTANT**: Always use feature branches and pull requests for changes to this repository.

### Required Process:
1. **Create feature branch**: \`git checkout -b feature/description\` or \`git checkout -b fix/description\`
2. **Make changes**: Edit files as needed
3. **Commit changes**: Use conventional commit messages
4. **Push branch**: \`git push -u origin branch-name\`
5. **Create PR**: Use your preferred PR creation method
6. **Wait for review**: Do not merge directly to main

### Never:
- Commit directly to main branch
- Push changes without creating a PR first
- Merge without review (even if you have permissions)

### Commit Message Format:
\`\`\`
type: short description

- Detailed explanation of changes
- Use bullet points for multiple changes
- Include context about why the change was needed
\`\`\`

## Build Commands

### Dependencies
[List your project's dependencies here]

### Setup
\`\`\`bash
# Add your setup commands here
\`\`\`

### Testing
\`\`\`bash
# Add your testing commands here
\`\`\`

### Linting/Formatting
\`\`\`bash
# Add your linting and formatting commands here
\`\`\`

## Code Style

[Describe your code style guidelines here]

## Architecture

### Key Components:
[List and describe your main components/files]

### Environment Variables:
[Document any important environment variables]

## Testing

### Local Testing:
[Describe how to test locally]

### Test Strategy:
[Describe your testing approach]

## Security

[Document security considerations and practices]

## Documentation

### Key Files:
[List important documentation files]

### Documentation Guidelines:
[Describe documentation standards]
`;

class AIToolsMCPServer {
  private server: Server;
  private workingDirectory: string;

  constructor() {
    this.server = new Server(
      {
        name: 'ai-tools-mcp',
        version: '1.0.0',
        description: 'MCP Server for AI Tools - AGENT.md setup and configuration',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.workingDirectory = process.cwd();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'setup_agent_md',
          description: 'Set up AGENT.md specification with AI tool compatibility',
          inputSchema: {
            type: 'object',
            properties: {
              targetDirectory: {
                type: 'string',
                description: 'Target directory path (defaults to current directory)',
              },
              enabledTools: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of AI tools to enable (claude, copilot, kiro, cursor, windsurf, continue, roo, cline)',
              },
              enableAll: {
                type: 'boolean',
                description: 'Enable all AI tools',
                default: false,
              },
            },
          },
        },
        {
          name: 'list_supported_tools',
          description: 'List all supported AI tools and their configuration',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'backup_existing_configs',
          description: 'Backup existing AI tool configuration files',
          inputSchema: {
            type: 'object',
            properties: {
              targetDirectory: {
                type: 'string',
                description: 'Target directory path (defaults to current directory)',
              },
              tools: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of tools to backup configs for',
              },
            },
          },
        },
        {
          name: 'create_symlinks',
          description: 'Create symbolic links from AI tool configs to AGENT.md',
          inputSchema: {
            type: 'object',
            properties: {
              targetDirectory: {
                type: 'string',
                description: 'Target directory path (defaults to current directory)',
              },
              tools: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of tools to create symlinks for',
              },
            },
          },
        },
        {
          name: 'generate_integration_prompt',
          description: 'Generate LLM integration prompt for merging backed up configs',
          inputSchema: {
            type: 'object',
            properties: {
              backupDirectory: {
                type: 'string',
                description: 'Directory containing backed up config files',
              },
              backedUpFiles: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of backed up file paths',
              },
            },
          },
        },
        {
          name: 'verify_setup',
          description: 'Verify that the AGENT.md setup is correct',
          inputSchema: {
            type: 'object',
            properties: {
              targetDirectory: {
                type: 'string',
                description: 'Target directory path (defaults to current directory)',
              },
              tools: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of tools to verify',
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'setup_agent_md':
            return await this.setupAgentMd(args);
          case 'list_supported_tools':
            return await this.listSupportedTools();
          case 'backup_existing_configs':
            return await this.backupExistingConfigs(args);
          case 'create_symlinks':
            return await this.createSymlinks(args);
          case 'generate_integration_prompt':
            return await this.generateIntegrationPrompt(args);
          case 'verify_setup':
            return await this.verifySetup(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async setupAgentMd(args: any) {
    const targetDirectory = args.targetDirectory || this.workingDirectory;
    const enabledTools = args.enableAll 
      ? Object.keys(AI_TOOLS)
      : (args.enabledTools || Object.keys(AI_TOOLS).filter(tool => AI_TOOLS[tool as keyof typeof AI_TOOLS].defaultEnabled));

    // Validate target directory is a git repository
    if (!existsSync(path.join(targetDirectory, '.git'))) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error: ${targetDirectory} is not a git repository. Please run 'git init' first.`,
          },
        ],
      };
    }

    const results = [];
    results.push('👋 Hello! Setting up AGENT.md specification...');
    results.push(`🎯 Working in directory: ${targetDirectory}`);
    results.push('✅ Git repository detected');

    // Create backup directory
    const backupDir = path.join(targetDirectory, '.agent-md-backups');
    await fs.mkdir(backupDir, { recursive: true });

    // Create AGENT.md if it doesn't exist
    const agentMdPath = path.join(targetDirectory, 'AGENT.md');
    if (!existsSync(agentMdPath)) {
      await fs.writeFile(agentMdPath, AGENT_MD_TEMPLATE);
      results.push('✅ Created AGENT.md template');
    } else {
      results.push('ℹ️  AGENT.md already exists, working with it');
    }

    // Backup existing configs
    const backedUpFiles = [];
    for (const tool of enabledTools) {
      const toolConfig = AI_TOOLS[tool as keyof typeof AI_TOOLS];
      if (!toolConfig) continue;

      const configPath = path.join(targetDirectory, toolConfig.file);
      const backupPath = path.join(backupDir, path.basename(toolConfig.file));

      if (existsSync(configPath)) {
        const stats = await fs.lstat(configPath);
        if (!stats.isSymbolicLink()) {
          await fs.copyFile(configPath, backupPath);
          await fs.unlink(configPath);
          backedUpFiles.push(toolConfig.file);
          results.push(`📦 Backed up ${toolConfig.name} config`);
        }
      }
    }

    // Create symbolic links
    for (const tool of enabledTools) {
      const toolConfig = AI_TOOLS[tool as keyof typeof AI_TOOLS];
      if (!toolConfig) continue;

      const configPath = path.join(targetDirectory, toolConfig.file);
      const configDir = path.dirname(configPath);

      // Create directory if needed (for nested paths like .github/ or .kiro/steering/)
      if (configDir !== targetDirectory) {
        await fs.mkdir(configDir, { recursive: true });
      }

      if (!existsSync(configPath)) {
        // Calculate relative path from config directory to AGENT.md
        const relativePath = path.relative(configDir, path.join(targetDirectory, 'AGENT.md'));
        await fs.symlink(relativePath, configPath);
        results.push(`✅ ${toolConfig.name} → AGENT.md`);
      }
    }

    // Generate integration prompt if there were backups
    if (backedUpFiles.length > 0) {
      await this.generateIntegrationPromptInternal(backupDir, backedUpFiles);
      results.push('');
      results.push(`🧠 Found ${backedUpFiles.length} existing configuration file(s) to integrate!`);
      results.push(`📄 Integration prompt created at ${path.join(backupDir, 'integration-prompt.md')}`);
      results.push('');
      results.push('🤖 Recommended next steps:');
      results.push('   1️⃣  Review the integration prompt file');
      results.push('   2️⃣  Use an LLM to merge the backed-up configurations');
      results.push('   3️⃣  Update AGENT.md with the integrated content');
    } else {
      results.push('');
      results.push('🎯 No existing configs found - you\'re all set!');
      results.push('💻 Next: Edit AGENT.md to customize it for your project');
    }

    results.push('');
    results.push('🎉 AGENT.md specification setup complete!');
    results.push('✨ All AI coding assistants will read from the same configuration!');

    return {
      content: [
        {
          type: 'text',
          text: results.join('\n'),
        },
      ],
    };
  }

  private async listSupportedTools() {
    const toolsList = Object.entries(AI_TOOLS).map(([key, config]) => {
      return `🔹 **${config.name}** (${key})
   File: ${config.file}
   Description: ${config.description}
   Default enabled: ${config.defaultEnabled ? 'Yes' : 'No'}`;
    });

    return {
      content: [
        {
          type: 'text',
          text: `# Supported AI Tools\n\n${toolsList.join('\n\n')}`,
        },
      ],
    };
  }

  private async backupExistingConfigs(args: any) {
    const targetDirectory = args.targetDirectory || this.workingDirectory;
    const tools = args.tools || Object.keys(AI_TOOLS);

    const backupDir = path.join(targetDirectory, '.agent-md-backups');
    await fs.mkdir(backupDir, { recursive: true });

    const backedUpFiles = [];
    const results = [`🔍 Scanning for existing AI tool configurations in ${targetDirectory}...`];

    for (const tool of tools) {
      const toolConfig = AI_TOOLS[tool as keyof typeof AI_TOOLS];
      if (!toolConfig) continue;

      const configPath = path.join(targetDirectory, toolConfig.file);
      
      if (existsSync(configPath)) {
        const stats = await fs.lstat(configPath);
        if (!stats.isSymbolicLink()) {
          const backupPath = path.join(backupDir, path.basename(toolConfig.file));
          await fs.copyFile(configPath, backupPath);
          backedUpFiles.push(toolConfig.file);
          results.push(`📦 Backed up ${toolConfig.name} config`);
        } else {
          results.push(`ℹ️  ${toolConfig.name} config is already a symlink`);
        }
      }
    }

    if (backedUpFiles.length === 0) {
      results.push('✅ No existing configurations found to backup');
    }

    return {
      content: [
        {
          type: 'text',
          text: results.join('\n'),
        },
      ],
    };
  }

  private async createSymlinks(args: any) {
    const targetDirectory = args.targetDirectory || this.workingDirectory;
    const tools = args.tools || Object.keys(AI_TOOLS);

    const results = ['🔗 Creating symbolic links to AGENT.md...'];

    for (const tool of tools) {
      const toolConfig = AI_TOOLS[tool as keyof typeof AI_TOOLS];
      if (!toolConfig) continue;

      const configPath = path.join(targetDirectory, toolConfig.file);
      const configDir = path.dirname(configPath);

      // Create directory if needed
      if (configDir !== targetDirectory) {
        await fs.mkdir(configDir, { recursive: true });
      }

      if (!existsSync(configPath)) {
        // Calculate relative path from config directory to AGENT.md
        const relativePath = path.relative(configDir, path.join(targetDirectory, 'AGENT.md'));
        await fs.symlink(relativePath, configPath);
        results.push(`✅ ${toolConfig.name} → AGENT.md`);
      } else {
        const stats = await fs.lstat(configPath);
        if (stats.isSymbolicLink()) {
          const target = await fs.readlink(configPath);
          results.push(`ℹ️  ${toolConfig.name} already linked → ${target}`);
        } else {
          results.push(`⚠️  ${toolConfig.name} exists but is not a symlink`);
        }
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: results.join('\n'),
        },
      ],
    };
  }

  private async generateIntegrationPrompt(args: any) {
    const backupDirectory = args.backupDirectory;
    const backedUpFiles = args.backedUpFiles || [];

    await this.generateIntegrationPromptInternal(backupDirectory, backedUpFiles);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Integration prompt generated at ${path.join(backupDirectory, 'integration-prompt.md')}`,
        },
      ],
    };
  }

  private async generateIntegrationPromptInternal(backupDirectory: string, backedUpFiles: string[]) {
    const promptPath = path.join(backupDirectory, 'integration-prompt.md');
    
    let promptContent = `# AGENT.md Integration Prompt

You are tasked with integrating existing AI agent instruction files into a new AGENT.md file following the [AGENT.md specification](https://ampcode.com/AGENT.md).

## Task

Analyze the backed-up instruction files in this directory and merge their content into a comprehensive AGENT.md file that follows the standard specification structure.

## AGENT.md Specification Structure

The AGENT.md file should contain these sections:

1. **Project Overview** - Description, purpose, and key characteristics
2. **Development Workflow** - Git workflow, branching, commit standards
3. **Build Commands** - Dependencies, setup, testing, linting commands
4. **Code Style** - Style guidelines and conventions
5. **Architecture** - Key components, structure, environment variables
6. **Testing** - Testing strategies, local testing procedures
7. **Security** - Security considerations and practices  
8. **Documentation** - Documentation standards and key files

## Source Files

The following files have been backed up and should be integrated:

`;

    // Add content from each backed up file
    for (const file of backedUpFiles) {
      const backupPath = path.join(backupDirectory, path.basename(file));
      if (existsSync(backupPath)) {
        const content = await fs.readFile(backupPath, 'utf-8');
        promptContent += `### ${file}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    }

    promptContent += `## Integration Guidelines

1. **Preserve Important Information**: Don't lose any critical instructions, workflows, or configurations
2. **Follow AGENT.md Structure**: Organize content according to the specification sections
3. **Merge Similar Content**: Combine overlapping instructions into coherent sections
4. **Remove Tool-Specific References**: Make instructions universal rather than tool-specific
5. **Maintain Context**: Preserve project-specific knowledge and conventions
6. **Use Clear Language**: Ensure instructions are clear and actionable

## Output

Provide a complete AGENT.md file that:
- Follows the AGENT.md specification structure
- Integrates all relevant information from the source files
- Is comprehensive and ready to use
- Serves as a single source of truth for all AI coding assistants
`;

    await fs.writeFile(promptPath, promptContent);
  }

  private async verifySetup(args: any) {
    const targetDirectory = args.targetDirectory || this.workingDirectory;
    const tools = args.tools || Object.keys(AI_TOOLS);

    const results = ['🔍 Verifying AGENT.md setup...'];

    // Check if AGENT.md exists
    const agentMdPath = path.join(targetDirectory, 'AGENT.md');
    if (existsSync(agentMdPath)) {
      results.push('✅ AGENT.md exists');
    } else {
      results.push('❌ AGENT.md not found');
      return {
        content: [
          {
            type: 'text',
            text: results.join('\n'),
          },
        ],
      };
    }

    // Check symbolic links
    for (const tool of tools) {
      const toolConfig = AI_TOOLS[tool as keyof typeof AI_TOOLS];
      if (!toolConfig) continue;

      const configPath = path.join(targetDirectory, toolConfig.file);
      
      if (existsSync(configPath)) {
        const stats = await fs.lstat(configPath);
        if (stats.isSymbolicLink()) {
          const target = await fs.readlink(configPath);
          results.push(`✅ ${toolConfig.name} → ${target}`);
        } else {
          results.push(`⚠️  ${toolConfig.name} exists but is not a symlink`);
        }
      } else {
        results.push(`❌ ${toolConfig.name} not found`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: results.join('\n'),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AI Tools MCP Server running on stdio');
  }
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new AIToolsMCPServer();
  server.run().catch(console.error);
}

export { AIToolsMCPServer };