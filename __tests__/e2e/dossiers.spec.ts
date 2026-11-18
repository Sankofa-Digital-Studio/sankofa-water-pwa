import { test, expect } from '@playwright/test';

test.describe('Strategic Stakeholder Dossiers (dossiers.spec.ts)', () => {
  test('Dossier signing form submits correctly', async ({ page }) => {
    await page.goto('/dossiers');

    // Handle authentication redirect if running in protected mode
    if (page.url().includes('/auth/login')) {
      const emailField = page.locator('input[type="email"]');
      if (await emailField.isVisible()) {
        await emailField.fill('director@matjhabeng.gov.za');
        await page.click('button[type="submit"]');
      }
      await page.goto('/dossiers');
    }

    // Locate signature block
    const signatureBlock = page.locator('[data-testid="signature-block"]');
    await expect(signatureBlock).toBeVisible();

    // Fill in LOI signatory fields
    await page.fill('[data-testid="input-signatory-name"]', 'Adv. T. Mokwena');
    await page.fill('[data-testid="input-signatory-title"]', 'Chief Financial Officer');
    await page.fill('[data-testid="input-signatory-email"]', 'mokwena@matjhabeng.gov.za');

    // Submit LOI signature
    await page.click('button[type="submit"]:has-text("Sign")');

    // Verify cryptographic signed record banner is displayed
    const signedBanner = page.locator('[data-testid="signed-record-banner"]');
    await expect(signedBanner).toBeVisible();
    await expect(signedBanner).toContainText('Adv. T. Mokwena');
    await expect(signedBanner).toContainText('Chief Financial Officer');
  });

  test('Print button triggers window.print', async ({ page }) => {
    await page.goto('/dossiers');

    // Mock window.print in page context
    await page.evaluate(() => {
      (window as any).__printTriggered = false;
      window.print = () => {
        (window as any).__printTriggered = true;
      };
    });

    // Click print current dossier button
    const printButton = page.locator('[data-testid="page-print-button"]');
    await expect(printButton).toBeVisible();
    await printButton.click();

    // Verify window.print was triggered
    const printTriggered = await page.evaluate(() => (window as any).__printTriggered);
    expect(printTriggered).toBe(true);
  });
});
