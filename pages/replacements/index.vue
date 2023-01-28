<template>
  <template v-if="loading"> loading </template>
  <template v-else-if="items?.length">
    <h1>Подстановки</h1>
    <table>
      <thead>
        <tr>
          <th>Код</th>
          <th>&nbsp;</th>
          <th>Замена</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" valign="middle">
          <td>
            <input
              :value="item.code"
              class="mb-0"
              @change="update(item, 'code', $event)"
            />
          </td>
          <td class="text-center">=&gt;</td>
          <td>
            <input
              :value="item.replacement"
              class="mb-0"
              @change="update(item, 'replacement', $event)"
            />
          </td>
          <td class="text-center">
            <RemoveButton :disabled="destroing" @remove="destroy(item)"/>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="100%" class="text-right">
            <button :disabled="creating" @click="create">Создать подстановку</button>
          </th>
        </tr>
      </tfoot>
    </table>
  </template>
  <template v-else>
    <h1>Нет подстановок</h1>
    <button :disabled="creating" @click="create">Создать подстановку</button>
  </template>
</template>

<script setup lang="ts">
import RemoveButton from "~~/components/RemoveButton.vue";
import { Replacement } from "~~/src/types";

const { data: items, pending: loading } =
  useLazyFetch<Replacement[]>("/api/replacements");

const creating = ref(false);
const create = async () => {
  creating.value = true;
  const { data: created, error } = await useFetch<Replacement>(
    "/api/replacements",
    {
      method: "post",
      body: { code: "", replacement: "" },
    }
  );
  creating.value = false;

  if (items.value && created.value) {
    items.value = [...items.value, created.value];
  }
  if (error.value) {
    console.log(error.value);
  }
};

const updating = ref(false);
const update = async (item: Replacement, key: string, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  const { id = "" } = item;
  updating.value = true;
  const { data: updated, error } = await useFetch<Replacement>(
    `/api/replacements/${id}`,
    {
      method: "put",
      body: { ...item, [key]: value },
    }
  );
  updating.value = false;

  if (items.value && updated.value) {
    const updatedItems = items.value.map((item) => {
      if (item.id === id) {
        return updated.value;
      }
      return item;
    });
    items.value = updatedItems as Replacement[];
  }
  if (error.value) {
    console.log(error.value);
  }
};

const destroing = ref(false);
const destroy = async (item: Replacement) => {
  const { id = "" } = item;
  destroing.value = true
  const {error} = await useFetch(`/api/replacements/${id}`, { method: "delete" })
  destroing.value = false
  items.value = items.value && items.value.filter((e) => e.id !== id);
  if (error.value) {
    console.log(error.value);
  }
  setTimeout(() => alert("deleted"), 0)
};
</script>
