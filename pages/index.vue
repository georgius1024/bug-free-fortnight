<template>
  <h1>Setup</h1>
  <template v-if="loadingFragments || loadingComposition">
    Loading
  </template>
  <template v-else>
    <Composer :composition="composition || []" :fragments="fragments || []" @change="updated" />
  </template>

</template>
<script setup lang="ts">
import Composer from "~~/components/Composer.vue";
import { Fragment, Composition } from "~~/src/types";

const { data: fragments, pending: loadingFragments } = useLazyFetch<Fragment[]>("/api/fragments");
const { data: composition, pending: loadingComposition } = useLazyFetch<Composition>("/api/composition");

// const composition = useCookie<Composition>('composition')
// console.log(composition.value, typeof composition.value)

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
</script>