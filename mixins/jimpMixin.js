import Jimp from 'jimp'
export default {
  methods: {
    readFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    drawImageCanvas(canvas, file) {
      window.onload = function () {
        const context = canvas.getContext('2d')
        context.drawImage(file, 0, 0)
      }
    },
    async rotateImage(base64Str, deg) {
      const image = await Jimp.read(base64Str)
      image.rotate(deg)
      return await image.getBase64Async(image.getMIME())
    },
    async cropImage(base64Str, location) {
      const image = await Jimp.read(base64Str)
      const height = image.bitmap.height
      const width = image.bitmap.width
      const size = width > height ? height : width
      if (location === 1) image.crop(0, 0, size, size)
      if (location === -1)
        image.crop(
          0,
          width > height ? height - size : height - width,
          size,
          size
        )
      if (location === 0)
        if (width < height) image.crop(0, (height - width) / 2, size, size)
      if (width > height) image.crop((width - height) / 2, 0, size, size)
      return await image.getBase64Async(image.getMIME())
    },
    async flipImage(base64Str, direction) {
      const image = await Jimp.read(base64Str)
      if (direction === 1) image.flip(true, false)
      if (direction === -1) image.flip(false, true)
      return await image.getBase64Async(image.getMIME())
    },
    async brightImage(base64Str, val) {
      const image = await Jimp.read(base64Str)
      image.brightness(val)
      return await image.getBase64Async(image.getMIME())
    },
    async contrastImage(base64Str, val) {
      const image = await Jimp.read(base64Str)
      image.contrast(val)
      return await image.getBase64Async(image.getMIME())
    },
    async greyscaleImage(base64Str) {
      const image = await Jimp.read(base64Str)
      image.greyscale()
      return await image.getBase64Async(image.getMIME())
    },
    async writeTextImage(base64Str, text) {
      const image = await Jimp.read(base64Str)
      //  'https://fonts.googleapis.com/css2?family=Peddana&display=swap'
      Jimp.loadFont(
        'https://fonts.googleapis.com/css2?family=Peddana&display=swap'
      ).then((font) => {
        image.print(font, 10, 10, 'Hello world!')
      })
      return await image.getBase64Async(image.getMIME())
    },
    async hashImage(base64Str) {
      const image = await Jimp.read(base64Str)
      image.hash()
      return await image.getBase64Async(image.getMIME())
    },
  },
}
