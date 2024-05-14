export function getImageData() {
  // create canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // get image from img element
  const img = document.getElementById('img') as HTMLImageElement

  if (img && ctx) {
    // set canvas dimensions to match img dimensions
    canvas.width = img.width
    canvas.height = img.height

    // draw img on canvas
    ctx.drawImage(img, 0, 0, img.width, img.height)

    // get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    return imageData
  }
}
