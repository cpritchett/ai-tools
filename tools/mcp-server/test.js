#!/usr/bin/env node

// Test script for the AI Tools MCP Server
// This simulates calling the MCP server functions directly

import { AIToolsMCPServer } from '../../dist/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log('🧪 Testing AI Tools MCP Server...\n');
  
  // Create a temporary test directory
  const testDir = path.join(__dirname, '../../tmp', 'mcp-test');
  
  try {
    // Clean up previous test if exists
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    
    // Create test directory and initialize git
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
    
    console.log(`📁 Created test directory: ${testDir}`);
    
    // Initialize git repository
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    await execAsync('git init');
    console.log('✅ Initialized git repository');
    
    // Create some sample AI tool config files to test backup functionality
    fs.writeFileSync('CLAUDE.md', '# Claude Instructions\n\nSome sample instructions for Claude.');
    fs.mkdirSync('.github', { recursive: true });
    fs.writeFileSync('.github/copilot-instructions.md', '# Copilot Instructions\n\nSome sample instructions for Copilot.');
    console.log('✅ Created sample config files');
    
    // Test the MCP server functionality
    const server = new AIToolsMCPServer();
    
    // Test 1: List supported tools
    console.log('\n🔍 Test 1: Listing supported tools...');
    const toolsResult = await server.listSupportedTools();
    console.log('✅ Supported tools listed successfully');
    
    // Test 2: Setup AGENT.md with default tools (claude and copilot)
    console.log('\n🔍 Test 2: Setting up AGENT.md...');
    const setupResult = await server.setupAgentMd({
      targetDirectory: testDir,
      enabledTools: ['claude', 'copilot']
    });
    console.log('✅ AGENT.md setup completed');
    
    // Test 3: Verify the setup
    console.log('\n🔍 Test 3: Verifying setup...');
    const verifyResult = await server.verifySetup({
      targetDirectory: testDir,
      tools: ['claude', 'copilot']
    });
    console.log('✅ Setup verification completed');
    
    // Test 4: Check files were created correctly
    console.log('\n🔍 Test 4: Checking file system...');
    const agentMdExists = fs.existsSync('AGENT.md');
    const claudeSymlink = fs.existsSync('CLAUDE.md') && fs.lstatSync('CLAUDE.md').isSymbolicLink();
    const copilotSymlink = fs.existsSync('.github/copilot-instructions.md') && fs.lstatSync('.github/copilot-instructions.md').isSymbolicLink();
    const backupDir = fs.existsSync('.agent-md-backups');
    
    console.log(`   AGENT.md exists: ${agentMdExists ? '✅' : '❌'}`);
    console.log(`   CLAUDE.md symlink: ${claudeSymlink ? '✅' : '❌'}`);
    console.log(`   Copilot symlink: ${copilotSymlink ? '✅' : '❌'}`);
    console.log(`   Backup directory: ${backupDir ? '✅' : '❌'}`);
    
    // Check backup files
    const backupFiles = fs.readdirSync('.agent-md-backups');
    console.log(`   Backup files: ${backupFiles.join(', ')}`);
    
    if (agentMdExists && claudeSymlink && copilotSymlink && backupDir) {
      console.log('\n🎉 All tests passed! MCP server is working correctly.');
      
      // Show the results
      console.log('\n📄 Setup Results:');
      console.log(setupResult.content[0].text);
      
      console.log('\n🔍 Verification Results:');
      console.log(verifyResult.content[0].text);
      
      return true;
    } else {
      console.log('\n❌ Some tests failed. Please check the implementation.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  } finally {
    // Return to original directory
    process.chdir(path.join(__dirname, '../..'));
  }
}

// Only run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { runTests };