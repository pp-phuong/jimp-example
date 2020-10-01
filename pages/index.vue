<template>
  <div>
    <ImageEditor :allow-format="allowFormat" :options="options">
      <slot> </slot>
    </ImageEditor>
  </div>
</template>

<script>
import { ImageEditor } from '../components'
export default {
  components: {
    ImageEditor,
  },
  data() {
    return {
      allowFormat: ['jpeg', 'png', 'jpg'],
      options: {
        features: [
          'RotateLeft',
          'RotateRight',
          'FlipHorizontal',
          'FlipVertical',
          'Bright',
          'Contrast',
          'Opacity',
          'Blur',
          'CropSquareTop',
          'CropSquareBottom',
          'CropSquareCenter',
          'Text',
        ],
        tools: ['UndoImage', 'RedoImage', 'RemoveImage'],
      },
    }
  },
}
</script>

<style></style>
