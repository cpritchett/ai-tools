#!/usr/bin/env bash

set -euo pipefail

# setup-agent-md.sh
# Implements AGENT.md specification in any repository
# Usage: ./setup-agent-md.sh [options] [repository-path]
#   --claude         Enable Claude Code compatibility (CLAUDE.md)
#   --copilot        Enable GitHub Copilot compatibility (.github/copilot-instructions.md)
#   --kiro           Enable Kiro AI compatibility (.kiro/steering/project.md)
#   --cursor         Enable Cursor compatibility (.cursorrules)
#   --windsurf       Enable Windsurf compatibility (.windsurfrules)
#   --continue       Enable Continue compatibility (.continuerc.json)
#   --roo            Enable Roo compatibility (.roorc)
#   --cline          Enable Cline compatibility (.clinerc)
#   --all            Enable all AI tool compatibility
#   --interactive    Show interactive menu (default if no flags given)

# Parse command line arguments
CLAUDE=false
COPILOT=false
KIRO=false
CURSOR=false
WINDSURF=false
CONTINUE=false
ROO=false
CLINE=false
INTERACTIVE=true
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
	case $1 in
	--claude)
		CLAUDE=true
		INTERACTIVE=false
		shift
		;;
	--copilot)
		COPILOT=true
		INTERACTIVE=false
		shift
		;;
	--kiro)
		KIRO=true
		INTERACTIVE=false
		shift
		;;
	--cursor)
		CURSOR=true
		INTERACTIVE=false
		shift
		;;
	--windsurf)
		WINDSURF=true
		INTERACTIVE=false
		shift
		;;
	--continue)
		CONTINUE=true
		INTERACTIVE=false
		shift
		;;
	--roo)
		ROO=true
		INTERACTIVE=false
		shift
		;;
	--cline)
		CLINE=true
		INTERACTIVE=false
		shift
		;;
	--all)
		CLAUDE=true
		COPILOT=true
		KIRO=true
		CURSOR=true
		WINDSURF=true
		CONTINUE=true
		ROO=true
		CLINE=true
		INTERACTIVE=false
		shift
		;;
	--interactive)
		INTERACTIVE=true
		shift
		;;
	-*)
		echo "Unknown option $1"
		exit 1
		;;
	*)
		TARGET_DIR="$1"
		shift
		;;
	esac
done

# Set default target directory if not provided
TARGET_DIR="${TARGET_DIR:-$(pwd)}"

echo "👋 Hello! I'm your AI tools setup assistant."
echo "🎯 I'll help you implement the AGENT.md specification in: ${TARGET_DIR}"
echo ""

# Verify we're in a git repository
if [[ ! -d "${TARGET_DIR}/.git" ]]; then
	echo "❌ Hmm, I don't see a git repository here. Let me check..."
	echo "   ${TARGET_DIR} doesn't appear to be a git repository."
	echo "   💡 Try running 'git init' first, then run me again!"
	exit 1
fi

echo "✅ Great! I found a git repository. Let me analyze what's here..."

cd "${TARGET_DIR}"

# Create backup directory
BACKUP_DIR=".agent-md-backups"
mkdir -p "${BACKUP_DIR}"

# Interactive menu if no specific tools were selected
if [[ "${INTERACTIVE}" == "true" ]]; then
	echo ""
	echo "🤖 I can set up compatibility with several AI coding assistants."
	echo "   Let me know which ones you'd like me to configure:"
	echo ""
	echo "   💡 I'll create symbolic links so all tools read from the same AGENT.md file."
	echo ""

	# Claude Code
	echo "🔹 Claude Code (CLAUDE.md)"
	read -r -p "   Should I set this up? [Y/n]: " claude_choice
	[[ ${claude_choice,,} != "n" ]] && CLAUDE=true

	# GitHub Copilot
	echo "🔹 GitHub Copilot (.github/copilot-instructions.md)"
	read -r -p "   Should I set this up? [Y/n]: " copilot_choice
	[[ "${copilot_choice,,}" != "n" ]] && COPILOT=true

	# Kiro AI
	echo "🔹 Kiro AI (.kiro/steering/project.md)"
	read -r -p "   Should I set this up? [y/N]: " kiro_choice
	[[ ${kiro_choice,,} == "y" ]] && KIRO=true

	# Cursor
	echo "🔹 Cursor (.cursorrules)"
	read -r -p "   Should I set this up? [y/N]: " cursor_choice
	[[ ${cursor_choice,,} == "y" ]] && CURSOR=true

	# Windsurf
	echo "🔹 Windsurf (.windsurfrules)"
	read -r -p "   Should I set this up? [y/N]: " windsurf_choice
	[[ "${windsurf_choice,,}" == "y" ]] && WINDSURF=true

	# Continue
	echo "🔹 Continue (.continuerc.json)"
	read -r -p "   Should I set this up? [y/N]: " continue_choice
	[[ ${continue_choice,,} == "y" ]] && CONTINUE=true

	# Roo
	echo "🔹 Roo (.roorc)"
	read -r -p "   Should I set this up? [y/N]: " roo_choice
	[[ ${roo_choice,,} == "y" ]] && ROO=true

	# Cline
	echo "🔹 Cline (.clinerc)"
	read -r -p "   Should I set this up? [y/N]: " cline_choice
	[[ ${cline_choice,,} == "y" ]] && CLINE=true

	echo ""
	echo "Perfect! Let me get to work on that for you..."
