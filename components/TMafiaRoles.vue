<template>
  <div>
    <div v-for="(player, id) in data.players" :key="id" class="flex mb-4">
      <div class="w-1/2">{{ player.nickname }}</div>
      <div class="inline-block relative">
        <select
          v-model="roles[id]"
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option v-for="option in options" :key="option" :value="option">{{
            getLabel(option)
          }}</option>
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
    data: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    options: ['citizen', 'sheriff', 'mafia', 'don'],
    roles: {}
  }),
  watch: {
    roles: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.roles = this.value
  },
  methods: {
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
