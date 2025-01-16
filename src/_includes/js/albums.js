document.addEventListener('DOMContentLoaded', () => {
  const filterOptions = {
    filterParam: 'genre',
    listingClass: '.album-listing'
  }
  const albumList = document.getElementById('albums')
  const btnActiveClass = 'active'
  const btnShowGrid = document.getElementById('btn-grid')
  const btnShowList = document.getElementById('btn-list')
  const gridClasslist = ['grid', 'grid4', 'gap1', 'mt2']
  const listItems = Array.from(document.querySelectorAll('.image-header'))
  const listItemsClasslist = ['gap1', 'gap2-lg', 'mt2', 'mb1']
  const state = {
    isList: true
  }

  useCollectionFilter(filterOptions)

  function listViewToggle() {
    gridClasslist.forEach((token) => {
      albumList.classList.toggle(token)
    })

    listItems.forEach((item) => {
      listItemsClasslist.forEach((token) => {
        item.classList.toggle(token)
      })
      item.children[0]?.classList.toggle('w100m')
      item.children[0]?.classList.toggle('w100')
      item.children[1]?.classList.toggle('d-none')
    })

    btnShowGrid.classList.toggle(btnActiveClass)
    btnShowList.classList.toggle(btnActiveClass)

    state.isList = !state.isList

    if (!state.isList) {
      btnShowGrid.disabled = true
      btnShowList.disabled = false
    } else {
      btnShowGrid.disabled = false
      btnShowList.disabled = true
    }
  }

  btnShowGrid.addEventListener('click', listViewToggle)
  btnShowList.addEventListener('click', listViewToggle)
})
