const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Amazon Associates Link Generator
 * 
 * Usage:
 * 1. First run: node amazon-affiliate.js --login
 *    - Provides instructions for manual cookie extraction
 * 
 * 2. Normal run: node amazon-affiliate.js --search "portable fan" --category "baby-products"
 *    - Searches Amazon using saved session
 *    - Filters by rating, reviews, Prime
 *    - Generates affiliate links with your tracking ID
 */

const TRACKING_ID = 'planyourpark-20';
const COOKIE_FILE = path.join(__dirname, 'amazon-session.json');
const OUTPUT_DIR = path.join(__dirname, 'amazon-products');

// Product categories relevant to theme park visitors
const CATEGORIES = {
  'strollers': { search: 'lightweight travel stroller', category: 'baby-products' },
  'fans': { search: 'portable misting fan', category: 'home-garden' },
  'sunscreen': { search: 'sunscreen spray kids', category: 'beauty' },
  'shoes': { search: 'comfortable walking shoes women', category: 'fashion' },
  'bags': { search: 'clear stadium bag', category: 'fashion' },
  'chargers': { search: 'portable charger iphone', category: 'electronics' },
  'ponchos': { search: 'disposable rain ponchos', category: 'sports-outdoors' },
  'cooling': { search: 'cooling towel neck', category: 'sports-outdoors' }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveSession(cookies) {
  const storage = {
    cookies: cookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path,
      expires: c.expires || -1,
      httpOnly: c.httpOnly || false,
      secure: c.secure || false,
      sameSite: c.sameSite || 'Lax'
    })),
    origins: []
  };
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(storage, null, 2));
  console.log('✓ Session saved to amazon-session.json');
}

async function loadSession() {
  if (fs.existsSync(COOKIE_FILE)) {
    return JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
  }
  return null;
}

async function login() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Amazon Associates Login - Manual Method              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Since we're on a headless server, you'll need to:            ║
║                                                                ║
║  1. Open Chrome on your computer                              ║
║  2. Go to: https://www.amazon.com                             ║
║  3. Log in with: otto608bot@gmail.com                         ║
║  4. Complete 2FA when prompted                                ║
║  5. Navigate to https://affiliate-program.amazon.com/         ║
║  6. Open DevTools (F12) → Application/Storage → Cookies       ║
║  7. Find cookies for .amazon.com                              ║
║  8. Copy the following cookies:                               ║
║     - session-id                                              ║
║     - session-id-time                                         ║
║     - ubid-main                                               ║
║     - at-main (if present)                                    ║
║     - sess-at-main (if present)                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

  const sessionId = await ask('Enter session-id cookie value: ');
  const sessionTime = await ask('Enter session-id-time cookie value: ');
  const ubid = await ask('Enter ubid-main cookie value: ');
  
  const cookies = [
    { name: 'session-id', value: sessionId, domain: '.amazon.com', path: '/' },
    { name: 'session-id-time', value: sessionTime, domain: '.amazon.com', path: '/' },
    { name: 'ubid-main', value: ubid, domain: '.amazon.com', path: '/' }
  ];

  const atMain = await ask('Enter at-main cookie value (or press Enter to skip): ');
  if (atMain) {
    cookies.push({ name: 'at-main', value: atMain, domain: '.amazon.com', path: '/' });
  }

  const sessAt = await ask('Enter sess-at-main cookie value (or press Enter to skip): ');
  if (sessAt) {
    cookies.push({ name: 'sess-at-main', value: sessAt, domain: '.amazon.com', path: '/' });
  }

  await saveSession(cookies);
  console.log('\n✓ Login complete! You can now run searches.');
}

