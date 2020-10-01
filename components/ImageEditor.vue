<template>
  <div>
    <span
      v-for="(feature, index) in options.features"
      :key="'feature' + index"
      @click="callMethod(feature)"
    >
      <slot :name="feature">
        <button class="btn">{{ feature }}</button>
        <span v-if="feature === 'Text'">
          <input v-model="text" type="text" placeholder="write something" />
        </span>
        <span v-if="feature === 'Bright'" class="row">
          <input
            v-model="brightVal"
            type="range"
            max="1"
            min="-1"
            step="0.01"
          />
          <span>{{ brightVal }}</span>
        </span>
        <span v-if="feature === 'Contrast'" class="row">
          <input
            v-model="contrastVal"
            type="range"
            max="1"
            min="-1"
            step="0.01"
          />
          <span>{{ contrastVal }}</span>
        </span>
        <span v-if="feature === 'Opacity'" class="row">
          <input
            v-model="opacityVal"
            type="range"
            max="1"
            min="0"
            step="0.01"
          />
          <span>{{ opacityVal }}</span>
        </span>
        <span v-if="feature === 'Blur'" class="row">
          <input v-model="blurVal" type="range" max="30" min="1" step="1" />
          <span>{{ blurVal }}</span>
        </span>
      </slot>
    </span>
    <span
      v-for="(tool, index) in options.tools"
      :key="'tool' + index"
      @click="callTool(tool)"
    >
      <slot :name="tool">
        <button class="btn">{{ tool }}</button>
      </slot>
    </span>
    <button class="btn" @click="hide = !hide">OriginImage</button>
    <div>
      <label v-if="!image" class="upload_btn">
        Upload Image
        <input type="file" hidden="hidden" @change="onFileChange" />
      </label>

      <div v-if="image" class="center">
        <img :src="image" />
        <img v-if="!hide" :src="originImage" alt="" />
      </div>
      <a v-if="image" :href="image" class="btn center" :download="image">
        Download
      </a>
    </div>
  </div>
</template>
<script>
import JimpMixin from '../mixins/JimpMixin'
export default {
  mixins: [JimpMixin],
  props: {
    options: {
      type: Object,
      required: true,
    },
    allowFormat: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      image: '',
      undoImage: [],
      redoImage: [],
      brightVal: 0,
      contrastVal: 0,
      opacityVal: 0,
      blurVal: 0,
      editingImage: '',
      originImage: null,
      hide: true,
      text: '',
    }
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      console.log(file)
      if (!this.checkFileType(file)) {
        alert('Sorry,file ' + file.type + 'is not supported !')
        return
      }
      this.image = await this.readFileToBase64(file)
      this.originImage = this.image
    },
    checkFileType(file) {
      let check = 0
      this.allowFormat.forEach((ftype) => {
        const type = 'image/' + ftype
        if (type === file.type) {
          check++
        }
      })
      if (check > 0) return 1
      else return 0
    },
    checkImage() {
      if (this.image === '') return 0
      else return 1
    },
    onRemoveImage(e) {
      this.image = ''
      this.undoImage.length = 0
      this.redoImage.length = 0
      this.editingImage = ''
      this.originImage = ''
    },
    callMethod(feature) {
      if (!this.checkImage()) {
        alert('Please upload your image !')
        return
      }
      this.saveImage()
      if (feature === 'Bright') this['on' + feature](this.brightVal)
      else if (feature === 'Contrast') this['on' + feature](this.contrastVal)
      else if (feature === 'Opacity') this['on' + feature](this.opacityVal)
      else if (feature === 'Blur') this['on' + feature](this.blurVal)
      else if (feature === 'Text') this['on' + feature](this.text)
      else this['on' + feature]()
    },
    callTool(feature) {
      if (!this.checkImage()) {
        alert('Please upload your image !')
        return
      }
      this['on' + feature]()
    },
    saveImage(feature) {
      this.editingImage = this.image
      this.undoImage.push(this.image)
    },
    async onRotateLeft() {
      this.image = await this.rotateImage(this.image, 90)
    },
    async onRotateRight() {
      this.image = await this.rotateImage(this.image, -90)
    },
    async onFlipHorizontal() {
      this.image = await this.flipImage(this.image, 1)
    },
    async onFlipVertical() {
      this.image = await this.flipImage(this.image, -1)
    },
    async onBright(val) {
      val = parseFloat(val)
      this.image = await this.brightImage(this.editingImage, val)
    },
    async onContrast(val) {
      val = parseFloat(val)
      this.image = await this.contrastImage(this.editingImage, val)
    },
    async onOpacity(val) {
      val = parseFloat(val)
      this.image = await this.opacityImage(this.editingImage, val)
    },
    async onBlur(val) {
      val = parseFloat(val)
      this.image = await this.blurImage(this.editingImage, val)
    },
    async onGreyScale() {
      this.image = await this.greyScaleImage(this.image)
    },
    async onCropSquareTop() {
      this.image = await this.cropImage(this.image, 'top')
    },
    async onCropSquareBottom() {
      this.image = await this.cropImage(this.image, 'bottom')
    },
    async onCropSquareCenter() {
      this.image = await this.cropImage(this.image, 'top')
    },
    async onText(text) {
      this.image = await this.textImage(this.image, text)
    },
    onUndoImage() {
      if (this.undoImage.length <= 0) {
        alert('Cant undo anymore!')
      } else {
        this.redoImage.push(this.image)
        this.image = this.undoImage.pop()
      }
    },
    onRedoImage() {
      if (this.redoImage.length <= 0) {
        alert('Cant redo anymore!')
      } else {
        this.undoImage.push(this.image)
        this.image = this.redoImage.pop()
      }
    },
  },
}
</script>
