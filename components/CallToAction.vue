<template>
  <div class="containe text-center p-4 w-full md:max-w-xl mx-auto">
    <a
      target="_blank"
      v-bind="$attrs"
      rel="noopener noreferrer"
      class="bg-primary hover:shadow no-underline text-white font-semibold py-2 px-4 rounded"
    >
      <slot />
    </a>
  </div>
</template>
