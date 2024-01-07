function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
}

function getThemeFromLS() {
  return localStorage.getItem('theme')
}

window.addEventListener('DOMContentLoaded', () => {
  const themePref = getThemeFromLS()
  
  if (!themePref) {
    // no theme chosen, check browser/OS settings
    const preferDark = !!window.matchMedia('(prefers-color-scheme: dark)')
    
    if (preferDark) {
      applyTheme('dark')
    }
  } else {
    applyTheme(themePref)
  }
  
  const switchThemeBtns = Array.from(document.querySelectorAll('.btn-theme'))
  
  switchThemeBtns?.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      let currentTheme = getThemeFromLS()
      
      return currentTheme === 'dark'
        ? applyTheme('light')
        : applyTheme('dark')
    })
  })
})