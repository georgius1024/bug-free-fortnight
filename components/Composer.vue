<template>
  <div class="composer">
    
    <draggable :modelValue="notUsed" itemKey="id" group="grags" :sort="false" class="sidebar">
      <template #header>
        <h2 class="text-white m-0">Fragments</h2>
      </template>      
      <template #item="{ element }">
        <div class="element">
          {{ element.name }}
          <p v-if="element.description" class="brief" v-html="element.description"/>

        </div>
      </template>
    </draggable>
    <draggable :modelValue="compositionItems" itemKey="id" group="grags" class="composition" @update:modelValue="updated">
      <template #header>
        <h2 class="text-white m-0">Composition</h2>
      </template>      
      <template #item="{ element }">
        <div class="element">
          {{ element.name }}
          <p v-if="element.description" v-html="element.description"/>
        </div>
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
  return props.fragments.filter(
    (item) => !props.composition.includes((item?.id || ''))
  );
});

const compositionItems = computed(() => {
  const fragments = new Map()
  props.fragments.forEach(item => fragments.set(item.id, item))
  return props.composition.map(id => fragments.get(id))
});

const updated = (list: Fragment[]) => {
  emit("change", list.map(item => item?.id || ''));
};
</script>
<style scoped type="text/scss">
.composer {
  height: calc(100vh - 300px);
  border: 1px solid #ccc;
  display: flex;
}

.sidebar {
  max-height: 100%;
  width: 33%;
  min-width: 33%;
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
.brief {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.element {
  padding: 8px;
  border-radius: 16px;
  margin: 4px;
  border: 1px solid #777;
}
</style>
