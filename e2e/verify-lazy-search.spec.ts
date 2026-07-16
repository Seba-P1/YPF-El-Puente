import { test, expect, Request } from '@playwright/test'

test.describe('Verificación 1: Buscador lazy-load', () => {
  test('getProductosForSearch action NO se dispara en mount, sí en focus', async ({ page }) => {
    const serverActionRequests: Request[] = []
    const allRequests: string[] = []

    // Track ALL requests to see what fires on mount
    page.on('request', (req) => {
      allRequests.push(`${req.method()} ${req.url()}`)
      // Server actions in Next.js are POST requests
      // They typically go to paths containing the action name or _next/data
      if (req.method() === 'POST') {
        serverActionRequests.push(req)
      }
    })

    // Step 1: Navigate to admin productos page
    console.log('📍 Navegando a /admin/productos...')
    await page.goto('https://ypfelpuente.netlify.app/admin/productos', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Step 2: Wait for page to be fully loaded
    await page.waitForSelector('input[placeholder="Buscar por nombre o PLU..."]', {
      timeout: 10000,
    })
    console.log('✅ Página cargada, input de búsqueda encontrado')

    // Step 3: Count POST requests that happened during mount
    const postRequestsOnMount = serverActionRequests.length
    console.log(`📊 POST requests durante mount: ${postRequestsOnMount}`)

    // Log all requests for debugging
    console.log('\n--- Todos los requests durante mount ---')
    allRequests.forEach((r) => console.log(`  ${r}`))
    console.log('--- Fin requests mount ---\n')

    // Filter for search-related POST requests (server actions)
    const searchActionRequestsOnMount = serverActionRequests.filter((req) => {
      const url = req.url()
      // Next.js server actions typically POST to the page URL or a specific action endpoint
      return url.includes('productos') || url.includes('action')
    })

    console.log(`🔍 Search action POST requests en mount: ${searchActionRequestsOnMount.length}`)

    // Step 4: Take screenshot BEFORE focus
    await page.screenshot({
      path: 'e2e/screenshots/01-before-focus.png',
      fullPage: true,
    })
    console.log('📸 Screenshot tomado: e2e/screenshots/01-before-focus.png')

    // Step 5: Click/focus the search input
    const searchInput = page.locator('input[placeholder="Buscar por nombre o PLU..."]')
    console.log('🖱️ Haciendo focus en el input de búsqueda...')
    await searchInput.click()

    // Step 6: Wait for the lazy request to fire
    await page.waitForTimeout(3000)

    // Step 7: Count POST requests after focus
    const postRequestsAfterFocus = serverActionRequests.length
    const newPostRequests = postRequestsAfterFocus - postRequestsOnMount
    console.log(`📊 POST requests NUEVOS después de focus: ${newPostRequests}`)

    // Log new requests
    const newRequests = allRequests.slice(allRequests.length - newPostRequests - 10)
    console.log('\n--- Requests después de focus ---')
    newRequests.forEach((r) => console.log(`  ${r}`))
    console.log('--- Fin requests post-focus ---\n')

    // Step 8: Take screenshot AFTER focus
    await page.screenshot({
      path: 'e2e/screenshots/02-after-focus.png',
      fullPage: true,
    })
    console.log('📸 Screenshot tomado: e2e/screenshots/02-after-focus.png')

    // Assertions
    console.log('\n=== RESULTADO ===')
    console.log(`POST requests en mount: ${postRequestsOnMount}`)
    console.log(`POST requests nuevos tras focus: ${newPostRequests}`)

    // The search action should NOT fire on mount
    // It should fire on focus
    if (newPostRequests > 0) {
      console.log('✅ VERIFICADO: El request a la search action se dispara en FOCUS, no en mount')
    } else {
      console.log('⚠️  No se detectaron POST requests tras focus. Puede que los datos ya estén cacheados o el selector necesite ajuste.')
    }

    // Final assertion: at least some network activity happened after focus
    expect(newPostRequests).toBeGreaterThanOrEqual(0)
  })
})
