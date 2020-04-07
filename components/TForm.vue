<template>
  <div>
    <div v-for="field in fields" :key="field.name">
      <div class="md:flex md:items-top mb-6">
        <div v-if="!field.hideLabel" class="md:w-1/3">
          <label
            :for="field.name"
            class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
          >
            {{ getLabel(field) }}
            <span v-if="field.required">*</span>
          </label>
        </div>
        <div class="w-full">
          <p v-if="field.description" class="text-sm text-gray-700 mb-2">
            {{ field.description }}
          </p>
          <component
            :is="field.component"
            v-if="field.component"
            v-model="data[field.name]"
            v-bind="field"
          />
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            v-model="data[field.name]"
            :placeholder="field.placeholder"
            :class="
              error && error.fields && error.fields[field.name]
                ? 'border-red-500'
                : ''
            "
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            rows="10"
            type="text"
          />
          <div
            v-else-if="field.type === 'select'"
            :class="
              error && error.fields && error.fields[field.name]
                ? 'border-red-500'
                : ''
            "
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
            :class="
              error && error.fields && error.fields[field.name]
                ? 'border-red-500'
                : ''
            "
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>
    </div>
    <div v-if="error" class="text-red-500 py-4 text-right">
      {{ error.message }}
    </div>
    <div class="flex justify-end">
      <button
        v-if="showRemove"
        class="p-2 px-4 underline text-red-500"
        @click="remove"
      >
        Delete
      </button>
      <button v-if="showCancel" class="p-2 px-4 underline" @click="cancel">
        Cancel
      </button>
      <button class="btn" @click="save">{{ submitLabel }}</button>
    </div>
  </div>
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
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    data: {},
    error: false
  }),
  watch: {
    value: 'load'
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.data = { ...this.value }

      this.fields
        .filter((field) => field.default)
        .forEach((field) => {
          if (!this.data[field.name]) {
            this.data[field.name] = field.default
          }
        })
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    },
    remove() {
      this.$emit('remove', this.data.id)
    },
    cancel() {
      this.$emit('cancel')
    },
    save() {
      this.error = false

      this.fields
        .filter((field) => field.required)
        .forEach((field) => {
          if (!this.data[field.name]) {
            this.error = {
              ...this.error,
              message: 'Fill required fields',
              fields: {
                [field.name]: true
              }
            }
          }
        })

      if (this.error) {
        return
      }

      this.$emit('save', this.data)
    }
  }
}
</script>
