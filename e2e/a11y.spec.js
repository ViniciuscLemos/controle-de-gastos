import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// automatic accessibility check (contrast, labels, names...) in light and dark mode,
// with and without data, since the list, chart and filters only show up with entries

async function audit(page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  return result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
}

for (const scheme of ['light', 'dark']) {
  test.describe(`${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    test('no accessibility problems when empty', async ({ page }) => {
      await page.goto('./');
      expect(await audit(page)).toEqual([]);
    });

    test('no accessibility problems with the sample data', async ({ page }) => {
      await page.clock.setFixedTime(new Date('2026-10-15T12:00:00'));
      await page.goto('./');
      await page.getByRole('button', { name: 'Load sample data' }).click();
      await expect(page.locator('.entry-list')).toBeVisible();
      expect(await audit(page)).toEqual([]);
    });
  });
}
