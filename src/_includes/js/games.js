document.addEventListener('DOMContentLoaded', () => {
  const filterOptions = {
    filterParam: 'genre',
    listingClass: '.shelf-listing'
  }
  const gameBtns = document.querySelectorAll('.game-btn')
  const gameListings = document.querySelectorAll('.game-detail')
  const gameViewer = document.querySelector('.game-viewer')

  useCollectionFilter(filterOptions)

  function showListing(evt) {
    let target = evt.target.getAttribute('data-target')

    if (!target) {
      // fallback in case `pointer-events: none;` has failed and
      // `evt.target` ended up being the cover image
      // also: fuck you, Safari
      target = evt.target?.closest('.game-btn')?.getAttribute('data-target')
    }

    if (target) {
      const targetEl = document.getElementById(target)
      const targetElHeight = `${parseInt(window.getComputedStyle(targetEl).height)}px`

      gameListings.forEach((listing) => {
        listing.classList.remove('visible')
      })

      gameViewer.style.height = targetElHeight
      targetEl.classList.add('visible')
    } else {
      console.error('No target element for event:', evt)
    }
  }

  gameBtns.forEach((btn) => {
    btn.addEventListener('click', showListing)
  })
})
