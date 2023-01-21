<template>
  <template v-if="loading">
    <p>Loading...</p>
  </template>
  <template v-else-if="item">
    <label>Name</label>
    <input v-model="item.name" />
    <label>Description</label>
    <textarea v-model="item.description">{{ item.description }}</textarea>
    <button @click="save">Save</button>
    <template v-if="item.id">
      <hr />
      <label>Upload DOC</label>
      <input
        @change="setUploadFile"
        type="file"
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <button :disabled="uploadPending" @click="upload(item)">Upload</button>
    </template>
    <template v-if="stats?.size">
      <label>Download DOC ({{ stats.size }})</label>
      <a href="`/files/${item.id}`">Download</a>
    </template>
    <p><NuxtLink :to="back">Back</NuxtLink></p>
  </template>
</template>
<script setup lang="ts">
import { Fragment, Stats } from "~~/src/types";
import type { Ref } from "vue";
import { ref } from "vue";

const route = useRoute();
const { id } = route.params;

const uploadFile = ref<File | null>();

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
    const { pending } = useLazyFetch<Fragment>(`/api/fragments/upload`, {
      method: "post",
      body: formData,
    });
    uploadPending.value = pending.value;
    watch(pending, (pending) => {
      uploadPending.value = pending;
    });
  }
};

// function load(id: string | string[]): Ref<Fragment | null> {
//   console.log(ssr)
//   if (!ssr) {
//     loading.value = true;
//   }
//   if (id === "new") {
//     loading.value = false;
//     return ref({ name: "", description: "" });
//   }
//   const { data, pending } = useLazyFetch<Fragment>(`/api/fragments/${id}`);
//   watch(pending, (pending) => {
//     loading.value = pending;
//   });

//   return data;
// }

// const item = await loadAsync(id); //ref({ name: "", description: "" })

// async function loadAsync(id: string | string[]): Promise<Ref<Fragment|null>> {
//   return new Promise(resolve => {
//     if (id === "new") {
//       resolve(ref({ name: "New", description: "New" }));
//     } else {
//       loading.value = true;
//       useFetch<Fragment>(`/api/fragments/${id}`).then(({data, error}) => {
//         resolve(data)
//         loading.value = false;
//       })
//     }
//   })
// }

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

const back = "/fragments";
const url = id === "new" ? "/api/fragments" : `/api/fragments/${id}`;
const method = id === "new" ? "post" : "put";
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
