function getNavStateFromLS() {
  return localStorage.getItem('navState')
}

window.addEventListener('DOMContentLoaded', () => {
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
    if (currentPinState === 'pinned') {
      pin()
    } else {
      unpin()
    }
  })()

  toggle?.addEventListener('click', (evt) => {
    if (getNavStateFromLS() === 'pinned') {
      unpin()
    } else {
      pin()
    }
  })
})