<template>
  <div
    class="text-red w-8 h-8 text-2xl border-2 border-current cursor-pointer rounded-full inline-flex items-center justify-center"
    :class="{disabled}"
    @click="!disabled && $emit('remove')"
  >
    &times;
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
<style type="text/scss">
.text-red {
  color: red;
}
.disabled {
  cursor: not-allowed !important;
  opacity: 50%;
  pointer-events: none;
}
</style>
