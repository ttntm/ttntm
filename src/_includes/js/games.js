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
    const target = evt.target.getAttribute('data-target')
    const targetEl = document.querySelector(`.game-detail[data-id="${target}"]`)
    const targetElHeight = `${parseInt(window.getComputedStyle(targetEl).height)}px`

    gameListings.forEach((listing) => {
      listing.classList.remove('visible')
    })

    gameViewer.style.height = targetElHeight
    targetEl.classList.add('visible')
  }

  gameBtns.forEach((btn) => {
    btn.addEventListener('click', showListing)
  })
})
