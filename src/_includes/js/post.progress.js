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

window.addEventListener('DOMContentLoaded', () => {
  const postContent = document.getElementById('post')
  const progressBar = document.querySelector('.progress-bar__inner')
  const wInnerHeight = window.innerHeight
  let contentTop = 0
  let contentOffsetHeight = 0

  if (postContent && progressBar) {
    window.addEventListener('scroll', useDebounce(() => {
      const wScrollY = window.scrollY

      contentTop = postContent.offsetTop
      contentOffsetHeight = postContent.offsetHeight

      if (
        contentTop
        && (contentTop - wInnerHeight) < wScrollY
      ) {
        const progress = wScrollY / (contentOffsetHeight - (contentTop + wInnerHeight))

        progressBar.style.transform = `scaleY(${progress <= 1 ? progress : 1})`

        if (progress >= 1) {
          progressBar.parentElement?.classList.add('done')
        } else {
          progressBar.parentElement?.classList.remove('done')
        }
      }
    }, 20))
  }
})
