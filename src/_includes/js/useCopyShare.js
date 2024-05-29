window.addEventListener('DOMContentLoaded', () => {
  const csBtn = document.getElementById('copy-share')

  csBtn.addEventListener('click', async() => {
    const originalText = csBtn.innerText
    const url = window.location.href

    await navigator.clipboard.writeText(url)
    csBtn.innerText = 'Copied 🎉'

    setTimeout(() => {
      csBtn.innerText = originalText
    }, 1500)
  })
})
