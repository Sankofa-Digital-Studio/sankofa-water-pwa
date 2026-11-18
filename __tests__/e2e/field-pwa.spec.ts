import { test, expect } from '@playwright/test';

test.describe('Field Anti-Ghost-Work PWA (field-pwa.spec.ts)', () => {
  test('Stage advance blocked when GPS > 15m', async ({ page }) => {
    await page.goto('/field');

    // Simulate contractor moving away from excavation site (> 15m)
    const slider = page.locator('[data-testid="gps-distance-slider"]');
    await slider.fill('20');
    await slider.dispatchEvent('change');

    // Verify stage advance button is locked/disabled
    const stageButton = page.locator('[data-testid="stage-advance-btn-1"]');
    await expect(stageButton).toBeDisabled();

    // Verify geofence anti-ghost-work warning text
    await expect(page.locator('text=Outside 15m geofence')).toBeVisible();
  });

  test('Stage advance succeeds when GPS ≤ 15m', async ({ page }) => {
    await page.goto('/field');

    // Simulate contractor on-site (within 5m of pipe centerline)
    const slider = page.locator('[data-testid="gps-distance-slider"]');
    await slider.fill('5');
    await slider.dispatchEvent('change');

    // Verify stage advance button is unlocked and functional
    const stageButton = page.locator('[data-testid="stage-advance-btn-1"]');
    await expect(stageButton).toBeEnabled();
    await stageButton.click();

    // Verify stage 1 excavation verified banner or progression to stage 2
    await expect(page.locator('[data-testid="stage-complete-1"]')).toBeVisible();
  });

  test('Offline mode queues to IndexedDB', async ({ page }) => {
    await page.goto('/field');

    // Toggle offline field mode switch
    const offlineSwitch = page.locator('[data-testid="offline-switch"]');
    await offlineSwitch.click();

    // Ensure GPS is within geofence
    const slider = page.locator('[data-testid="gps-distance-slider"]');
    await slider.fill('5');
    await slider.dispatchEvent('change');

    // Advance stage in offline mode
    const stageButton = page.locator('[data-testid="stage-advance-btn-1"]');
    if (await stageButton.isVisible()) {
      await stageButton.click();
    }

    // Verify IndexedDB queued attestation count increments
    const queuedBadge = page.locator('[data-testid="queued-count-badge"]');
    await expect(queuedBadge).toContainText('1');
  });
});
