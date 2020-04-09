<template>
  <div>
    <TButton type="secondary" @click="showPopup = true"
      >Select accounts ({{ count }})</TButton
    >
    <template v-if="showPopup">
      <div
        class="fixed z-10 w-full top-0 left-0 bottom-0 h-screen bg-black opacity-50 border-l p-4"
      ></div>
      <div
        class="fixed z-20 md:w-1/3 w-full top-0 right-0 bottom-0 h-screen bg-light border-l px-4 overflow-scroll z-50"
      >
        <div
          class="sticky top-0 py-4 bg-light flex justify-between items-center"
        >
          <div>
            <div class="font-bold">Select accounts ({{ count }})</div>
            <div class="flex">
              <button
                class="p-1 underline hover:no-underline"
                @click="selectAll(true)"
              >
                All
              </button>
              <button
                class="p-1 underline hover:no-underline"
                @click="selectAll(false)"
              >
                None
              </button>
            </div>
          </div>
          <TButton @click="save">Finish</TButton>
        </div>

        <div>
          <div
            v-for="item in items"
            :key="item.id"
            :class="item.selected ? 'border-green-500' : ''"
            class="p-4 mb-4 card-item border-2 border-white"
            @click="select(item)"
          >
            <div
              class="float-right border w-4 h-4 rounded-full border-gray-500"
              :class="selected[item.id] ? 'bg-green-500 border-green-500' : ''"
            ></div>
            <div v-if="item.nickname" class="font-bold text-xl mb-2">
              {{ item.nickname }}
            </div>
            <div class="font-bold">
              {{ item.name }}
            </div>
            <div>
              {{ item.email }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import TButton from '~/components/TButton'
import { sortBy } from '~/utils'

export default {
  components: {
    TButton
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showPopup: false,
    selected: {}
  }),
  setup() {
    const { isAdmin } = useAuth()
    const { docs } = useCollection('accounts')

    const items = computed(() =>
      docs.value.filter((item) => !item.hidden).sort(sortBy('-createdAt'))
    )

    return {
      isAdmin,
      items
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    }
  },
  watch: {
    value: 'load'
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
    this.load()
  },
  methods: {
    load() {
      this.selected = this.value
    },
    select(item, mark) {
      if (typeof mark === 'undefined') {
        mark = !this.selected[item.id]
      }

      if (mark) {
        Vue.set(this.selected, item.id, {
          email: item.email,
          name: item.name
        })
      } else {
        Vue.delete(this.selected, item.id)
      }
    },
    selectAll(mark) {
      this.items.forEach((item) => {
        this.select(item, mark)
      })
    },
    save() {
      this.showPopup = false
      this.$emit('input', this.selected)
    }
  }
}
</script>
