<template>
  <template v-if="loading"> loading </template>
  <template v-else-if="items?.length">
    <h1>Fragments</h1>
    <ul class="list-none">
      <li v-for="item in items" :key="item.id" class="list-none block">
        <div>
          <NuxtLink :to="`fragments/${item.id}`">{{ item.name }}</NuxtLink>
          <RemoveButton class="float-right" :disabled="destroing" @click="destroy(item)"/>
        </div>
        <div class="mr-10">{{ item.description }}</div>
      </li>
    </ul>
    <NuxtLink tag="button" to="fragments/new"><button>Create fragment</button></NuxtLink>
  </template>
  <template v-else>
    <h1>No replacements</h1>
    <NuxtLink tag="button" to="fragments/new"><button>Create fragment</button></NuxtLink>
  </template>
</template>
<script setup lang="ts">
import RemoveButton from "~~/components/RemoveButton.vue";
import { Fragment } from "~~/src/types";
const { data: items, pending: loading } = useLazyFetch<Fragment[]>("/api/fragments");

const destroing = ref(false);
const destroy = async (item: Fragment) => {
  const { id = "" } = item;
  destroing.value = true
  const {error} = await useFetch(`/api/fragments/${id}`, { method: "delete" })
  destroing.value = false
  items.value = items.value && items.value.filter((e) => e.id !== id);
  if (error.value) {
    console.log(error.value);
  }
  setTimeout(() => alert("deleted"), 0)
};
</script>
