<template>
  <div class="bg-black text-white h-screen flex">
    <div class="w-1/6"></div>
    <main class="h-full w-4/6">
      <header>
        <ul class="flex list-none">
          <li class="list-none m-0 py-2 pr-4"><NuxtLink to="/">Начало</NuxtLink></li>
          <li class="list-none m-0 py-2 pr-4"><NuxtLink to="/fragments">Фрагменты</NuxtLink></li>
          <li class="list-none m-0 py-2"><NuxtLink to="/replacements">Подстановки</NuxtLink></li>
        </ul>
      </header>

      <slot />
    </main>
    <div class="w-1/6"></div>
  </div>
</template>
<style>
html, body {
  height: 100%;
  background-color: black;
}
</style>