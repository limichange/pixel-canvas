export function getImageData() {
  // create canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // get image from img element
  const img = document.getElementById('img') as HTMLImageElement
  const pixels = []

  if (img && ctx) {
    // set canvas dimensions to match img dimensions
    canvas.width = img.width
    canvas.height = img.height

    // draw img on canvas
    ctx.drawImage(img, 0, 0, img.width, img.height)

    // get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const resolution = 1

    for (
      let x = 0;
      x < imageData.width;
      x += resolution //var i=0;i<imageData.data.length;i+=4)
    ) {
      for (let y = 0; y < imageData.height; y += resolution) {
        let i = (y * imageData.width + x) * 4

        let r = imageData.data[i]
        let g = imageData.data[i + 1]
        let b = imageData.data[i + 2]
        let lum = (r + r + b + g + g + g) / 6

        //  console.log(lum);

        //    if(imageData.data[i+3]>128)

        const thresholdContrastMax = 210
        const thresholdContrastMin = 0
        const whiteNoise = 0.1

        if (lum < thresholdContrastMax && lum > thresholdContrastMin) {
          // => Everything is black except pure white
          //    if(lum<255 && getRandomArbitrary((255-lum), 255) > 255 - (255-(255-lum))/2 )
          if (Math.random() * 100 > whiteNoise) {
            // if (index >= pixels.length) {
            pixels.push({ x, y, lum })
            // } else {
            //   pixels[index].homeX = x
            //   pixels[index].homeY = y
            // }
            // pixels[index].isDying = false
            // pixels[index].alpha = 255
            // index++
          }
        }
      }
    }
  }

  return {
    pixels,
  }
}
