document.addEventListener('DOMContentLoaded', () => {
  const csBtn = document.getElementById('copy-share')

  csBtn.addEventListener('click', async() => {
    const originalText = csBtn.innerText
    const url = window.location.href

    if (!navigator.userAgent.includes('Firefox')) {
      const result = await navigator.permissions.query({ name: 'clipboard-write' })

      if (result.state === 'granted' || result.state === 'prompt') {
        await navigator.clipboard.writeText(url)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }

    csBtn.innerText = 'Copied 🎉'

    setTimeout(() => {
      csBtn.innerText = originalText
    }, 1500)
  })
})
