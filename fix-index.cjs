#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = '/root/.openclaw/workspace/orlando-park-guide';

// Fix blog/index.html
const filePath = path.join(baseDir, 'blog/index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Remove the inline style block for global navigation
const stylePattern = /\s*\u003c!-- Global Navigation Component --\u003e\s*\u003cstyle\u003e[\s\S]*?\/\* Mobile Breakpoint \*\/[\s\S]*?\}\s*\}\s*\u003c\/style\u003e/;
content = content.replace(stylePattern, '');

// Clean up extra blank lines
content = content.replace(/\n\n\n+/g, '\n\n');

fs.writeFileSync(filePath, content);
console.log('Fixed blog/index.html');
