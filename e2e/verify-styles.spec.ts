import { test, expect } from '@playwright/test'

test.describe('Verificación 2: Estilos Tailwind post-bump', () => {
  test('Landing pública - estilos generales', async ({ page }) => {
    console.log('📍 Navegando a la landing pública...')
    await page.goto('https://ypfelpuente.netlify.app/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for main content
    await page.waitForTimeout(2000)

    // Full page screenshot
    await page.screenshot({
      path: 'e2e/screenshots/03-landing-full.png',
      fullPage: true,
    })
    console.log('📸 Screenshot landing: e2e/screenshots/03-landing-full.png')

    // Viewport screenshot (above the fold)
    await page.screenshot({
      path: 'e2e/screenshots/04-landing-viewport.png',
      fullPage: false,
    })
    console.log('📸 Screenshot viewport: e2e/screenshots/04-landing-viewport.png')

    // Check navbar exists and has glass morphism styles
    const navbar = page.locator('nav, header, [class*="nav"]').first()
    if (await navbar.isVisible()) {
      const navBox = await navbar.boundingBox()
      const navStyles = await navbar.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background || computed.backgroundColor,
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          borderRadius: computed.borderRadius,
          border: computed.border,
          boxShadow: computed.boxShadow,
        }
      })
      console.log('🧭 Navbar styles:', JSON.stringify(navStyles, null, 2))

      // Check for glass morphism indicators
      const hasGlassEffect =
        navStyles.backdropFilter?.includes('blur') ||
        navStyles.background?.includes('rgba') ||
        navStyles.background?.includes('hsla') ||
        navStyles.background?.includes('transparent')

      console.log(hasGlassEffect ? '✅ Glass morphism detectado en navbar' : '⚠️  No se detectó glass morphism en navbar')
    } else {
      console.log('⚠️  Navbar no encontrado')
    }

    // Check for cards with shadows/colors
    const cards = page.locator('[class*="card"], [class*="Card"]')
    const cardCount = await cards.count()
    console.log(`🃏 Cards encontradas: ${cardCount}`)

    if (cardCount > 0) {
      const firstCardStyles = await cards.first().evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius,
          background: computed.background || computed.backgroundColor,
          border: computed.border,
        }
      })
      console.log('🃏 Primera card styles:', JSON.stringify(firstCardStyles, null, 2))
    }

    // Check buttons have styles
    const buttons = page.locator('button, a[class*="button"], [role="button"]')
    const buttonCount = await buttons.count()
    console.log(`🔘 Botones encontrados: ${buttonCount}`)

    if (buttonCount > 0) {
      const firstButtonStyles = await buttons.first().evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background || computed.backgroundColor,
          color: computed.color,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          boxShadow: computed.boxShadow,
        }
      })
      console.log('🔘 Primer botón styles:', JSON.stringify(firstButtonStyles, null, 2))
    }

    // Check typography
    const h1 = page.locator('h1').first()
    if (await h1.isVisible()) {
      const h1Styles = await h1.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          color: computed.color,
          fontFamily: computed.fontFamily,
        }
      })
      console.log('📝 H1 styles:', JSON.stringify(h1Styles, null, 2))
    }

    // Check for broken images or missing styles
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.filter((img) => !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0)
    })
    console.log(`🖼️  Imágenes rotas: ${brokenImages.length}`)
  })

  test('Admin productos - tabla y componentes', async ({ page }) => {
    console.log('📍 Navegando a /admin/productos...')
    await page.goto('https://ypfelpuente.netlify.app/admin/productos', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for table to render
    await page.waitForSelector('table, [class*="table"], [class*="Table"]', {
      timeout: 10000,
    }).catch(() => console.log('⚠️  Tabla no encontrada con selector estándar'))

    await page.waitForTimeout(2000)

    // Full page screenshot
    await page.screenshot({
      path: 'e2e/screenshots/05-admin-productos-full.png',
      fullPage: true,
    })
    console.log('📸 Screenshot admin: e2e/screenshots/05-admin-productos-full.png')

    // Viewport screenshot
    await page.screenshot({
      path: 'e2e/screenshots/06-admin-productos-viewport.png',
      fullPage: false,
    })
    console.log('📸 Screenshot viewport: e2e/screenshots/06-admin-productos-viewport.png')

    // Check glass cards
    const glassCards = page.locator('[class*="glass"], [class*="Glass"]')
    const glassCardCount = await glassCards.count()
    console.log(`💎 Glass cards encontradas: ${glassCardCount}`)

    if (glassCardCount > 0) {
      const glassStyles = await glassCards.first().evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background || computed.backgroundColor,
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          borderRadius: computed.borderRadius,
          border: computed.border,
          boxShadow: computed.boxShadow,
        }
      })
      console.log('💎 Glass card styles:', JSON.stringify(glassStyles, null, 2))
    }

    // Check search input
    const searchInput = page.locator('input[placeholder="Buscar por nombre o PLU..."]')
    if (await searchInput.isVisible()) {
      const inputStyles = await searchInput.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          borderRadius: computed.borderRadius,
          border: computed.border,
          padding: computed.padding,
          background: computed.background || computed.backgroundColor,
          boxShadow: computed.boxShadow,
          height: computed.height,
        }
      })
      console.log('🔍 Search input styles:', JSON.stringify(inputStyles, null, 2))
      console.log('✅ Search input visible y estilizado')
    } else {
      console.log('⚠️  Search input no encontrado')
    }

    // Check badges
    const badges = page.locator('[class*="badge"], [class*="Badge"]')
    const badgeCount = await badges.count()
    console.log(`🏷️  Badges encontrados: ${badgeCount}`)

    if (badgeCount > 0) {
      const badgeStyles = await badges.first().evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background || computed.backgroundColor,
          color: computed.color,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontSize: computed.fontSize,
        }
      })
      console.log('🏷️  Badge styles:', JSON.stringify(badgeStyles, null, 2))
    }

    // Check table rows
    const tableRows = page.locator('tbody tr')
    const rowCount = await tableRows.count()
    console.log(`📋 Filas de tabla: ${rowCount}`)

    if (rowCount > 0) {
      const rowStyles = await tableRows.first().evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background || computed.backgroundColor,
          borderBottom: computed.borderBottom,
          padding: computed.padding,
        }
      })
      console.log('📋 Primera fila styles:', JSON.stringify(rowStyles, null, 2))
    }

    // Check buttons in admin
    const adminButtons = page.locator('button:not([class*="sr-only"])')
    const adminButtonCount = await adminButtons.count()
    console.log(`🔘 Botones admin: ${adminButtonCount}`)

    // Check for unstyled elements (red flag for Tailwind issues)
    const unstyledCheck = await page.evaluate(() => {
      const body = document.body
      const computed = window.getComputedStyle(body)
      return {
        bodyFontFamily: computed.fontFamily,
        bodyColor: computed.color,
        bodyBg: computed.backgroundColor,
      }
    })
    console.log('🎨 Body computed styles:', JSON.stringify(unstyledCheck, null, 2))

    // Check if Tailwind is loaded by checking for CSS custom properties
    const tailwindLoaded = await page.evaluate(() => {
      const root = document.documentElement
      const computed = window.getComputedStyle(root)
      // Tailwind v4 uses CSS variables
      return {
        hasCSSVars: computed.getPropertyValue('--primary') !== '' ||
                   computed.getPropertyValue('--background') !== '' ||
                   computed.getPropertyValue('--foreground') !== '',
        primary: computed.getPropertyValue('--primary'),
        background: computed.getPropertyValue('--background'),
      }
    })
    console.log('🎨 Tailwind CSS vars:', JSON.stringify(tailwindLoaded, null, 2))

    if (tailwindLoaded.hasCSSVars) {
      console.log('✅ Tailwind CSS variables detectadas - framework cargado correctamente')
    } else {
      console.log('⚠️  Tailwind CSS variables NO detectadas - posible problema de build')
    }
  })
})
