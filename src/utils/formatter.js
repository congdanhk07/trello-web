export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `column-id-${column._id}-placeholder-card`,
    boardId: column.boardId,
    FE_PlaceholderCard: true
  }
}