fi

# Create AGENT.md if it doesn't exist
if [[ ! -f "AGENT.md" ]]; then
	echo ""
	echo "📝 I notice you don't have an AGENT.md file yet. Let me create one for you..."
	echo "   This will be the central configuration file that all AI assistants will read from."
	cat >AGENT.md <<'EOF'
# AGENT.md

This is a configuration file for AI coding assistants following the [AGENT.md specification](https://ampcode.com/AGENT.md).

## Project Overview

[Describe your project here - what it does, its purpose, and key characteristics]

## Development Workflow

**IMPORTANT**: Always use feature branches and pull requests for changes to this repository.

### Required Process:
1. **Create feature branch**: `git checkout -b feature/description` or `git checkout -b fix/description`
2. **Make changes**: Edit files as needed
3. **Commit changes**: Use conventional commit messages
4. **Push branch**: `git push -u origin branch-name`
5. **Create PR**: Use your preferred PR creation method
6. **Wait for review**: Do not merge directly to main

### Never:
- Commit directly to main branch
- Push changes without creating a PR first
- Merge without review (even if you have permissions)

### Commit Message Format:
```
type: short description

- Detailed explanation of changes
- Use bullet points for multiple changes
- Include context about why the change was needed
```

## Build Commands

### Dependencies
[List your project's dependencies here]

### Setup
```bash
# Add your setup commands here
```

### Testing
```bash
# Add your testing commands here
```

### Linting/Formatting
```bash
# Add your linting and formatting commands here
```

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
EOF
	echo "✅ Done! I've created a comprehensive AGENT.md template for you."
else
	echo ""
	echo "ℹ️  I see you already have an AGENT.md file. Great! I'll work with that."
fi

echo ""
echo "🔍 Now let me scan for any existing AI assistant configuration files..."
echo "   I'll safely back these up before creating the new unified setup."
BACKED_UP_FILES=()

# Claude Code compatibility
if [[ ${CLAUDE} == "true" ]]; then
	if [[ -f "CLAUDE.md" && ! -L "CLAUDE.md" ]]; then
		echo "   📦 Found existing CLAUDE.md - backing it up safely"
		cp "CLAUDE.md" "${BACKUP_DIR}/CLAUDE.md"
		BACKED_UP_FILES+=("CLAUDE.md")
		rm "CLAUDE.md"
	fi
fi

# GitHub Copilot compatibility
if [[ ${COPILOT} == "true" ]]; then
	if [[ -f ".github/copilot-instructions.md" && ! -L ".github/copilot-instructions.md" ]]; then
		echo "   📦 Found existing GitHub Copilot instructions - backing them up"
		cp ".github/copilot-instructions.md" "${BACKUP_DIR}/copilot-instructions.md"
		BACKED_UP_FILES+=(".github/copilot-instructions.md")
		rm ".github/copilot-instructions.md"
	fi
fi

# Kiro AI compatibility
if [[ ${KIRO} == "true" ]]; then
	if [[ -f ".kiro/steering/project.md" && ! -L ".kiro/steering/project.md" ]]; then
		echo "   📦 Found existing Kiro steering file - backing it up"
		cp ".kiro/steering/project.md" "${BACKUP_DIR}/kiro-steering-project.md"
		BACKED_UP_FILES+=(".kiro/steering/project.md")
		rm ".kiro/steering/project.md"
	fi
fi

# Cursor compatibility
if [[ ${CURSOR} == "true" ]]; then
	if [[ -f ".cursorrules" && ! -L ".cursorrules" ]]; then
		echo "   📦 Found existing Cursor rules - backing them up"
		cp ".cursorrules" "${BACKUP_DIR}/cursorrules"
		BACKED_UP_FILES+=(".cursorrules")
		rm ".cursorrules"
	fi
fi

# Windsurf compatibility
if [[ ${WINDSURF} == "true" ]]; then
	if [[ -f ".windsurfrules" && ! -L ".windsurfrules" ]]; then
		echo "   📦 Found existing Windsurf rules - backing them up"
		cp ".windsurfrules" "${BACKUP_DIR}/windsurfrules"
		BACKED_UP_FILES+=(".windsurfrules")
		rm ".windsurfrules"
	fi
fi

# Continue compatibility
if [[ ${CONTINUE} == "true" ]]; then
	if [[ -f ".continuerc.json" && ! -L ".continuerc.json" ]]; then
		echo "   📦 Found existing Continue config - backing it up"
		cp ".continuerc.json" "${BACKUP_DIR}/continuerc.json"
		BACKED_UP_FILES+=(".continuerc.json")
		rm ".continuerc.json"
	fi
fi

# Roo compatibility
if [[ ${ROO} == "true" ]]; then
	if [[ -f ".roorc" && ! -L ".roorc" ]]; then
		echo "   📦 Found existing Roo config - backing it up"
		cp ".roorc" "${BACKUP_DIR}/roorc"
		BACKED_UP_FILES+=(".roorc")
		rm ".roorc"
	fi
fi

# Cline compatibility
if [[ ${CLINE} == "true" ]]; then
	if [[ -f ".clinerc" && ! -L ".clinerc" ]]; then
		echo "   📦 Found existing Cline config - backing it up"
		cp ".clinerc" "${BACKUP_DIR}/clinerc"
		BACKED_UP_FILES+=(".clinerc")
		rm ".clinerc"
	fi
fi

# Create symbolic links for AI tool compatibility
echo ""
echo "🔗 Excellent! Now I'm creating the symbolic links..."
echo "   This ensures all your AI assistants read from the same AGENT.md configuration."

# Claude Code compatibility
if [[ ${CLAUDE} == "true" ]]; then
	if [[ ! -L "CLAUDE.md" ]]; then
		ln -sf AGENT.md CLAUDE.md
		echo "   ✅ Claude Code → AGENT.md"
	fi
fi

# GitHub Copilot compatibility
if [[ ${COPILOT} == "true" ]]; then
	mkdir -p .github
	if [[ ! -L ".github/copilot-instructions.md" ]]; then
		ln -sf ../AGENT.md .github/copilot-instructions.md
		echo "   ✅ GitHub Copilot → AGENT.md"
	fi
fi

# Kiro AI compatibility
if [[ ${KIRO} == "true" ]]; then
	mkdir -p .kiro/steering
	if [[ ! -L ".kiro/steering/project.md" ]]; then
		ln -sf ../../AGENT.md .kiro/steering/project.md
		echo "   ✅ Kiro AI → AGENT.md"
	fi
fi

# Cursor compatibility
if [[ ${CURSOR} == "true" ]]; then
	if [[ ! -L ".cursorrules" ]]; then
		ln -sf AGENT.md .cursorrules
		echo "   ✅ Cursor → AGENT.md"
	fi
fi

# Windsurf compatibility
if [[ ${WINDSURF} == "true" ]]; then
	if [[ ! -L ".windsurfrules" ]]; then
		ln -sf AGENT.md .windsurfrules
		echo "   ✅ Windsurf → AGENT.md"
	fi
fi

# Continue compatibility
if [[ ${CONTINUE} == "true" ]]; then
	if [[ ! -L ".continuerc.json" ]]; then
		ln -sf AGENT.md .continuerc.json
		echo "   ✅ Continue → AGENT.md"
	fi
fi

# Roo compatibility
if [[ ${ROO} == "true" ]]; then
	if [[ ! -L ".roorc" ]]; then
		ln -sf AGENT.md .roorc
		echo "   ✅ Roo → AGENT.md"
	fi
fi

# Cline compatibility
if [[ ${CLINE} == "true" ]]; then
	if [[ ! -L ".clinerc" ]]; then
		ln -sf AGENT.md .clinerc
		echo "   ✅ Cline → AGENT.md"
	fi
fi

# Verify symlinks
echo ""
echo "🔍 Verifying symbolic links..."
if [[ ${CLAUDE} == "true" ]]; then
	link_target=$(readlink CLAUDE.md 2>/dev/null) || link_target='NOT A SYMLINK'
	echo "CLAUDE.md → ${link_target}"
fi
if [[ ${COPILOT} == "true" ]]; then
	link_target=$(readlink .github/copilot-instructions.md 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".github/copilot-instructions.md → ${link_target}"
fi
if [[ ${KIRO} == "true" ]]; then
	link_target=$(readlink .kiro/steering/project.md 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".kiro/steering/project.md → ${link_target}"
fi
if [[ ${CURSOR} == "true" ]]; then
	link_target=$(readlink .cursorrules 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".cursorrules → ${link_target}"
fi
if [[ ${WINDSURF} == "true" ]]; then
	link_target=$(readlink .windsurfrules 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".windsurfrules → ${link_target}"
fi
if [[ ${CONTINUE} == "true" ]]; then
	link_target=$(readlink .continuerc.json 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".continuerc.json → ${link_target}"
fi
if [[ ${ROO} == "true" ]]; then
	link_target=$(readlink .roorc 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".roorc → ${link_target}"
fi
if [[ ${CLINE} == "true" ]]; then
	link_target=$(readlink .clinerc 2>/dev/null) || link_target='NOT A SYMLINK'
	echo ".clinerc → ${link_target}"
fi

# Generate LLM integration prompt if files were backed up
if [[ ${#BACKED_UP_FILES[@]} -gt 0 ]]; then
	echo ""
	echo "🧠 I found ${#BACKED_UP_FILES[@]} existing configuration file(s) to integrate!"
	echo "   Let me create an intelligent integration prompt for you..."

	PROMPT_FILE="${BACKUP_DIR}/integration-prompt.md"
	cat >"${PROMPT_FILE}" <<'EOF'
# AGENT.md Integration Prompt

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

EOF

	# List backed up files with their content
	for file in "${BACKED_UP_FILES[@]}"; do
		echo "### ${file}" >>"${PROMPT_FILE}"
		echo '```' >>"${PROMPT_FILE}"
		if [[ -f "${BACKUP_DIR}/$(basename "${file}")" ]]; then
			cat "${BACKUP_DIR}/$(basename "${file}")" >>"${PROMPT_FILE}"
		else
			# Handle files with path-based backup names
			for backup_file in "${BACKUP_DIR}"/*; do
				if [[ "$(basename "${backup_file}")" == *"$(basename "${file}" .md)"* ]] || [[ "$(basename "${backup_file}")" == *"$(basename "${file}" .json)"* ]]; then
					cat "${backup_file}" >>"${PROMPT_FILE}"
					break
				fi
			done
		fi
		echo '```' >>"${PROMPT_FILE}"
		echo "" >>"${PROMPT_FILE}"
	done

	cat >>"${PROMPT_FILE}" <<'EOF'

## Integration Guidelines

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

EOF

	echo ""
	echo "🎉 Perfect! I've created a comprehensive integration prompt for you."
	echo "   📄 You can find it at ${PROMPT_FILE}"
	echo ""
	echo "🤖 Here's what I recommend you do next:"
	echo ""
	echo "   1️⃣  Open the integration prompt file I created"
	echo "   2️⃣  Copy its contents to your favorite LLM (Claude, GPT-4, etc.)"
	echo "   3️⃣  Ask the LLM to generate an integrated AGENT.md file"
	echo "   4️⃣  Replace the template AGENT.md with the LLM's output"
	echo "   5️⃣  Review, refine, and commit your changes"
	echo ""
	echo "💡 The prompt includes all your backed-up configurations and detailed"
	echo "   integration guidelines following the AGENT.md specification!"
else
	echo ""
	echo "🎯 Great! Since you didn't have existing configs, you're all set!"
	echo ""
	echo "💻 Here's what you should do next:"
	echo ""
	echo "   1️⃣  Edit AGENT.md to customize it for your project"
	echo "   2️⃣  Add and commit your changes:"
	echo "      git add AGENT.md"
	[[ ${CLAUDE} == "true" ]] && echo "      git add CLAUDE.md"
	[[ ${COPILOT} == "true" ]] && echo "      git add .github/copilot-instructions.md"
	[[ ${KIRO} == "true" ]] && echo "      git add .kiro/"
	[[ ${CURSOR} == "true" ]] && echo "      git add .cursorrules"
	[[ ${WINDSURF} == "true" ]] && echo "      git add .windsurfrules"
	[[ ${CONTINUE} == "true" ]] && echo "      git add .continuerc.json"
	[[ ${ROO} == "true" ]] && echo "      git add .roorc"
	[[ ${CLINE} == "true" ]] && echo "      git add .clinerc"
	echo "      git commit -m 'feat: implement AGENT.md specification'"
fi

echo ""
echo "🎉 Mission accomplished! AGENT.md specification is now set up."
echo "✨ All your AI coding assistants will read from the same configuration!"
echo ""
echo "👋 Thanks for using the AI tools setup assistant. Happy coding!"