async function searchProducts(keyword, category = null) {
  const session = await loadSession();
  if (!session) {
    console.error('No session found. Run with --login first');
    process.exit(1);
  }

  console.log(`Launching browser (headless)...`);
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  const context = await browser.newContext({ 
    storageState: session,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log(`Searching for: "${keyword}"`);
  
  // Build search URL
  let searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  if (category) {
    searchUrl += `&i=${category}`;
  }
  
  console.log(`Navigating to: ${searchUrl}`);
  
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await delay(5000);
  
  // Check for CAPTCHA or blocking
  const pageTitle = await page.title();
  const pageContent = await page.content();
  
  if (pageContent.includes('captcha') || pageContent.includes('robot') || pageTitle.includes('Robot')) {
    console.log('⚠ Amazon is showing CAPTCHA or blocking. Session may need refresh.');
    await browser.close();
    return [];
  }
  
  console.log(`Page loaded: ${pageTitle}`);

  // Check if we're logged in
  const isLoggedIn = await page.evaluate(() => {
    return document.querySelector('#nav-link-accountList-nav-line-1')?.textContent?.includes('Hello') || 
           document.querySelector('[data-testid="associates-dashboard"]') !== null ||
           document.querySelector('#nav-your-amazon') !== null;
  });

  if (!isLoggedIn) {
    console.log('⚠ Warning: May not be logged in. Session might have expired.');
  }

  // Extract product data
  const products = await page.evaluate(() => {
    const items = [];
    const results = document.querySelectorAll('[data-component-type="s-search-result"]');
    
    results.forEach((result, index) => {
      if (index >= 10) return; // Limit to first 10
      
      const titleEl = result.querySelector('h2 a span, .s-size-mini span');
      const linkEl = result.querySelector('h2 a');
      const priceEl = result.querySelector('.a-price-whole, .a-price .a-offscreen');
      const ratingEl = result.querySelector('.a-icon-alt');
      const reviewsEl = result.querySelector('a[href*="#customerReviews"] span');
      const imageEl = result.querySelector('.s-image');
      const primeEl = result.querySelector('[aria-label*="Prime"], .s-prime');
      
      if (titleEl && linkEl) {
        const ratingText = ratingEl ? ratingEl.textContent : '';
        const ratingMatch = ratingText.match(/([\d.]+) out of 5/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
        
        const reviewsText = reviewsEl ? reviewsEl.textContent : '';
        const reviewsMatch = reviewsText.replace(/,/g, '').match(/(\d+)/);
        const reviews = reviewsMatch ? parseInt(reviewsMatch[1]) : 0;
        
        // Extract ASIN from data attribute or URL
        let asin = result.getAttribute('data-asin');
        if (!asin && linkEl.href) {
          const asinMatch = linkEl.href.match(/\/dp\/(\w{10})/);
          if (asinMatch) asin = asinMatch[1];
        }
        
        items.push({
          title: titleEl.textContent.trim(),
          asin: asin,
          link: linkEl.href,
          price: priceEl ? priceEl.textContent.trim() : 'N/A',
          rating: rating,
          reviews: reviews,
          image: imageEl ? imageEl.src : null,
          isPrime: !!primeEl
        });
      }
    });
    
    return items;
  });

  await browser.close();
  return products;
}

function filterProducts(products, minRating = 4.0, minReviews = 50) {
  return products.filter(p => {
    if (!p.rating || p.rating < minRating) return false;
    if (p.reviews < minReviews) return false;
    return true;
  });
}

function generateAffiliateLink(asin, trackingId) {
  if (!asin) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${trackingId}`;
}

function generateHTML(product, trackingId) {
  const affiliateLink = generateAffiliateLink(product.asin, trackingId);
  if (!affiliateLink) return '';
  
  return `
<div class="product-card">
  <a href="${affiliateLink}" target="_blank" rel="noopener noreferrer">
    <img src="${product.image}" alt="${product.title}" loading="lazy">
  </a>
  <div class="product-info">
    <h4><a href="${affiliateLink}" target="_blank" rel="noopener noreferrer">${product.title}</a></h4>
    <div class="product-meta">
      <span class="price">${product.price}</span>
      <span class="rating">⭐ ${product.rating} (${product.reviews.toLocaleString()} reviews)</span>
      ${product.isPrime ? '<span class="prime">✓ Prime</span>' : ''}
    </div>
  </div>
</div>`;
}

function generateTextLink(product, trackingId, context = '') {
  const affiliateLink = generateAffiliateLink(product.asin, trackingId);
  if (!affiliateLink) return '';
  
  if (context) {
    return `<a href="${affiliateLink}" target="_blank" rel="noopener noreferrer">${context}</a>`;
  }
  
  return `<a href="${affiliateLink}" target="_blank" rel="noopener noreferrer">${product.title}</a>`;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--login') {
    await login();
    rl.close();
    return;
  }

  if (command === '--search') {
    const keyword = args[1];
    const category = args.find(a => a.startsWith('--category='))?.split('=')[1];
    
    if (!keyword) {
      console.error('Usage: node amazon-affiliate.cjs --search "keyword" [--category=category]');
      process.exit(1);
    }

    const products = await searchProducts(keyword, category);
    const filtered = filterProducts(products);
    
    console.log(`\nFound ${products.length} products, ${filtered.length} passed filters\n`);
    
    if (filtered.length === 0 && products.length > 0) {
      console.log('No products met criteria. Showing top unfiltered results:\n');
      filtered.push(...products.slice(0, 5));
    }

    // Generate output
    const output = {
      searchTerm: keyword,
      date: new Date().toISOString(),
      products: filtered.map(p => ({
        ...p,
        affiliateLink: generateAffiliateLink(p.asin, TRACKING_ID),
        html: generateHTML(p, TRACKING_ID),
        textLink: generateTextLink(p, TRACKING_ID)
      }))
    };

    // Save to file
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const filename = `${keyword.replace(/\s+/g, '-')}-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, filename),
      JSON.stringify(output, null, 2)
    );

    // Print results
    console.log('=== TOP PRODUCTS ===\n');
    filtered.slice(0, 5).forEach((p, i) => {
      const link = generateAffiliateLink(p.asin, TRACKING_ID);
      console.log(`${i + 1}. ${p.title}`);
      console.log(`   Price: ${p.price} | Rating: ${p.rating}⭐ | Reviews: ${p.reviews.toLocaleString()}`);
      console.log(`   ASIN: ${p.asin}`);
      console.log(`   Link: ${link || 'N/A - missing ASIN'}`);
      console.log('');
    });

    console.log(`\n✓ Full results saved to: amazon-products/${filename}`);
    rl.close();
    return;
  }

  if (command === '--batch') {
    // Process all predefined categories
    for (const [name, config] of Object.entries(CATEGORIES)) {
      console.log(`\n--- Processing: ${name} ---`);
      try {
        const products = await searchProducts(config.search, config.category);
        const filtered = filterProducts(products);
        
        const output = {
          category: name,
          searchTerm: config.search,
          date: new Date().toISOString(),
          products: filtered.slice(0, 3).map(p => ({
            title: p.title,
            asin: p.asin,
            price: p.price,
            rating: p.rating,
            reviews: p.reviews,
            affiliateLink: generateAffiliateLink(p.asin, TRACKING_ID),
            html: generateHTML(p, TRACKING_ID)
          }))
        };

        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        fs.writeFileSync(
          path.join(OUTPUT_DIR, `${name}-products.json`),
          JSON.stringify(output, null, 2)
        );
        
        console.log(`✓ Saved ${Math.min(filtered.length, 3)} products for ${name}`);
      } catch (err) {
        console.error(`✗ Failed for ${name}:`, err.message);
      }
      await delay(3000); // Be nice to Amazon
    }
    
    console.log('\n✓ Batch complete!');
    rl.close();
    return;
  }

  console.log(`
Amazon Associates Link Generator

Usage:
  node amazon-affiliate.cjs --login
    Enter cookies manually from your browser

  node amazon-affiliate.cjs --search "keyword" [--category=category]
    Search for products and generate affiliate links

  node amazon-affiliate.cjs --batch
    Process all predefined categories

Categories available:
${Object.entries(CATEGORIES).map(([k, v]) => `  ${k}: "${v.search}"`).join('\n')}

Examples:
  node amazon-affiliate.cjs --search "travel stroller" --category=baby-products
  node amazon-affiliate.cjs --search "portable fan"
  node amazon-affiliate.cjs --batch
`);
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});

