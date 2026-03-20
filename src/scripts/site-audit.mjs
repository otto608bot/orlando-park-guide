import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://planyourpark.com';
const RESULTS = {
  timestamp: new Date().toISOString(),
  pages: [],
  errors: [],
  affiliateLinks: [],
  emailForms: [],
  seoIssues: []
};

async function auditPage(page, url, name) {
  console.log(`Auditing: ${name} (${url})`);
  
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response.status();
    
    if (status >= 400) {
      RESULTS.errors.push({ url, status, error: `HTTP ${status}` });
      return;
    }
    
    // Get page metadata
    const title = await page.title().catch(() => 'No title');
    const metaDesc = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No meta description');
    const h1 = await page.$eval('h1', el => el.textContent.trim()).catch(() => 'No H1');
    
    // Check for affiliate links
    const affiliateLinks = await page.$$eval('a[href*="undercovertourist"], a[href*="anrdoezrs"], a[href*="dpbolvw"], a[href*="tkqlhce"]', 
      links => links.map(l => ({ text: l.textContent.trim(), href: l.href })));
    
    // Check for email forms
    const emailForms = await page.$$eval('form[action*="formspree"], form[action*="email"]', 
      forms => forms.length);
    
    // Check for AdSense
    const hasAds = await page.$$eval('ins.adsbygoogle', ads => ads.length > 0);
    
    // Check for GA4
    const hasGA4 = await page.evaluate(() => typeof gtag !== 'undefined');
    
    // Check images without alt
    const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);
    
    RESULTS.pages.push({
      url,
      name,
      status,
      title: title.slice(0, 100),
      metaDesc: metaDesc.slice(0, 150),
      h1: h1.slice(0, 100),
      affiliateCount: affiliateLinks.length,
      emailForms,
      hasAds,
      hasGA4,
      imagesWithoutAlt
    });
    
    RESULTS.affiliateLinks.push(...affiliateLinks.map(l => ({ ...l, page: url })));
    
    if (imagesWithoutAlt > 0) {
      RESULTS.seoIssues.push({ url, issue: `${imagesWithoutAlt} images without alt text` });
    }
    
  } catch (error) {
    RESULTS.errors.push({ url, error: error.message });
  }
}

async function main() {
  console.log('🔍 Starting PlanYourPark.com Site Audit...\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const pagesToAudit = [
    { url: '/', name: 'Homepage' },
    { url: '/blog/', name: 'Blog Index' },
    { url: '/character-dining.html', name: 'Character Dining' },
    { url: '/magic-kingdom.html', name: 'Magic Kingdom' },
    { url: '/blog/best-character-dining-disney-world-2026.html', name: 'Character Dining Blog' },
    { url: '/blog/how-to-use-genie-plus-disney-world-2026.html', name: 'Genie+ Blog' },
    { url: '/blog/disney-vs-universal-adults.html', name: 'Disney vs Universal Blog' }
  ];
  
  for (const { url, name } of pagesToAudit) {
    await auditPage(page, `${BASE_URL}${url}`, name);
  }
  
  await browser.close();
  
  // Save results
  fs.writeFileSync('audit-results.json', JSON.stringify(RESULTS, null, 2));
  
  // Print summary
  console.log('\n📊 AUDIT SUMMARY');
  console.log('================');
  console.log(`Pages audited: ${RESULTS.pages.length}`);
  console.log(`Errors found: ${RESULTS.errors.length}`);
  console.log(`Total affiliate links: ${RESULTS.affiliateLinks.length}`);
  console.log(`SEO issues: ${RESULTS.seoIssues.length}`);
  
  console.log('\n💰 AFFILIATE LINKS BY PAGE:');
  RESULTS.pages.forEach(p => {
    console.log(`  ${p.name}: ${p.affiliateCount} links`);
  });
  
  console.log('\n🚨 ERRORS:');
  RESULTS.errors.forEach(e => console.log(`  ❌ ${e.url}: ${e.error}`));
  
  console.log('\n🔧 SEO ISSUES:');
  RESULTS.seoIssues.forEach(i => console.log(`  ⚠️  ${i.url}: ${i.issue}`));
  
  console.log('\n✅ Audit complete. Results saved to audit-results.json');
}

main().catch(console.error);
