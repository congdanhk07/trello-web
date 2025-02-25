export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Generate placeholder card for column empty
// Khi Column bị rỗng thì không thể kéo card vào trong nên chúng ta tạo ra một card ẩn để mặc định luôn có 1 card thuộc trong column
export const generatePlaceholderCard = (column) => {
  return {
    _id: `column-id-${column._id}-placeholder-card`,
    boardId: column.boardId,
    FE_PlaceholderCard: true
  }
}
