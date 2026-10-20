import { test, expect } from '@playwright/test'

// Skip the boot animation and keep effects predictable in every test.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('portfolio-booted', 'true')
    localStorage.setItem('portfolio-lang', 'en')
  })
  // External thumbnails and fonts are not part of what we test.
  await page.route(/^https:\/\/(i\.ytimg\.com|opengraph\.githubassets\.com|fonts\.)/, (route) =>
    route.abort(),
  )
})

test('home page loads without errors and shows the MSc distinction', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('./')

  await expect(page).toHaveTitle(/Cristian Paraschiv/)
  await expect(page.locator('.hero-edu')).toContainText('DISTINCTION')
  await expect(page.locator('#experience')).toBeVisible()
  expect(errors).toEqual([])
})

test('case study opens, updates the URL and closes with Escape', async ({ page }) => {
  await page.goto('./')

  const cta = page.locator('.project-cta').first()
  await cta.click()
  await expect(page.locator('.modal-card')).toBeVisible()
  await expect(page).toHaveURL(/#project=3ks-judo-club-website$/)

  await page.keyboard.press('Escape')
  await expect(page.locator('.modal-card')).toHaveCount(0)
  await expect(page).not.toHaveURL(/#project=/)
  await expect(cta).toBeFocused()
})

test('a shared project link opens that case study directly', async ({ page }) => {
  await page.goto('./#project=plant-leaf-disease-classification')

  await expect(page.locator('.modal-card h3')).toHaveText(/Plant Leaf Disease Classification/i)
})

test('mobile menu opens and closes, and the page does not scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('./')

  const links = page.locator('.nav-links')
  await expect(links).toBeHidden()
  await page.locator('.menu-toggle').click()
  await expect(links).toBeVisible()
  await links.getByRole('link', { name: /projects/i }).click()
  await expect(links).toBeHidden()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('switching to Romanian translates the page and the CV link', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('.cv-link')).toHaveAttribute('href', /Cristian-Paraschiv-CV\.pdf$/)

  await page.locator('.lang-toggle').click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'ro')
  await expect(page.locator('#education h2')).toContainText(/Educație/i)
  await expect(page.locator('.cv-link')).toHaveAttribute('href', /Cristian-Paraschiv-CV-RO\.pdf$/)
})

test('static files are published', async ({ request }) => {
  for (const path of [
    'Cristian-Paraschiv-CV.pdf',
    'Cristian-Paraschiv-CV-RO.pdf',
    'robots.txt',
    'sitemap.xml',
    '404.html',
    'og-image.png',
  ]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
  }
})
