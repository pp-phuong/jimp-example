<template>
  <client-only>
    <div class="text-center">
      <ImageEditor :ftypes="ftypes" :options="options">
        <template v-slot:crop>
          <!-- Customize your button in here -->
          <!-- Value of v-slot is the feature you want to customize -->
        </template>
      </ImageEditor>
    </div>
  </client-only>
</template>

<script>
import { ImageEditor } from '../components'
export default {
  components: {
    ImageEditor,
  },
  data() {
    return {
      // upload photo format
      ftypes: ['jpg', 'png', 'jpeg'],

      options: {
        // the feature name to call the method
        features: [
          'RotateLeft',
          'RotateRight',
          'CropSquareTop',
          'CropSquareBottom',
          'CropSquareCenter',
          'Text',
          'FlipHorizontal',
          'FlipVertical',
          'Bright',
          'Contrast',
          'Greyscale',
        ],
        // tool name additional
        tools: ['RemoveImage', 'UndoImage', 'RedoImage'],
      },
    }
  },
}
</script>

<style></style>
