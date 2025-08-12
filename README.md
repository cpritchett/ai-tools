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
├── scripts/               # Automation scripts
│   ├── README.md          # Script-specific documentation
│   └── setup-agent-md.sh  # AGENT.md specification implementation
├── docs/                  # Documentation and guides
└── examples/              # Example configurations and usage
```

## 🛠️ Scripts

### setup-agent-md.sh

Implements the [AGENT.md specification](https://ampcode.com/AGENT.md) in any repository, creating a universal configuration file that all AI coding assistants can read.

**Quick Start:**
```bash
# Interactive setup
./scripts/setup-agent-md.sh

# Enable all AI tools
./scripts/setup-agent-md.sh --all

# Specific tools only
./scripts/setup-agent-md.sh --claude --copilot --cursor
```

**Features:**
- Supports 8+ major AI coding assistants
- Backs up existing configurations safely
- Generates LLM integration prompts for intelligent content merging
- Creates symbolic links for multi-tool compatibility
- Follows official AGENT.md specification

[**Full Documentation →**](scripts/README.md)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-tools
   ```

2. **Make scripts executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

3. **Run a script:**
   ```bash
   # Navigate to your target repository
   cd /path/to/your/repository
   
   # Run the AGENT.md setup script
   /path/to/ai-tools/scripts/setup-agent-md.sh --all
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

## 🔮 Future Scripts

This repository is designed to house additional AI development tools:

- **AI workflow automation scripts**
- **Configuration validation tools**
- **AI prompt management utilities**
- **Cross-tool compatibility helpers**
- **Development environment standardization**

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow the existing code structure and documentation style
2. Add comprehensive documentation for new scripts
3. Include usage examples and test cases
4. Ensure scripts are safe and non-destructive
5. Follow conventional commit message format

## 📄 License

MIT License - Feel free to use these tools in your projects.

## 🆘 Support

- **Issues**: Report bugs or request features via GitHub issues
- **Documentation**: Check script-specific README files in respective directories
- **Examples**: See the `examples/` directory for usage patterns

---

*Built to standardize and streamline AI-assisted development workflows.*