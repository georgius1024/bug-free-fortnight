<template>
  <template v-if="loading"> loading </template>
  <template v-else>
    <h1>Replacements</h1>
    <table>
      <thead>
        <th>Code</th>
        <th>Replacement</th>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.code">
          <td>{{ item.code }}</td>
          <td>{{ item.replacement }}</td>
          <td>
            <div
              class="text-slate-200 text-sm text-right"
              @click="destroy(item.code)"
            >
              [delete]
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="100%" class="text-right">
            <button @click="create">Add</button>
          </th>
        </tr>
      </tfoot>
    </table>
    {{ items }}
  </template>
</template>

<script setup lang="ts">
import { Replacement } from "~~/src/types";

const { data: items, pending: loading } =
  useLazyFetch<Replacement[]>("/api/replacements");


const create = () => {
  if (items.value) {
    items.value = [...items.value, {code: '', replacement: ''}]
  }
}

const destroy = (code: string) => {
  useFetch(`/api/replacements/${code}`, { method: "delete" })
    .then(() => {
      items.value = items.value && items.value.filter((e) => e.code !== code);
      alert("deleted");
    })
    .catch((e) => alert(e));
};
</script>
