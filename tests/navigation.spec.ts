/**
 * Navigation E2E Tests
 * Tests site-wide navigation functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to Discover Projects
    await page.getByRole('link', { name: /Discover Projects/i }).first().click()
    await expect(page).toHaveURL('/discover-projects')
    await expect(page.getByRole('heading', { name: /Discover High-Impact Projects/i })).toBeVisible()
    
    // Navigate to How It Works
    await page.getByRole('link', { name: /How It Works/i }).first().click()
    await expect(page).toHaveURL('/how-it-works')
    await expect(page.getByRole('heading', { name: /How CrowdStaking Works/i })).toBeVisible()
    
    // Navigate to About
    await page.getByRole('link', { name: /About/i }).first().click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: /About CrowdStaking/i })).toBeVisible()
    
    // Navigate back to home
    await page.getByRole('link', { name: /CrowdStaking/i }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('should have working mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Mobile menu should be hidden initially
    await expect(page.getByRole('link', { name: /Discover Projects/i }).first()).not.toBeVisible()
    
    // Click hamburger menu
    await page.getByRole('button', { name: /toggle mobile menu/i }).click()
    
    // Menu items should now be visible
    await expect(page.getByRole('link', { name: /Discover Projects/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /How It Works/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /About/i }).first()).toBeVisible()
    
    // Click a link
    await page.getByRole('link', { name: /How It Works/i }).first().click()
    
    // Should navigate
    await expect(page).toHaveURL('/how-it-works')
    
    // Menu should close after navigation
    await expect(page.getByRole('link', { name: /Discover Projects/i }).first()).not.toBeVisible()
  })

  test('should have persistent navigation across pages', async ({ page }) => {
    // Test that navigation stays visible on all pages
    const pages = [
      '/',
      '/discover-projects',
      '/how-it-works',
      '/about',
      '/wizard',
    ]
    
    for (const url of pages) {
      await page.goto(url)
      
      // Navigation should be visible
      await expect(page.getByRole('link', { name: /CrowdStaking/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /Discover Projects/i }).first()).toBeVisible()
    }
  })
})






