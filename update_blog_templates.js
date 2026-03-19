import fs from 'fs';
import path from 'path';

const blogDir = 'src/blog';

fs.readdirSync(blogDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const slug = file.replace('.html', '');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        // Clean the title to avoid YAML issues
        let title = titleMatch ? titleMatch[1].replace(/\"/g, '').replace(/\|/g, '-') : slug.replace(/-/g, ' ').replace(/\.html$/, '');
        
        const frontMatter = `---
layout: base.njk
title: "${title}"
description: Excerpt or description for the blog post.
permalink: /blog/${slug}/
---

`;
        
        // Extract content between <body> and </body>
        const bodyMatch = content.match(/<body>(.*?)<\/body>/s);
        if (bodyMatch) {
            content = frontMatter + bodyMatch[1];
        } else {
            content = frontMatter + content;
        }
        
        fs.writeFileSync(filePath, content);
        console.log('Updated:', file);
    }
});
