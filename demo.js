#!/usr/bin/env node

// Quick demo of the MCP server functionality
import { AIToolsMCPServer } from './dist/index.js';
import process from 'process';

async function demo() {
  console.log('🎭 AI Tools MCP Server Demo\n');
  
  const server = new AIToolsMCPServer();
  
  try {
    // Test with the demo project
    const demoProjectPath = '/tmp/demo-project';
    
    console.log(`📁 Demo project: ${demoProjectPath}\n`);
    
    // 1. List supported tools
    console.log('1️⃣ Listing supported AI tools...');
    const toolsResult = await server.listSupportedTools();
    console.log(toolsResult.content[0].text);
    console.log();
    
    // 2. Setup AGENT.md with Claude and Copilot
    console.log('2️⃣ Setting up AGENT.md with Claude and Copilot...');
    const setupResult = await server.setupAgentMd({
      targetDirectory: demoProjectPath,
      enabledTools: ['claude', 'copilot']
    });
    console.log(setupResult.content[0].text);
    console.log();
    
    // 3. Verify the setup
    console.log('3️⃣ Verifying setup...');
    const verifyResult = await server.verifySetup({
      targetDirectory: demoProjectPath,
      tools: ['claude', 'copilot']
    });
    console.log(verifyResult.content[0].text);
    console.log();
    
    console.log('🎉 Demo completed successfully!');
    console.log('🔍 Check /tmp/demo-project to see the results:');
    console.log('   - AGENT.md (main configuration file)');
    console.log('   - CLAUDE.md → AGENT.md (symlink)');
    console.log('   - .github/copilot-instructions.md → ../AGENT.md (symlink)');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

demo();