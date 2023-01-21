<template>
  <template v-if="pending">
    <p>Loading...</p>
  </template>
  <template v-else-if="item">
    <label>Name</label>
    <input v-model="item.name" />
    <label>Description</label>
    <textarea v-model="item.description">{{ item.description }}</textarea>
    <button @click="save">Save</button>
    <p><NuxtLink :to="back">Back</NuxtLink></p>
  </template>
</template>
<script setup lang="ts">
import { Fragment } from "~~/src/types";
import { ref } from 'vue'
import type { Ref } from 'vue'

const route = useRoute();
const { id } = route.params;
interface combo {
  item: Ref<Fragment|null>,
  pending: Ref<boolean>
}
async function load(id:string|string[]):Promise<combo> {
  if (id === 'new') {
    return {
      item: ref({name: '', description: ''}),
      pending: ref(false)
    }
  }
  const { data: item, pending } = await useLazyFetch<Fragment>(
    `/api/fragments/${id}`
  );
  return {
    item, pending
  }
}

const {item, pending} = await load(id)

const back = "/fragments";
const url = id === 'new' ? '/api/fragments' : `/api/fragments/${id}`
const method = id === 'new' ? 'post' : 'put'
const save = () =>
  useFetch<Fragment>(url, {
    method,
    body: item.value,
  })
    .then(() => {
      alert("saved!");
      navigateTo(back);
    })
    .catch((error) => alert(error));
</script>
