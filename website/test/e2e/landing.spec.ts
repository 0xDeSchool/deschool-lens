import { test } from '@playwright/test' // eslint-disable-line import/no-extraneous-dependencies

test('loads page landing', async ({ page }) => {
  await page.goto('http://localhost:3000/landing')
})
