# AI Tools

A collection of scripts and utilities for standardizing AI coding assistant configurations and workflows across repositories.

## 🎯 Purpose

This repository provides tools to:
- Standardize AI assistant configurations using industry standards
- Automate setup and migration of AI tool configurations
- Reduce maintenance overhead across multiple repositories
- Improve consistency in AI-assisted development workflows

## 📁 Repository Structure

```
ai-tools/
├── README.md              # This file
├── tools/                 # AI development tools
│   ├── agent-setup/       # AGENT.md specification tools
│   │   ├── README.md      # Documentation
│   │   └── setup-agent-md.sh  # Setup script
│   ├── workflow-automation/    # Workflow automation tools
│   └── configuration-management/  # Configuration management tools
├── docs/                  # Documentation and guides
└── examples/              # Example configurations and usage
```

## 🛠️ Tools

### Agent Setup Tools

#### setup-agent-md.sh

Implements the [AGENT.md specification](https://ampcode.com/AGENT.md) in any repository, creating a universal configuration file that all AI coding assistants can read.

**Quick Start:**
```bash
# Interactive setup
./tools/agent-setup/setup-agent-md.sh

# Enable all AI tools
./tools/agent-setup/setup-agent-md.sh --all

# Specific tools only
./tools/agent-setup/setup-agent-md.sh --claude --copilot --cursor
```

**Features:**
- Supports 8+ major AI coding assistants
- Backs up existing configurations safely
- Generates LLM integration prompts for intelligent content merging
- Creates symbolic links for multi-tool compatibility
- Follows official AGENT.md specification

[**Full Documentation →**](tools/agent-setup/README.md)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-tools
   ```

2. **Make tools executable:**
   ```bash
   chmod +x tools/**/*.sh
   ```

3. **Run a tool:**
   ```bash
   # Navigate to your target repository
   cd /path/to/your/repository
   
   # Run the AGENT.md setup tool
   /path/to/ai-tools/tools/agent-setup/setup-agent-md.sh --all
   ```

## 📖 Supported AI Tools

| Tool | Configuration File | Status |
|------|-------------------|--------|
| Claude Code | `CLAUDE.md` | ✅ |
| GitHub Copilot | `.github/copilot-instructions.md` | ✅ |
| Kiro AI | `.kiro/steering/project.md` | ✅ |
| Cursor | `.cursorrules` | ✅ |
| Windsurf | `.windsurfrules` | ✅ |
| Continue | `.continuerc.json` | ✅ |
| Roo | `.roorc` | ✅ |
| Cline | `.clinerc` | ✅ |

## 🎨 Philosophy

### Single Source of Truth
Rather than maintaining separate configuration files for each AI tool, we advocate for a unified approach where all AI assistants read from the same configuration source.

### Standards-Based
We follow emerging industry standards like the [AGENT.md specification](https://ampcode.com/AGENT.md) to ensure future compatibility and interoperability.

### Safe Migration
Our tools prioritize safety by backing up existing configurations before making changes, and providing intelligent merging capabilities.

### Developer Experience
We focus on reducing friction and maintenance overhead while improving the consistency and quality of AI-assisted development.

## 🔮 Future Tools

This repository is designed to house additional AI development tools:

### Workflow Automation
- **CI/CD integration tools**
- **Automated code review helpers**
- **Development pipeline optimizers**

### Configuration Management
- **Configuration validation tools**
- **Cross-tool compatibility helpers**
- **Environment standardization utilities**

### Additional Categories
- **AI prompt management utilities**
- **Performance monitoring tools**
- **Integration testing frameworks**

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the existing code structure and documentation style
2. Add comprehensive documentation for new tools
3. Include usage examples and test cases
4. Ensure tools are safe and non-destructive
5. Follow conventional commit message format
6. Place tools in appropriate subdirectories

## 📄 License

MIT License - Feel free to use these tools in your projects.

## 🆘 Support

- **Issues**: Report bugs or request features via GitHub issues
- **Documentation**: Check tool-specific README files in respective directories
- **Examples**: See the `examples/` directory for usage patterns

---

*Built to standardize and streamline AI-assisted development workflows.*