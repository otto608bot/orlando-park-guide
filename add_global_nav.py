#!/usr/bin/env python3
"""
Script to add global navigation to all pages in the Orlando Park Guide.
"""

import os
import re
from pathlib import Path

# The global navigation CSS link to add to <head>
GLOBAL_CSS_LINK = '<link rel="stylesheet" href="/styles/global-nav.css">'

# The global header HTML to add after <body>
GLOBAL_HEADER = '''<header class="global-header">
  <div class="global-header-content">
    <button class="global-mobile-menu-btn" onclick="GlobalNav.openNav()" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <a href="/" class="global-logo">
      <img src="/logo-full.png" alt="Plan Your Park">
    </a>
    <nav class="global-nav">
      <a href="/" id="nav-rides">Rides</a>
      <a href="/character-dining.html" id="nav-dining">Character Dining</a>
      <a href="/blog/" id="nav-blog">Blog</a>
      <a href="/deals.html" id="nav-deals">Deals</a>
    </nav>
  </div>
</header>

<div class="global-mobile-nav-sheet" id="global-mobile-nav-sheet" onclick="GlobalNav.closeNav(event)">
  <div class="global-mobile-nav-content" onclick="event.stopPropagation()">
    <div class="global-mobile-nav-header">
      <h3>Menu</h3>
      <button class="global-close-nav-btn" onclick="GlobalNav.closeNav()">&times;</button>
    </div>
    <nav class="global-mobile-nav-links">
      <a href="/" id="mobile-nav-rides">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Rides
      </a>
      <a href="/character-dining.html" id="mobile-nav-dining">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M12 14v7"></path>
          <path d="M9 18h6"></path>
        </svg>
        Character Dining
      </a>
      <a href="/blog/" id="mobile-nav-blog">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        Blog
      </a>
      <a href="/deals.html" id="mobile-nav-deals">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        Deals
      </a>
    </nav>
  </div>
</div>
'''

# The global scripts to add before </body>
def get_global_scripts(page_name):
    return f'''<script src="/scripts/global-nav.js"></script>
<script>GlobalNav.init('{page_name}');</script>'''

# Determine page type based on filename
def get_page_name(filename):
    """Determine the page name for GlobalNav.init() based on filename."""
    fname = filename.lower()
    
    if 'character-dining' in fname or 'character_dining' in fname:
        return 'dining'
    elif 'blog' in fname:
        return 'blog'
    elif 'deal' in fname:
        return 'deals'
    elif fname.endswith('.html') and fname not in ['index.html']:
        # Park pages and other pages default to 'rides' since they're ride-related
        return 'rides'
    else:
        return 'rides'

def add_global_nav_to_file(filepath):
    """Add global navigation to a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has global-nav.css
    if 'global-nav.css' in content:
        print(f"  Skipping {filepath} - already has global nav")
        return False
    
    filename = os.path.basename(filepath)
    page_name = get_page_name(filename)
    
    # 1. Add CSS link before </head>
    if '</head>' in content:
        content = content.replace('</head>', f'  {GLOBAL_CSS_LINK}\n</head>')
    
    # 2. Replace old header with global header after <body>
    # First, check if there's an old header to remove
    header_patterns = [
        r'<header class="header">.*?</header>',
        r'<header>.*?</header>',
    ]
    
    for pattern in header_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Add global header after <body> tag
    body_match = re.search(r'(<body[^>]*>)', content)
    if body_match:
        body_tag = body_match.group(1)
        content = content.replace(body_tag, f'{body_tag}\n{GLOBAL_HEADER}')
    
    # 3. Add scripts before </body>
    scripts = get_global_scripts(page_name)
    if '</body>' in content:
        content = content.replace('</body>', f'{scripts}\n</body>')
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Updated {filepath} (page: {page_name})")
    return True

def main():
    base_dir = Path('/root/.openclaw/workspace/orlando-park-guide')
    
    # Files to update (relative to base_dir)
    files_to_update = [
        'animal-kingdom.html',
        'character-dining.html',
        'epcot.html',
        'hollywood-studios.html',
        'islands-of-adventure.html',
        'legoland-florida.html',
        'magic-kingdom.html',
        'park.html',
        'seaworld-orlando.html',
        'universal-studios-florida.html',
        'blog/best-character-dining-disney-world-2026.html',
        'blog/best-rides-5-year-olds-disney-world.html',
        'blog/best-rides-teens-islands-of-adventure.html',
        'blog/best-shows-disney-world-ranked.html',
        'blog/best-strollers-disney-world.html',
        'blog/disney-vs-universal-adults.html',
        'blog/disney-world-packing-list.html',
        'blog/hollywood-studios-worth-it-kids-under-five.html',
        'blog/how-to-use-genie-plus-disney-world-2026.html',
        'blog/pregnant-moms-guide-magic-kingdom.html',
        'blog/spring-break-disney-world-2026.html',
        'blog/toddler-rides-disney-world.html',
        'blog/universal-vs-disney-comparison.html',
    ]
    
    print("Adding global navigation to files...")
    updated = 0
    skipped = 0
    
    for rel_path in files_to_update:
        filepath = base_dir / rel_path
        if filepath.exists():
            if add_global_nav_to_file(filepath):
                updated += 1
            else:
                skipped += 1
        else:
            print(f"  File not found: {filepath}")
    
    print(f"\nDone! Updated {updated} files, skipped {skipped} files.")

if __name__ == '__main__':
    main()
