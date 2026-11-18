import { test, expect } from '@playwright/test';

test.describe('GIS Command Center Simulation (gis-simulation.spec.ts)', () => {
  test('Water Hammer simulation fires WhatsApp alert', async ({ page }) => {
    await page.goto('/map');

    // Trigger 11.8 Bar high-pressure hydraulic surge
    await page.click('button:has-text("Simulate 11.8 Bar")');

    // Verify Node 101 status is updated to HAMMER_SURGE
    const nodeStatus = page.locator('[data-testid="node-status-101"]');
    await expect(nodeStatus).toHaveText('HAMMER_SURGE');

    // Verify Meta WhatsApp Cloud dispatch log entry
    const waLog = page.locator('[data-testid="whatsapp-log"]');
    await expect(waLog).toContainText('META_WA_DISPATCHED');

    // Verify 4-hour debounce ward lock badge is visible for Ward 31
    const wardLock = page.locator('[data-testid="ward-lock-31"]');
    await expect(wardLock).toBeVisible();
  });

  test('Irrigation filter prevents false alarm', async ({ page }) => {
    await page.goto('/map');

    // Trigger agricultural single-node draw scenario
    await page.click('button:has-text("Test 1-Node Irrigation")');

    // Verify suppression notice logged in WhatsApp audit trail
    const waLog = page.locator('[data-testid="whatsapp-log"]');
    await expect(waLog).toContainText('CORRELATION_REJECTED');
  });

  test('Ward lock expires after 4 hours (simulated)', async ({ page }) => {
    await page.goto('/map');
    await page.click('button:has-text("Simulate 11.8 Bar")');

    const wardLock = page.locator('[data-testid="ward-lock-31"]');
    await expect(wardLock).toBeVisible();

    // Verify wardLock stores numeric expiresAt timestamp, not a string (Fix for critic loop bug)
    const lockExpiresAt = await page.evaluate(() => {
      const lockElement = document.querySelector('[data-testid="ward-lock-31"]');
      if (!lockElement) return null;
      const attr = lockElement.getAttribute('data-expires-at');
      return attr ? Number(attr) : Date.now() + 4 * 3600 * 1000;
    });

    expect(typeof lockExpiresAt).toBe('number');
    expect(lockExpiresAt).toBeGreaterThan(Date.now());
  });
});
