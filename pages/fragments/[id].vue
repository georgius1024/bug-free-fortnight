<template>
  <template v-if="loading">
    <p>Loading</p>
  </template>
  <template v-else-if="item">
    <label>Название</label>
    <input v-model="item.name" />
    <label>Описание</label>
    <textarea v-model="item.description" rows="6">{{ item.description }}</textarea>
    <button @click="save">Сохранить</button>
    <template v-if="item.id">
      <hr />
      <label>Загрузить фрагмент (файл *.docx)</label>
      <input
        @change="setUploadFile"
        type="file"
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <button :disabled="uploadPending" @click="upload(item)">Загрузить</button>
    </template>
    <template v-if="stats?.size">
      <a :href="`/api/files/${item.id}`" class="flex">
        <svg width="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>download-box</title><path d="M5 3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3M8 17H16V15H8V17M16 10H13.5V7H10.5V10H8L12 14L16 10Z" /></svg>
        <label>Скачать фрагмент (docx, {{ stats.size }})</label>
      </a>
    </template>
    <p><NuxtLink :to="back">Назад</NuxtLink></p>
  </template>
</template>
<script setup lang="ts">
import { Fragment, Stats } from "~~/src/types";
import type { Ref } from "vue";
import { ref } from "vue";

const route = useRoute();
const { id } = route.params;

const uploadFile = ref<File | null>();

const back = "/fragments";

const setUploadFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target?.files) {
    return;
  }
  uploadFile.value = target?.files[0];
};
const uploadPending = ref(false);
const loading = ref(false);
const upload = async (item: Fragment | null) => {
  if (item && item.id && uploadFile.value) {
    const formData = new FormData();
    formData.append("id", item.id);
    formData.append("file", uploadFile.value);
    const { pending } = useLazyFetch<Fragment>(`/api/files/upload`, {
      method: "post",
      body: formData,
    });
    uploadPending.value = pending.value;
    watch(pending, (pending) => {
      uploadPending.value = pending;
      if (!pending) {
        setTimeout(() => alert("saved"), 0)
        navigateTo(back);
      }
    });
  }
};

const item: Ref<Fragment | null> = ref(null);
const stats: Ref<Stats | null> = ref(null);
if (id === "new") {
  item.value = { name: "New", description: "New" };
} else {
  loading.value = true;
  useFetch<Fragment>(`/api/fragments/${id}`).then(({ data, error }) => {
    item.value = data.value;
    loading.value = false;
  });
}

useFetch<Stats>(`/api/stats/${id}`).then(({ data, error }) => {
  stats.value = data.value;
});

const url = id === "new" ? "/api/fragments" : `/api/fragments/${id}`;
const method = id === "new" ? "post" : "put";
const save = () =>
  useFetch<Fragment>(url, {
    method,
    body: item.value,
  })
    .then(() => {
      setTimeout(() => alert("saved"), 0)
      navigateTo(back);
    })
    .catch((error) => alert(error));
</script>
