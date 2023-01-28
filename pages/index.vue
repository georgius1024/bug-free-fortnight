<template>
  <template v-if="loadingFragments || loadingComposition">
    Идет загрузка...
  </template>
  <template v-else>
    <Composer :composition="composition || []" :fragments="fragments || []" @change="updated" />
    <button class="mt-4" @click="download">Скачать документ</button>
  </template>

</template>
<script setup lang="ts">
import Composer from "~~/components/Composer.vue";
import { Fragment, Composition } from "~~/src/types";

const { data: fragments, pending: loadingFragments } = useLazyFetch<Fragment[]>("/api/fragments");
const { data: composition, pending: loadingComposition } = useLazyFetch<Composition>("/api/composition");

const updated = async (data: any) => {
  composition.value = data

  const { error } = await useLazyFetch<Composition>("/api/composition", {
    method: "put",
    body: data,
  })

  if (error.value) {
    console.log(error.value);
  }
}
const download = async () => {
  const { data } = await useLazyFetch<Blob>("/api/composition", {
    method: 'post'
  })

  if (data?.value) {
    const blob = data.value
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'composition.docx'
    link.click()
    URL.revokeObjectURL(link.href)
  }
}


</script>