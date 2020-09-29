<template>
  <div id="image-editor">
    <!-- edit image -->
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <span
        v-for="(feature, index) in options.features"
        :key="'feature-' + index"
        @click="callmethod(feature)"
      >
        <slot :name="feature">
          <div style="display: flex; flex-direction: column">
            <button class="feature">{{ feature }}</button>
            <!-- Brightness adjustment feature  -->
            <div v-if="feature == 'Bright'">
              <input v-model="brightVal" type="range" min="-10" max="10" />
              <div>{{ brightVal / 10 }}</div>
            </div>
            <!-- Contrast adjustment feature  -->
            <div v-if="feature == 'Contrast'">
              <input v-model="contrastVal" type="range" min="-10" max="10" />
              <div>{{ contrastVal / 10 }}</div>
            </div>
            <!-- Insert text feature -->
            <div v-if="feature == 'Text'">
              <input
                v-model="text"
                style="margin-top: 5px"
                type="text"
                placeholder="Write something"
              />
            </div>
          </div>
        </slot>
      </span>
      <!-- more tools -->
      <span
        v-for="(tool, index) in options.tools"
        :key="'tool-' + index"
        @click="callTool(tool)"
      >
        <slot :name="tool">
          <div style="display: flex; flex-direction: column">
            <button class="feature">{{ tool }}</button>
          </div>
        </slot>
      </span>
    </div>
    <div class="edit-image">
      <!-- upload image  -->
      <div v-if="!image" class="upload">
        <h3>Upload your image here</h3>
        <label for="file" class="btn-2">Upload Image</label>
        <input id="file" type="file" @change="onFileChange" />
      </div>
      <!-- show image -->
      <div v-if="image">
        <img id="img" :src="image" />
        <!-- <canvas id="canvas" ref="canvas" width="800" height="500"> </canvas> -->
      </div>
    </div>
    <!-- download image -->
    <button v-if="image">
      <a :download="image" :href="image">Download </a>
    </button>
  </div>
</template>
<script>
import jimpMixin from '~/mixins/jimpMixin'
export default {
  mixins: [jimpMixin],
  props: {
    options: {
      type: Object,
      default() {
        return {
          features: [],
          tools: [],
        }
      },
    },
    ftypes: {
      type: Array,
      default() {
        return {
          ftypes: [],
        }
      },
    },
  },
  data() {
    return {
      context: null,
      canvas: null,
      image: '',
      editingImage: '',
      text: null,
      brightVal: '0',
      contrastVal: '0',
      undoImage: [],
      redoImage: [],
    }
  },
  mounted() {
    // const c = document.getElementById('canvas')
    // console.log(c)
    // const canvas = this.$refs.canvas
    // console.log(canvas)
    // this.context = canvas.getContext('2d')
  },
  methods: {
    async onFileChange(e) {
      const file = e.target.files[0]
      if (!this.checkTypeImage(file)) {
        alert('File ' + file.type + ' is not supported')
        return
      }
      this.image = await this.readFileToBase64(file)
      // console.log(this.context)
      // this.context.drawImage(file, 0, 0)
      this.editingImage = this.image
    },
    onRemoveImage(e) {
      this.image = ''
      this.editingImage = ''
      this.undoImage.length = 0
      this.redoImage.length = 0
    },
    checkTypeImage(file) {
      const ftypes = this.ftypes
      let length = ftypes.length
      ftypes.forEach((ftype) => {
        if (file.type === 'image/' + ftype) length--
      })
      if (length === ftypes.length) return 0
      else return 1
    },
    checkImage() {
      if (!this.image) {
        alert('Please upload your image! ')
        return 0
      }
      return 1
    },
    callmethod(feature) {
      this.saveImage()
      if (!this.checkImage()) return
      if (feature === 'Bright') this['on' + feature](this.brightVal)
      else if (feature === 'Contrast') this['on' + feature](this.contrastVal)
      else this['on' + feature]()
      if (feature !== 'Bright' && feature !== 'Contrast')
        this.editingImage = this.image
    },
    callTool(tool) {
      this['on' + tool]()
    },
    async onRotateLeft() {
      this.image = await this.rotateImage(this.image, -90)
    },
    async onRotateRight() {
      this.image = await this.rotateImage(this.image, 90)
    },
    async onCropSquareTop() {
      this.image = await this.cropImage(this.image, 1)
    },
    async onCropSquareBottom() {
      this.image = await this.cropImage(this.image, -1)
    },
    async onCropSquareCenter() {
      this.image = await this.cropImage(this.image, 0)
    },
    async onText() {
      this.image = await this.writeTextImage(this.image, this.text)
      this.text = ''
    },
    async onFlipHorizontal() {
      this.image = await this.flipImage(this.image, 1)
    },
    async onFlipVertical() {
      this.image = await this.flipImage(this.image, -1)
    },
    async onBright(val) {
      this.image = await this.brightImage(this.editingImage, val / 10)
    },
    async onContrast(val) {
      this.image = await this.contrastImage(this.editingImage, val / 10)
    },
    async onGreyscale() {
      this.image = await this.greyscaleImage(this.editingImage)
    },
    onUndoImage() {
      if (this.undoImage.length >= 1) {
        const image = this.undoImage.pop()
        this.redoImage.push(this.image)
        this.image = image
      } else alert('Cant undo anymore!')
    },
    onRedoImage() {
      if (this.redoImage.length >= 1) {
        const image = this.redoImage.pop()
        console.log('redo' + image)
        this.undoImage.push(this.image)
        return (this.image = image)
      } else alert('Cant redo anymore!')
    },
    saveImage() {
      this.editingImage = this.image
      this.undoImage.push(this.image)
    },
  },
}
</script>
