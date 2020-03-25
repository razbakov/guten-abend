<template>
  <div
    class="container bg-gray-100 text-center p-4 w-full md:max-w-xl mx-auto border border-gray-400"
  >
    <a
      target="_blank"
      v-bind="$attrs"
      rel="noopener noreferrer"
      class="bg-blue-500 hover:bg-blue-700 no-underline text-white font-semibold py-2 px-4 border border-blue-400 rounded shadow"
    >
      <slot />
    </a>
  </div>
</template>
