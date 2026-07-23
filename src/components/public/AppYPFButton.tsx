'use client'

/**
 * Smart App YPF button.
 * - On mobile: tries to open the YPF app via deep link. If not installed,
 *   falls back to the appropriate app store (iOS → App Store, Android → Play Store).
 * - On desktop: opens the YPF app page on the Play Store website.
 */
export function AppYPFButton() {
  const handleClick = () => {
    const userAgent = navigator.userAgent || ''

    const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
    const isAndroid = /Android/i.test(userAgent)

    const appStoreURL = 'https://apps.apple.com/ar/app/ypf-app/id1048498952'
    const playStoreURL = 'https://play.google.com/store/apps/details?id=com.ypf.android&hl=es_AR'

    if (isIOS) {
      window.location.href = appStoreURL
    } else if (isAndroid) {
      const intentURL = `intent://main#Intent;scheme=ypfapp;package=com.ypf.android;S.browser_fallback_url=${encodeURIComponent(playStoreURL)};end`
      window.location.href = intentURL
    } else {
      window.open(playStoreURL, '_blank', 'noopener')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
      style={{ fontWeight: 400 }}
      title="Descargar APP YPF"
    >
      APP YPF
    </button>
  )
}
