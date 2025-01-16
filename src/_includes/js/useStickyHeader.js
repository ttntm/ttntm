function getNavStateFromLS() {
  return localStorage.getItem('navState')
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPinState = getNavStateFromLS()
  const header = document.querySelector('.navTop')
  const pinned = ['sticky', 'shadow']
  const toggle = document.getElementById('nav-pin')

  function pin() {
    header.classList.add(...pinned)
    toggle.classList.add('pinned')
    localStorage.setItem('navState', 'pinned')
  }

  function unpin() {
    header.classList.remove(...pinned)
    toggle.classList.remove('pinned')
    localStorage.setItem('navState', 'default')
  }

  // persist pin state during navigation
  (() => {
    if (header && toggle) {
      if (currentPinState === 'pinned') {
        pin()
      } else {
        unpin()
      }
    }
  })()

  toggle?.addEventListener('click', (evt) => {
    header.style.transition = 'all .35s ease'

    if (getNavStateFromLS() === 'pinned') {
      unpin()
    } else {
      pin()
    }
  })
})
