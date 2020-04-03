<template>
  <form @submit.prevent="save">
    <div v-for="field in fields" :key="field.name">
      <div class="md:flex md:items-top mb-6">
        <div class="md:w-1/3">
          <label
            :for="field.name"
            class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            {{ getLabel(field) }}
          </label>
        </div>
        <div class="md:w-2/3">
          <p v-if="field.description" class="text-sm text-gray-700 mb-2">
            {{ field.description }}
          </p>
          <textarea
            v-if="field.type === 'textarea'"
            :id="field.name"
            v-model="data[field.name]"
            :placeholder="field.placeholder"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
          />
          <div
            v-else-if="field.type === 'select'"
            class="inline-block relative"
          >
            <select
              v-model="data[field.name]"
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option
                v-for="option in field.options"
                :key="option"
                :value="option"
                >{{ getLabel(option) }}</option
              >
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
          <input
            v-else
            :id="field.name"
            v-model="data[field.name]"
            :disabled="field.disabled"
            :placeholder="field.placeholder"
            :type="field.type || 'text'"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <button class="btn" type="submit">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<script>
const camelcase = (text) => {
  const result = text.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
}

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
  watch: {
    value(val) {
      this.data = { ...val }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.data = { ...this.value }
    },
    save() {
      this.$emit('save', this.data)
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    }
  }
}
</script>
