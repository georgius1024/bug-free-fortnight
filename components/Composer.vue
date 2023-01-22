<template>
  <div class="composer">
    <draggable :modelValue="notUsed" itemKey="id" group="grags" :sort="false" class="sidebar">
      <template #item="{ element }">
        <div class="element">{{ element.name }}</div>
      </template>
    </draggable>
    <draggable :modelValue="composition" itemKey="id" group="grags" class="composition" @update:modelValue="updated">
      <template #item="{ element }">
        <div class="element">{{ element.name }}</div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import type { Ref, PropType } from "vue";
import draggable from "vuedraggable";
import { Fragment, Composition } from "~~/src/types";

const props = defineProps({
  composition: {
    type: Object as PropType<Composition>,
    required: true,
  },
  fragments: {
    type: Array as PropType<Fragment[]>,
    required: true,
  },
});

const emit = defineEmits(["change"]);
const list: Ref<Fragment[]> = ref([]);

const notUsed = computed(() => {
  const used = props.composition.map((e) => e.id);
  return props.fragments.filter(
    (item) => !used.includes((item as Fragment).id)
  );
});

const updated = (list: Composition) => {
  emit("change", list);
};
</script>
<style scoped type="text/scss">
.composer {
  height: calc(100vh - 400px);
  border: 1px solid #ccc;
  display: flex;
}

.sidebar {
  max-height: 100%;
  width: 33%;
  background-color: #333;
  overflow-y: auto;
  padding: 6px;
}

.composition {
  overflow-y: auto;
  padding: 6px;
  background-color: #111;
  flex-grow: 1;
}

.element {
  padding: 8px;
  border-radius: 16px;
  margin: 4px;
  border: 1px solid #777;
}
</style>
