# Blog Featured Images Setup

## Overview

All blog posts support optional featured images that are displayed:
- **Blog Listing Page:** As card headers with hover zoom effect
- **Blog Detail Page:** As hero image above article content
- **Mobile:** Fully responsive with proper aspect ratios

## Current Status

✅ **Database:** `featured_image` column added to `blog_posts` (nullable)  
✅ **Frontend:** Featured image display implemented (conditional rendering)  
✅ **Placeholder:** All 19 articles use placeholder SVG  
⏳ **Real Images:** Pending Pexels API key setup

## Quick Start: Add Real Images (Free Pexels API)

### 1. Get Free Pexels API Key

1. Visit: https://www.pexels.com/api/
2. Click "Get Started"
3. Sign up (free, takes 2 minutes)
4. Copy your API key from dashboard

### 2. Add to Environment

Add to `.env.local`:
```bash
PEXELS_API_KEY=your_pexels_api_key_here
```

### 3. Generate Images for All Articles

Run the batch script:
```bash
npx tsx scripts/generate-blog-images.ts
```

This will:
- Search Pexels for relevant images based on article tags
- Download images to `/public/blog/images/`
- Update database with image paths
- Show success/failure summary

**Expected Output:**
```
🎨 Blog Featured Images Generator
==================================
📚 Fetching blog posts...
✅ Found 19 blog posts
🎯 19 posts need images

📝 Processing: satoshi-principle-building-without-ceo
   Tags: satoshi-principle, decentralization, protocol-design...
   Keywords: satoshi principle + decentralization + protocol design
   ✅ Found image
   📥 Downloading image...
   ✅ Image downloaded
   ✅ Database updated: /blog/images/satoshi-principle-building-without-ceo.jpg

[... repeats for all articles ...]

📊 Summary:
   ✅ Success: 19 images
   ❌ Failed: 0 images
🎉 Done!
```

### 4. Verify

Visit http://localhost:3000/blog to see real images!

## How It Works

### Keyword Extraction Strategy

1. **Primary:** Uses first 2-3 tags from article
2. **Filtering:** Removes generic tags (e.g., "crowdstaking-alternative")
3. **Fallback:** If no tags, extracts keywords from title
4. **Generic Fallback:** "blockchain technology network" if all else fails

### Image Selection

- **Orientation:** Landscape only
- **Size:** Large (1280px width from Pexels)
- **Quality:** First result (Pexels ranks by relevance)
- **Format:** Saved as .jpg locally

### Fallback Strategy

If Pexels returns no results:
1. Tries generic "blockchain technology digital" search
2. If still no results, skips article (keeps placeholder)

## File Locations

```
/public/blog/images/
  ├── placeholder.svg              # Default placeholder (all articles use this initially)
  ├── [slug].jpg                   # Real images (after running script)
  └── ...

/scripts/
  └── generate-blog-images.ts      # Batch image generation script

/supabase-migrations/
  └── 012_add_featured_image_to_blog_posts.sql
```

## Manual Image Assignment

You can manually assign images via Supabase SQL Editor or Admin UI:

```sql
UPDATE blog_posts 
SET featured_image = '/blog/images/custom-image.jpg'
WHERE slug = 'article-slug';
```

## Troubleshooting

### Images Not Showing

1. **Check Database:** `SELECT slug, featured_image FROM blog_posts LIMIT 5;`
2. **Check File:** Verify file exists in `/public/blog/images/`
3. **Check Path:** Must start with `/blog/images/` (not `public/`)

### Script Fails

**"PEXELS_API_KEY not found"**
- Add key to `.env.local`
- Restart script

**"Failed to download image"**
- Check internet connection
- Verify Pexels API key is valid
- Try different keywords

### Build Warnings

If you see "Image with src ... was detected as LCP":
- This is informational only
- Images already use `priority` prop
- Safe to ignore

## API Limits

**Pexels Free Tier:**
- 200 requests per hour
- 20,000 requests per month
- More than enough for occasional re-generation

**Rate Limiting:**
Script includes 500ms delay between requests to avoid hitting limits.

## Future Enhancements

Potential improvements:
- [ ] Allow manual image selection in Admin UI
- [ ] Support for custom image uploads
- [ ] AI-generated images (DALL-E integration) for unique visuals
- [ ] Multiple image sizes/formats for performance
- [ ] Automatic regeneration when tags change

## Cost Analysis

**Current Setup (Pexels):**
- Cost: $0
- Quality: High (professional stock photos)
- Attribution: Not required
- Limits: 20k requests/month

**Alternative: DALL-E 3**
- Cost: ~$0.72 for all 19 articles (one-time)
- Quality: Unique, custom-generated
- Attribution: Not required
- Limits: OpenAI API limits

**Recommendation:** Start with Pexels (free), upgrade to DALL-E for specific articles that need unique visuals.

