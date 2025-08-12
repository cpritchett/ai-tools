# AI Tools Configuration

Scripts and utilities for standardizing AI coding assistant configurations across development teams.

## Critical Development Rules

### MANDATORY Workflow

1. **ALWAYS** create feature/fix branches: `git checkout -b feature/description` or `git checkout -b fix/description`
2. **NEVER** commit directly to main branch
3. **ALWAYS** use conventional commit messages and commit early and often
4. **ALWAYS** create pull requests for all changes
5. **NEVER** merge without review

### Version Management

- **NEVER** use "latest" tags - always pin specific versions and digests
- **ALWAYS** specify exact versions in package.json, mise.toml, and Dockerfiles

### Testing Requirements

- **ALWAYS** follow test-driven development (TDD) principles when possible
- **ALWAYS** write tests before implementing features
- **ALWAYS** run tests before committing

## Project Structure

### Technology Stack

- **Runtime**: Node.js 22.17.0 (managed by mise)
- **Package Manager**: npm (for tooling and meta-scripts only)
- **Linting/Formatting**: Trunk.io
- **Environment Manager**: mise

### Key Directories

- `tools/` - Development and automation scripts
- `docs/` - Project documentation
- `examples/` - Usage examples and templates

## Essential Commands

### Setup

```bash
mise install          # Install Node.js 22.17.0
npm install           # Install development dependencies
```

### Code Quality

```bash
npm run lint          # Run trunk check
npm run format        # Run trunk fmt
npm run check         # Alias for lint
```

### Development

```bash
npm run trunk         # Direct trunk access
```

## Commit Message Format

Follow conventional commits specification:

```text
type(scope): short description

- Detailed explanation of changes
- Use bullet points for multiple changes
- Include context about why the change was needed
```

**Types**: feat, fix, docs, style, refactor, test, chore

## Code Standards

### File Organization

- Use clear, descriptive file and directory names
- Group related functionality together
- Maintain consistent directory structure

### Documentation

- Update README.md for user-facing changes
- Document all configuration options
- Include usage examples
- Keep CLAUDE.md updated with development context

### Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow principle of least privilege
- Validate all inputs

## Architecture Notes

### Core Components

- `tools/agent-setup/` - AGENT.md setup and configuration scripts
- `tools/configuration-management/` - Configuration management utilities
- `tools/workflow-automation/` - Development workflow automation

### Dependencies

- `@trunkio/launcher`: Code quality and linting (pinned to ^1.3.4)

### Environment Requirements

- Node.js >= 22.17.0
- mise for runtime management
- Git for version control
