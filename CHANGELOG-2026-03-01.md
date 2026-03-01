# Deploy Changelog - March 1, 2026

## 🚀 Production Deploy - 7:00 PM CT

### Performance Improvements
- **Image Optimization**: Converted all blog hero images to WebP format
  - Best Rides: 5.82MB → 122KB (98% reduction)
  - Pregnant Mom: 9.46MB → 205KB (97% reduction)
  - Universal vs Disney: 7.72MB → 125KB (98% reduction)
  - New Toddler post: Generated at 117KB
- **Mobile Experience**: Added `<picture>` element with WebP primary, PNG fallback

### New Features
- **Mobile Navigation**: Hamburger menu for tablet/mobile (<1024px)
  - Slide-out navigation panel
  - Quick access to Rides and Blog
  - Fixes blog being inaccessible on mobile
- **Image Generation Pipeline**: Automated Imagen 4 integration
  - `scripts/generate-blog-image.mjs` for hero images
  - Auto-generates prompts from blog titles
  - Outputs optimized 16:9 WebP images

### New Content
- **Blog Post**: "Best Toddler Rides at Disney World"
  - 10+ toddler-friendly rides across all parks
  - Rider Switch tips for families
  - Parent-tested advice
  - AI-generated hero image (Imagen 4)

### Technical
- Added `@google/genai` dependency for Imagen API
- Created `scripts/optimize-images.sh` for batch image processing
- Updated Trello workflow documentation

### SEO
- Faster page loads (image size reduction)
- Better mobile UX = improved mobile rankings
- New toddler-focused content targets "toddler rides disney world" keywords

---

**Pre-deploy Checklist:**
- [ ] Review deploy preview
- [ ] Check mobile navigation on iOS/Android
- [ ] Verify all blog images load
- [ ] Test affiliate links
- [ ] Confirm analytics tracking

**Post-deploy:**
- [ ] Monitor Core Web Vitals
- [ ] Check for 404s
- [ ] Submit sitemap to Google
