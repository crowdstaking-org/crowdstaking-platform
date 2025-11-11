/**
 * Script to generate featured images for blog posts using Pexels API
 * 
 * Features:
 * - Fetches relevant images from Pexels based on article tags
 * - Downloads images to /public/blog/images/
 * - Updates blog_posts.featured_image in database
 * - Automatic fallback to generic tech images if no results
 * 
 * Setup:
 * 1. Get free API key from https://www.pexels.com/api/
 * 2. Add to .env.local: PEXELS_API_KEY=your_key_here
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import * as https from 'https'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const pexelsApiKey = process.env.PEXELS_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../public/blog/images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

/**
 * Search Pexels for an image based on keywords
 */
async function searchPexelsImage(keywords: string[]): Promise<string | null> {
  if (!pexelsApiKey) {
    console.log('   ⚠️  PEXELS_API_KEY not set, skipping image fetch')
    return null
  }

  try {
    const query = keywords.join(' ')
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=large`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': pexelsApiKey
      }
    })
    
    if (!response.ok) {
      console.log(`   ⚠️  Pexels API error: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    if (data.photos && data.photos.length > 0) {
      // Return large version URL (1280px width)
      return data.photos[0].src.large
    }
    
    return null
  } catch (error: any) {
    console.log(`   ⚠️  Error searching Pexels: ${error.message}`)
    return null
  }
}

/**
 * Download image from URL to local filesystem
 */
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath)
    
    https.get(url, (response) => {
      response.pipe(file)
      
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
      
      file.on('error', (err) => {
        fs.unlinkSync(filepath)
        console.log(`   ❌ Download error: ${err.message}`)
        resolve(false)
      })
    }).on('error', (err) => {
      fs.unlinkSync(filepath)
      console.log(`   ❌ Download error: ${err.message}`)
      resolve(false)
    })
  })
}

/**
 * Extract meaningful keywords from article tags
 * Filters out generic tags, prioritizes descriptive ones
 */
function extractKeywords(tags: string[], title: string): string[] {
  // Generic tags to avoid (too broad for image search)
  const genericTags = ['crowdstaking-alternative', 'web3-native', 'future-of-work', 'systemic-change']
  
  // Filter out generic tags
  const specificTags = tags.filter(tag => !genericTags.includes(tag))
  
  // Convert kebab-case to space-separated words
  const keywords = specificTags
    .slice(0, 3) // Max 3 tags
    .map(tag => tag.replace(/-/g, ' '))
  
  // Add fallback keywords if too few
  if (keywords.length === 0) {
    // Extract key concept from title
    if (title.toLowerCase().includes('bitcoin') || title.toLowerCase().includes('satoshi')) {
      keywords.push('bitcoin cryptocurrency')
    } else if (title.toLowerCase().includes('venture') || title.toLowerCase().includes('funding')) {
      keywords.push('business startup funding')
    } else {
      keywords.push('blockchain technology network')
    }
  }
  
  return keywords
}

/**
 * Process a single blog post: fetch image, download, update DB
 */
async function processBlogPost(post: any, usePlaceholder: boolean): Promise<boolean> {
  console.log(`\n📝 Processing: ${post.slug}`)
  console.log(`   Tags: ${post.tags.join(', ')}`)
  
  // If no API key, use placeholder
  if (usePlaceholder) {
    console.log('   📋 Using placeholder image')
    const imagePath = '/blog/images/placeholder.svg'
    
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        featured_image: imagePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id)
    
    if (error) {
      console.log(`   ❌ DB update error: ${error.message}`)
      return false
    }
    
    console.log(`   ✅ Database updated: ${imagePath}`)
    return true
  }
  
  // Extract keywords from tags
  const keywords = extractKeywords(post.tags, post.title)
  console.log(`   Keywords: ${keywords.join(' + ')}`)
  
  // Search Pexels for image
  const imageUrl = await searchPexelsImage(keywords)
  
  if (!imageUrl) {
    console.log('   ⚠️  No image found, trying fallback...')
    // Fallback to generic tech/blockchain image
    const fallbackUrl = await searchPexelsImage(['blockchain', 'technology', 'digital'])
    
    if (!fallbackUrl) {
      console.log('   ❌ No fallback image found either, skipping')
      return false
    }
    
    console.log('   ✅ Using fallback image')
    return await saveImageToPost(post, fallbackUrl)
  }
  
  console.log('   ✅ Found image')
  return await saveImageToPost(post, imageUrl)
}

/**
 * Download image and update database
 */
async function saveImageToPost(post: any, imageUrl: string): Promise<boolean> {
  // Download image
  const filename = `${post.slug}.jpg`
  const filepath = path.join(imagesDir, filename)
  
  console.log('   📥 Downloading image...')
  const downloaded = await downloadImage(imageUrl, filepath)
  
  if (!downloaded) {
    return false
  }
  
  console.log('   ✅ Image downloaded')
  
  // Update database
  const imagePath = `/blog/images/${filename}`
  
  const { error } = await supabase
    .from('blog_posts')
    .update({ 
      featured_image: imagePath,
      updated_at: new Date().toISOString()
    })
    .eq('id', post.id)
  
  if (error) {
    console.log(`   ❌ DB update error: ${error.message}`)
    return false
  }
  
  console.log(`   ✅ Database updated: ${imagePath}`)
  return true
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Blog Featured Images Generator')
  console.log('==================================\n')
  
  if (!pexelsApiKey) {
    console.log('⚠️  PEXELS_API_KEY not found in .env.local')
    console.log('   Using placeholder images for testing\n')
    console.log('📝 To use real images:')
    console.log('   1. Get free API key from https://www.pexels.com/api/')
    console.log('   2. Add to .env.local: PEXELS_API_KEY=your_key_here')
    console.log('   3. Run this script again\n')
  }
  
  // Fetch all published blog posts
  console.log('📚 Fetching blog posts...')
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, tags, featured_image')
    .eq('status', 'published')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.log(`❌ Error fetching posts: ${error.message}`)
    process.exit(1)
  }
  
  console.log(`✅ Found ${posts.length} blog posts\n`)
  
  // Filter posts that don't have an image yet
  const postsNeedingImages = posts.filter(p => !p.featured_image)
  
  if (postsNeedingImages.length === 0) {
    console.log('✅ All posts already have featured images!')
    process.exit(0)
  }
  
  console.log(`🎯 ${postsNeedingImages.length} posts need images\n`)
  
  // Determine if we should use placeholder
  const usePlaceholder = !pexelsApiKey
  
  // Process each post
  let success = 0
  let failed = 0
  
  for (const post of postsNeedingImages) {
    const result = await processBlogPost(post, usePlaceholder)
    if (result) {
      success++
    } else {
      failed++
    }
    
    // Rate limiting: Wait 500ms between requests (only needed with API)
    if (!usePlaceholder) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  console.log('\n📊 Summary:')
  console.log(`   ✅ Success: ${success} images`)
  console.log(`   ❌ Failed: ${failed} images`)
  console.log('\n🎉 Done!')
}

main().catch(console.error)

