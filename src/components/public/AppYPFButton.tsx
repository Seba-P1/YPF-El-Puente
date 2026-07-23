'use client'

/**
 * Smart App YPF button.
 * - On PC (Desktop): opens official web app https://app.ypf.com/
 * - On Mobile (iOS / Android): tries to open the installed official YPF App.
 *   If not installed, redirects to App Store (iOS) or Play Store (Android).
 */
export function AppYPFButton() {
  const handleClick = () => {
    const userAgent = navigator.userAgent || ''

    const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    const isAndroid = /Android/i.test(userAgent)

    const playStoreURL = 'https://play.google.com/store/apps/details?id=com.ypf.app'
    const appStoreURL = 'https://apps.apple.com/ar/app/ypf/id1442111833'
    const desktopURL = 'https://app.ypf.com/'

    if (isIOS) {
      // iOS: Universal Link opens app if installed, or App Store if not
      window.location.href = appStoreURL
    } else if (isAndroid) {
      // Android: Chrome Intent attempts to open com.ypf.app package, fallback to Play Store
      const intentURL = `intent://main#Intent;scheme=ypfapp;package=com.ypf.app;S.browser_fallback_url=${encodeURIComponent(playStoreURL)};end`
      window.location.href = intentURL
    } else {
      // PC / Desktop: opens https://app.ypf.com/
      window.open(desktopURL, '_blank', 'noopener')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
      style={{ fontWeight: 400 }}
      title="Ir a APP YPF"
    >
      APP YPF
    </button>
  )
}
