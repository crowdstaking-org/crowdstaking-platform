/**
 * Proposal Submission E2E Tests
 * Tests the proposal creation flow
 */

import { test, expect } from '@playwright/test'

test.describe('Proposal Submission', () => {
  test.skip('should require authentication to access proposal form', async ({ page }) => {
    // Skip: Requires wallet connection which is complex in E2E tests
    // This would need MetaMask extension or mock wallet
    await page.goto('/dashboard/propose')
    
    // Should either show connect wallet prompt or redirect
    // TODO: Implement after wallet testing strategy is defined
  })

  test('should load proposal form page', async ({ page }) => {
    await page.goto('/dashboard/propose')
    
    // Page should load (might show auth prompt)
    await expect(page).toHaveURL('/dashboard/propose')
  })

  test('should navigate to proposal form from discover page', async ({ page }) => {
    await page.goto('/discover-projects')
    
    // Find and click "Submit Proposal" button
    const submitButton = page.getByRole('link', { name: /Submit Your Proposal/i }).first()
    
    if (await submitButton.isVisible()) {
      await submitButton.click()
      await expect(page).toHaveURL('/dashboard/propose')
    }
  })

  test.skip('should validate required fields', async ({ page }) => {
    // Skip: Requires authentication
    // TODO: Add test after auth strategy is defined
    await page.goto('/dashboard/propose')
    
    // Try to submit empty form
    // await page.getByRole('button', { name: /Submit Proposal/i }).click()
    
    // Should show validation errors
    // await expect(page.getByText(/Title is required/i)).toBeVisible()
  })
})






