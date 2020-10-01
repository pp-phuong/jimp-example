import Jimp from 'jimp'
export default {
  methods: {
    readFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = (error) => reject(error)
      })
    },
    async rotateImage(base64Str, deg) {
      const image = await Jimp.read(base64Str)
      image.rotate(deg)
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
      console.log(val)
      image.brightness(val)
      return await image.getBase64Async(image.getMIME())
    },
    async contrastImage(base64Str, val) {
      const image = await Jimp.read(base64Str)
      image.contrast(val)
      return await image.getBase64Async(image.getMIME())
    },
    async opacityImage(base64Str, val) {
      const image = await Jimp.read(base64Str)
      image.opacity(val)
      return await image.getBase64Async(image.getMIME())
    },
    async blurImage(base64Str, val) {
      const image = await Jimp.read(base64Str)
      image.blur(val)
      return await image.getBase64Async(image.getMIME())
    },
    async greyScaleImage(base64Str) {
      const image = await Jimp.read(base64Str)
      image.greyScale()
      return await image.getBase64Async(image.getMIME())
    },
    async cropImage(base64Str, option) {
      const image = await Jimp.read(base64Str)
      const w = image.bitmap.width
      const h = image.bitmap.height
      if (option === 'top') image.crop(0, 0, w > h ? h : w, w > h ? h : w)
      if (option === 'bottom') {
        if (w > h) image.crop(w - h, 0, h, h)
        else if (w < h) image.crop(0, h - w, w, w)
      }
      if (option === 'center') {
        if (w > h) image.crop(0, (w - h) / 2, h, h)
        else if (w < h) image.crop((h - w) / 2, 0, w, w)
      }
      console.log(w > h ? h : w)
      return await image.getBase64Async(image.getMIME())
    },
    async textImage(base64Str, text) {
      const image = await Jimp.read(base64Str)
      await Jimp.loadFont('../assets/font/font.fnt')
        .then((font) => {
          image.print(font, 10, 10, text)
          return image
        })
        .then((image) => {
          return image.getBase64Async(image.getMIME())
        })
    },
    // image.color([
    //   { apply: 'hue', params: [-90] },
    //   { apply: 'lighten', params: [50] },
    //   { apply: 'xor', params: ['#06D'] }
    // ]);
  },
}
