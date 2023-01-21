<template>
  <div class="flex items-center justify-center h-full flex-col">
    <h1>Index page</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <div>
          <NuxtLink :to="`fragments/${item.id}`">{{ item.name }}</NuxtLink>
        </div>
        <div>{{ item.description }}</div>
        <div @click="destroy(item.id)">x</div>
      </li>
    </ul>
    <p><NuxtLink :to="`fragments/new`">New</NuxtLink></p>
    <p><NuxtLink to="../">Back</NuxtLink></p>
  </div>
</template>
<script setup>
const { data: items, error } = await useFetch("/api/fragments");

const destroy = (id) => {
  useFetch(`/api/fragments/${id}`, { method: "delete" })
    .then(() => {
      items.value = items.value.filter((e) => e.id !== id);
      alert("deleted");
    })
    .catch((e) => alert(e));
};
</script>