// Auto-login with provided credentials
async function autoLogin() {
  const cookies = [
    { name: 'session-id', value: '137-8562656-5296620', domain: '.amazon.com', path: '/' },
    { name: 'session-id-time', value: '2082787201l', domain: '.amazon.com', path: '/' },
    { name: 'ubid-main', value: '132-1227882-2967501', domain: '.amazon.com', path: '/' },
    { name: 'at-main', value: 'Atza|gQA9ktAWAwEBAD0aNJtyJg8zpy1LaSGnBNF30JV0cZMpNFd8RaSYoHXkJVEYELGltCRydhrnR0mBJGqduhsLZwMQJxl00Zelnihw68FhGCJmCNqi6lf8nHIOUYUGTeJdjDLSqOvKN_m4RtcR6nbqj9KfqEFPi2ioPCcI1mxPnd9D3DQ3xoIQbwQsiIoKLo_D89WIrboVWjTb2FdT6Fq91DCh2zs_tMK3052El8c6bOc9_LbpIB8CRHITGaMvf7q_zXlSl-XUZR6ZPfOfLQBNxsnlsgFNcYszzEWZU14XQP8uzA0aBRaIuwv8b8fCmRkwNN5HoSJT6wSxd1IeT7wxbiZKPZIbmkhWCI-mmwk7xu1WUQuO-7LCq-_G8q6R-Ao', domain: '.amazon.com', path: '/' },
    { name: 'sess-at-main', value: 'Qe+l6b0HMTwWlzXpnQDdVmlGx0kFAwvy5Ezkm3kw89o=', domain: '.amazon.com', path: '/' }
  ];
  
  await saveSession(cookies);
  console.log('✓ Session saved with provided credentials');
}

// Export for use
module.exports = { autoLogin };
