document.addEventListener('DOMContentLoaded', () => {
  const filterOptions = {
    filterParam: 'region',
    listingClass: '.wsk-listing'
  }
  const expandBtn = document.getElementById('btn-expand')
  const expandableListings = document.querySelectorAll(filterOptions.listingClass)
  const state = {
    isExpandAll: false
  }

  useCollectionFilter(filterOptions)

  expandBtn.addEventListener('click', () => {
    expandableListings.forEach((item) => {
      if (!state.isExpandAll) {
        item?.children[0]?.setAttribute('open', '')
      } else {
        item?.children[0]?.removeAttribute('open')
      }
    })

    if (!state.isExpandAll) {
      expandBtn.innerText = 'Collapse All'
    } else {
      expandBtn.innerText = 'Expand All'
    }

    state.isExpandAll = !state.isExpandAll
  })
})
