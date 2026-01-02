const { test, expect } = require('@playwright/test');

// Basic smoke test: open the app and verify key UI pieces
test('smoke: app loads and shows header (with mock session)', async ({ page }) => {
  // visit with a mock session id that the server treats as active
  await page.goto('http://127.0.0.1:5174/?session_id=MOCK_TEST_123');
  await expect(page.locator('text=Eternum Trading Journal')).toBeVisible();
});

test('smoke: position calculator present', async ({ page }) => {
  await page.goto('http://127.0.0.1:5174/');
  await expect(page.locator('text=Position Calculator')).toBeVisible();
});

test('smoke: trade entry form visible', async ({ page }) => {
  await page.goto('http://127.0.0.1:5174/');
  await expect(page.locator('text=Trade Entry')).toBeVisible();
});
