<template>
  <div class="flex">
    <button
      v-for="i in 5"
      :key="i"
      type="button"
      class="focus:outline-none"
      :class="{ 'mr-1': i < 5 }"
      @click="$emit('input', i)"
    >
      <svg
        class="block h-8 w-8"
        :class="[value >= i ? 'text-primary' : 'text-gray-500']"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  }
}
</script>
