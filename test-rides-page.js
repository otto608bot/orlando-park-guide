const { chromium } = require('playwright');

async function testRidesPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  const results = {
    tests: [],
    errors: []
  };
  
  function log(test, passed, details = '') {
    results.tests.push({ test, passed, details });
    console.log(`${passed ? '✓' : '✗'} ${test}${details ? ': ' + details : ''}`);
  }
  
  try {
    // Test 1: Load rides.html
    console.log('\n=== Testing rides.html ===');
    await page.goto('http://localhost:8080/rides.html', { waitUntil: 'networkidle' });
    
    // Check if page loaded
    const title = await page.title();
    log('Page loads', title.includes('Rides'), title);
    
    // Check if table exists
    const tableExists = await page.locator('.rides-table').count() > 0;
    log('Rides table exists', tableExists);
    
    // Check if ride data loaded
    const rowCount = await page.locator('#rides-tbody tr').count();
    log('Ride rows loaded', rowCount > 0, `${rowCount} rides`);
    
    // Test 2: Modal functionality
    console.log('\n=== Testing Modal ===');
    
    // Click on first ride row
    await page.locator('#rides-tbody tr').first().click();
    await page.waitForTimeout(500);
    
    // Check if modal opened
    const modalVisible = await page.locator('#ride-modal.active').count() > 0;
    log('Modal opens on row click', modalVisible);
    
    // Check modal content
    const modalTitle = await page.locator('#modal-ride-name').textContent();
    log('Modal has ride name', modalTitle && modalTitle.length > 0, modalTitle);
    
    // Test close button
    await page.locator('.ride-modal-close').click();
    await page.waitForTimeout(300);
    const modalClosed = await page.locator('#ride-modal.active').count() === 0;
    log('Modal closes via X button', modalClosed);
    
    // Test 3: Navigation
    console.log('\n=== Testing Navigation ===');
    
    // Check desktop nav links
    const navLinks = await page.locator('.global-nav a').count();
    log('Desktop nav links present', navLinks >= 5, `${navLinks} links`);
    
    // Check mobile menu button
    const mobileMenuBtn = await page.locator('.global-mobile-menu-btn').count() > 0;
    log('Mobile menu button exists', mobileMenuBtn);
    
    // Test Parks dropdown
    await page.locator('#nav-parks').click();
    await page.waitForTimeout(200);
    const dropdownVisible = await page.locator('#parks-dropdown.active').count() > 0;
    log('Parks dropdown opens', dropdownVisible);
    
    // Test 4: Mobile responsive
    console.log('\n=== Testing Mobile Responsiveness ===');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    
    // Check mobile filter button visible
    const mobileFilterBtn = await page.locator('#global-filter-btn').isVisible();
    log('Mobile filter button visible', mobileFilterBtn);
    
    // Test mobile filter sheet
    await page.locator('#global-filter-btn').click();
    await page.waitForTimeout(300);
    const filterSheetVisible = await page.locator('#filter-mobile-sheet.active').count() > 0;
    log('Mobile filter sheet opens', filterSheetVisible);
    
    // Test 5: Console errors
    console.log('\n=== Checking Console Errors ===');
    const logs = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    log('No critical console errors', logs.length === 0, `${logs.length} errors`);
    
  } catch (error) {
    results.errors.push(error.message);
    console.error('Test error:', error.message);
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=== TEST SUMMARY ===');
  const passed = results.tests.filter(t => t.passed).length;
  const total = results.tests.length;
  console.log(`${passed}/${total} tests passed`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:', results.errors);
  }
  
  return results;
}

testRidesPage().then(results => {
  process.exit(results.tests.filter(t => !t.passed).length > 0 ? 1 : 0);
});
