# setup-agent-md.sh

A script to implement the [AGENT.md specification](https://ampcode.com/AGENT.md) in any repository, creating a universal configuration file that all AI coding assistants can read.

## Overview

This script consolidates scattered AI tool-specific configuration files into a single source of truth (AGENT.md) and creates symbolic links for multi-tool compatibility. When existing instruction files are found, it backs them up and generates an LLM integration prompt to help merge their content into a comprehensive AGENT.md file.

## Supported AI Tools

- **Claude Code** (`CLAUDE.md`)
- **GitHub Copilot** (`.github/copilot-instructions.md`)
- **Kiro AI** (`.kiro/steering/project.md`)
- **Cursor** (`.cursorrules`)
- **Windsurf** (`.windsurfrules`)
- **Continue** (`.continuerc.json`)
- **Roo** (`.roorc`)
- **Cline** (`.clinerc`)

## Usage

### Interactive Mode (Default)
```bash
./setup-agent-md.sh
```
Shows a menu to select which AI tools to configure.

### Command Line Options
```bash
# Enable specific tools
./setup-agent-md.sh --claude --copilot --cursor

# Enable all supported tools
./setup-agent-md.sh --all

# Target specific directory
./setup-agent-md.sh --claude --copilot /path/to/repository

# Force interactive mode
./setup-agent-md.sh --interactive
```

### Available Flags
- `--claude` - Enable Claude Code compatibility
- `--copilot` - Enable GitHub Copilot compatibility  
- `--kiro` - Enable Kiro AI compatibility
- `--cursor` - Enable Cursor compatibility
- `--windsurf` - Enable Windsurf compatibility
- `--continue` - Enable Continue compatibility
- `--roo` - Enable Roo compatibility
- `--cline` - Enable Cline compatibility
- `--all` - Enable all AI tool compatibility
- `--interactive` - Show interactive menu (default if no flags given)

## How It Works

### 1. Backup Phase
- Creates `.agent-md-backups/` directory
- Backs up any existing AI instruction files before removing them
- Tracks which files were backed up

### 2. AGENT.md Creation
- Creates a template `AGENT.md` file if it doesn't exist
- Follows the official AGENT.md specification structure

### 3. Symlink Creation
- Creates symbolic links for selected AI tools pointing to `AGENT.md`
- Ensures all AI assistants read from the same configuration

### 4. LLM Integration (if backups exist)
- Generates a comprehensive integration prompt at `.agent-md-backups/integration-prompt.md`
- Includes all backed-up file contents with integration guidelines
- Provides step-by-step instructions for LLM-assisted content merging

## Example Workflow

### First-time Setup
```bash
./setup-agent-md.sh --all
# Creates AGENT.md template and symlinks
# Edit AGENT.md for your project
# Commit changes
```

### Migrating Existing Configs
```bash
./setup-agent-md.sh --claude --copilot
# 📦 Backing up existing CLAUDE.md
# 📦 Backing up existing .github/copilot-instructions.md
# 🤖 Generating LLM integration prompt...
# 📝 Integration prompt created at: .agent-md-backups/integration-prompt.md

# Follow the integration steps:
# 1. Copy content from .agent-md-backups/integration-prompt.md
# 2. Provide to your preferred LLM (Claude, GPT-4, etc.)
# 3. Replace template AGENT.md with LLM-generated version
# 4. Review and commit
```

## Requirements

- Git repository (script validates this before running)
- Bash shell
- Standard Unix utilities (`cp`, `mv`, `ln`, `mkdir`)

## Benefits

- **Single source of truth**: All AI assistants read from the same configuration
- **Reduced maintenance**: No more syncing multiple instruction files
- **Future-proof**: Follows emerging industry standard for AI tool configuration
- **Safe migration**: Backs up existing files before making changes
- **LLM-assisted integration**: Intelligent merging of existing configurations
- **Flexible**: Choose which tools to configure

## Repository Structure After Setup

```
your-repo/
├── AGENT.md                           # Main configuration file
├── CLAUDE.md -> AGENT.md              # Claude Code symlink
├── .cursorrules -> AGENT.md           # Cursor symlink
├── .windsurfrules -> AGENT.md         # Windsurf symlink
├── .roorc -> AGENT.md                 # Roo symlink
├── .clinerc -> AGENT.md               # Cline symlink
├── .continuerc.json -> AGENT.md       # Continue symlink
├── .github/
│   └── copilot-instructions.md -> ../AGENT.md  # Copilot symlink
├── .kiro/
│   └── steering/
│       └── project.md -> ../../AGENT.md        # Kiro symlink
└── .agent-md-backups/                 # Backup directory (if applicable)
    ├── integration-prompt.md          # LLM integration prompt
    ├── CLAUDE.md                      # Backup of original
    └── copilot-instructions.md        # Backup of original
```

## AGENT.md Specification

The generated AGENT.md follows the official specification with these sections:

1. **Project Overview** - Description, purpose, and key characteristics
2. **Development Workflow** - Git workflow, branching, commit standards  
3. **Build Commands** - Dependencies, setup, testing, linting commands
4. **Code Style** - Style guidelines and conventions
5. **Architecture** - Key components, structure, environment variables
6. **Testing** - Testing strategies, local testing procedures
7. **Security** - Security considerations and practices
8. **Documentation** - Documentation standards and key files

## Troubleshooting

### Permission Errors
Ensure the script is executable:
```bash
chmod +x setup-agent-md.sh
```

### Not a Git Repository
The script requires a git repository. Initialize one first:
```bash
git init
```

### Existing Symlinks
The script safely handles existing symlinks and won't overwrite them unless they're regular files.

### Integration Issues
If the LLM integration doesn't work as expected:
1. Check `.agent-md-backups/integration-prompt.md` for completeness
2. Try different LLM models or prompting approaches
3. Manually review and edit the generated AGENT.md
4. Refer to the original backup files in `.agent-md-backups/`