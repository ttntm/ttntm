document.addEventListener('DOMContentLoaded', () => {
  const switchThemeBtns = Array.from(document.querySelectorAll('.btn-theme'))

  switchThemeBtns?.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const currentTheme = getThemeFromLS()

      return currentTheme === 'dark'
        ? applyTheme('light')
        : applyTheme('dark')
    })
  })
})
