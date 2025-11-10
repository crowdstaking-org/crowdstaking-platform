/**
 * Landing Page E2E Tests
 * Tests critical user flows on the home page
 */

import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/CrowdStaking/)
    
    // Check hero heading is visible
    await expect(page.getByRole('heading', { name: /Where Ideas Become Startups/i })).toBeVisible()
  })

  test('should display main navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /Discover Projects/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /How It Works/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /About/i })).toBeVisible()
  })

  test('should navigate to Start Mission wizard', async ({ page }) => {
    await page.goto('/')
    
    // Click "Start Mission" button in hero
    await page.getByRole('link', { name: /Start Your Mission/i }).first().click()
    
    // Should navigate to wizard
    await expect(page).toHaveURL('/wizard')
    await expect(page.getByRole('heading', { name: /Launch Your Decentralized Venture/i })).toBeVisible()
  })

  test('should navigate to Discover Projects page', async ({ page }) => {
    await page.goto('/')
    
    // Click "Find Your Mission" button
    await page.getByRole('link', { name: /Find Your Mission/i }).first().click()
    
    // Should navigate to discover projects
    await expect(page).toHaveURL('/discover-projects')
    await expect(page.getByRole('heading', { name: /Discover High-Impact Projects/i })).toBeVisible()
  })

  test('should display main sections', async ({ page }) => {
    await page.goto('/')
    
    // Check key sections are rendered
    await expect(page.getByText(/Funded by Talent, Not VCs/i)).toBeVisible()
    await expect(page.getByText(/For Founders/i)).toBeVisible()
    await expect(page.getByText(/For Contributors/i)).toBeVisible()
  })

  test('should toggle theme', async ({ page }) => {
    await page.goto('/')
    
    // Find theme toggle button
    const themeButton = page.getByRole('button', { name: /toggle theme/i })
    await expect(themeButton).toBeVisible()
    
    // Click to toggle theme
    await themeButton.click()
    
    // Page should still be functional
    await expect(page.getByRole('heading', { name: /Where Ideas Become Startups/i })).toBeVisible()
  })
})

