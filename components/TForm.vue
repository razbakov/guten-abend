<template>
  <form @submit.prevent="save">
    <div
      v-for="field in fields"
      :key="field.name"
      class="md:flex md:items-top mb-6"
    >
      <div class="md:w-1/3">
        <label
          :for="field.name"
          class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
        >
          {{ field.label }}
        </label>
      </div>
      <div class="md:w-2/3">
        <textarea
          v-if="field.type === 'textarea'"
          :id="field.name"
          v-model="data[field.name]"
          :placeholder="field.placeholder"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
        />
        <input
          v-else
          :id="field.name"
          v-model="data[field.name]"
          :placeholder="field.placeholder"
          :type="field.type || 'text'"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </div>
    </div>
    <div class="flex justify-end">
      <button class="btn" type="submit">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    },
    submitLabel: {
      type: String,
      default: 'Save'
    }
  },
  data: () => ({
    data: {}
  }),
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.data = { ...this.value }
    },
    save() {
      this.$emit('save', this.data)
    }
  }
}
</script>
