function useCollectionFilter(config) {
  function updateSearchParams(term, value) {
    const url = new URL(window.location.href)

    if (value) {
      url.searchParams.set(term, value)
    } else {
      url.searchParams.delete(term)
    }

    window.history.pushState({}, '', url.toString())
  }

  return (function() {
    const classActive = 'filter-btn__active'
    const classHidden = 'd-none'
    const filterBtns = document.querySelectorAll('.filter-btn')
    const filterParam = config.filterParam
    const listings = document.querySelectorAll(config.listingClass)
    const resetBtns = document.querySelectorAll(`[data-reset="true"]`)

    function applyFilter(term, value) {
      filterBtns.forEach((btn) => {
        btn.classList.remove(classActive)
        btn.disabled = false
      })

      listings.forEach((item) => {
        const listingTerm = item.getAttribute(`data-${term}`)

        if (!listingTerm || listingTerm !== value) {
          item.classList.add(classHidden)
        } else {
          item.classList.remove(classHidden)
        }
      })
    }

    function handleFilterBtnClick(event) {
      const filterTerm = event?.target?.getAttribute('data-term')
      const filterValue = event?.target?.getAttribute('data-value')

      if (filterTerm && filterValue) {
        applyFilter(filterTerm, filterValue)
        updateSearchParams(filterTerm, filterValue)

        event.target.classList.add(classActive)
        event.target.disabled = true
      }
    }

    function handleFilterInURL() {
      const paramName = filterParam
      const urlParams = new URLSearchParams(window.location.search)

      if (urlParams.has(paramName)) {
        const paramValue = String(urlParams.get(paramName))
        // Find the filter button that matches the URL param's value
        const paramValueBtn = document.querySelector(`[data-value="${paramValue}"]`)

        applyFilter(paramName, paramValue)

        if (paramValueBtn instanceof HTMLElement) {
          paramValueBtn.classList.add(classActive)
          paramValueBtn.disabled = true
        }
      } else {
        resetFilter(false)
      }
    }

    function resetFilter(updateUrl = true) {
      filterBtns.forEach((btn) => {
        btn.classList.remove(classActive)
        btn.disabled = false
      })

      listings.forEach((item) => {
        item.classList.remove(classHidden)
      })

      resetBtns.forEach((btn) => {
        if (btn.getAttribute('data-value') === filterParam) {
          btn.classList.add(classActive)
          btn.disabled = true
        }
      })

      if (updateUrl) {
        // Reset should only interact with the browser history when it was triggered using the button in the UI.
        // Otherwise, the history API will end up in a deadlocked state
        updateSearchParams(filterParam, undefined)
      }
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', handleFilterBtnClick)
    })

    resetBtns.forEach((btn) => {
      btn.addEventListener('click', resetFilter)
    })

    window.addEventListener('popstate', handleFilterInURL)
    window.addEventListener('pushState', handleFilterInURL)

    handleFilterInURL()
  })()
}