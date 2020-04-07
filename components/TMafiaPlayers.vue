<template>
  <div>
    <TButton type="secondary" @click="showPopup = true">Select players</TButton>
    <template v-if="showPopup">
      <div
        class="fixed w-full top-0 left-0 bottom-0 h-screen bg-black opacity-50 border-l p-4"
      ></div>
      <div
        class="fixed md:w-1/3 w-full top-0 right-0 bottom-0 h-screen bg-light border-l px-4 overflow-scroll z-50"
      >
        <div class="sticky top-0 py-4 bg-light flex justify-between">
          <div class="text-3xl font-bold">Select players ({{ count }})</div>
          <TButton @click="save">Finish</TButton>
        </div>

        <TCardList
          v-slot="{ item }"
          :collection="collection"
          :filters="filters"
          :map="map"
        >
          <div
            :class="item.selected ? 'border-green-500' : ''"
            class="p-4 mb-4 card-item border-2 border-white"
            @click="selectItem(item.id)"
          >
            <div
              class="float-right border w-4 h-4 rounded-full border-gray-500"
              :class="item.selected ? 'bg-green-500 border-green-500' : ''"
            ></div>
            <div class="font-bold text-xl mb-2">
              {{ item.nickname }}
            </div>
            <div class="font-bold">
              {{ item.name }}
            </div>
            <div>
              {{ item.email }}
            </div>
          </div>
        </TCardList>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { ref } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useCollection from '~/use/collection'
import TCardList from '~/components/TCardList'
import TButton from '~/components/TButton'
import { getDay, getTime, getDate } from '~/utils'

export default {
  components: {
    TButton,
    TCardList
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    showPopup: false
  }),
  setup() {
    const title = 'Select players'
    const collection = 'accounts'

    const { can, isAdmin } = useAuth()
    const { updateById } = useDoc('accounts')
    const { docs: profiles } = useCollection('mafia_profiles')
    const selected = ref({})

    const fields = []

    const map = (item) => {
      const profile = profiles.value.find((profile) => profile.id === item.id)

      return {
        ...item,
        selected: selected.value[item.id],
        nickname: profile?.nickname || ''
      }
    }

    const filters = [
      {
        name: 'new',
        label: 'New',
        default: true,
        filter: (item) => !item.hidden,
        sort: 'nickname'
      }
    ]

    return {
      can,
      getDay,
      getTime,
      getDate,
      filters,
      fields,
      title,
      collection,
      isAdmin,
      updateById,
      map,
      selected
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  },
  methods: {
    loadItems(items) {
      this.emails = items.map((item) => item.email)
    },
    selectItem(itemId) {
      if (this.selected[itemId]) {
        Vue.delete(this.selected, itemId)
      } else {
        Vue.set(this.selected, itemId, true)
      }
    },
    save() {
      this.showPopup = false
    }
  }
}
</script>
