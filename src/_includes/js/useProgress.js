function useDebounce(callback, wait) {
  let timeout

  return function(...args) {
    const context = this

    clearTimeout(timeout)

    timeout = setTimeout(
      () => callback.apply(context, args),
      wait
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content')
  const progressBar = document.querySelector('.progress-bar__inner')
  const wInnerHeight = window.innerHeight
  let contentTop = 0
  let contentOffsetHeight = 0

  if (contentArea && progressBar) {
    const progressBarVisible = () => {
      return window.getComputedStyle(progressBar?.parentElement)?.getPropertyValue('display') !== 'none'
    }

    if (progressBarVisible()) {
      window.addEventListener('scroll', useDebounce(() => {
        const wScrollY = window.scrollY
        contentTop = contentArea.offsetTop
        contentOffsetHeight = contentArea.offsetHeight

        if (
          contentTop
          && (contentTop - wInnerHeight) < wScrollY
        ) {
          const progress = wScrollY / ((wInnerHeight - (contentTop + contentOffsetHeight)) * -1)

          progressBar.style.transform = `scaleY(${progress <= 1 ? progress : 1})`

          if (progress >= 1) {
            progressBar.parentElement?.classList.add('done')
          } else {
            progressBar.parentElement?.classList.remove('done')
          }
        }
      }, 20))
    }
  }
})
