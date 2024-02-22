function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
  
  const btnHeader = document.querySelector('.btn-theme-header')
  const btnFooter = document.querySelector('.btn-theme-footer')
  
  if (btnHeader) {
    btnHeader.innerHTML = getIcon(t, 'd-block', 22, 'currentColor', 2)
  }
  
  if (btnFooter) {
    btnFooter.innerHTML = getIcon(t, 'icon', 24, '#81a1c1', 1.5)
  }
}

function getThemeFromLS() {
  return localStorage.getItem('theme')
}

function getIcon(theme, className, size, stroke, thickness) {
  const iconSun = `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="${thickness}" stroke="${stroke}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>`
  const iconMoon = `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" stroke-width="${thickness}" stroke="${stroke}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" /><path d="M19 11h2m-1 -1v2" /></svg>`

  return theme === 'dark'
    ? iconSun
    : iconMoon
}

window.addEventListener('DOMContentLoaded', () => {
  const themePref = getThemeFromLS()
  
  if (!themePref) {
    // no theme chosen, check browser/OS settings
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (preferDark) {
      applyTheme('dark')
    }
  } else {
    applyTheme(themePref)
  }
})
