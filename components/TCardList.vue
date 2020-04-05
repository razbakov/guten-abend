<template>
  <div>
    <div class="md:flex items-baseline justify-between mb-4">
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <button
        v-if="add && can('add', collection)"
        class="btn"
        @click="currentId = 'add'"
      >
        {{ add }}
      </button>

      <slot name="header" />
    </div>

    <slot name="toolbar" />

    <div v-if="currentId === 'add'" class="card-item">
      <TForm
        class="px-6 py-4"
        :fields="fields"
        show-cancel
        @save="saveItem"
        @cancel="cancelItem"
      />
    </div>

    <div v-if="filters && filters.length > 1" class="md:flex">
      <button
        v-for="filter in filters"
        :key="filter.name"
        class="p-2 text-gray-700"
        :class="filter.name === activeFilter ? 'font-bold' : ''"
        @click="activeFilter = filter.name"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-for="(item, itemId) in items" :key="item.id" :item="item">
      <div class="card-item">
        <TForm
          v-if="currentId === itemId"
          v-model="items[itemId]"
          class="px-6 py-4"
          :fields="fields"
          show-cancel
          :show-remove="can('remove', collection, item)"
          @save="saveItem"
          @cancel="cancelItem"
          @remove="removeItem"
        />
        <div v-else>
          <div class="float-right mr-2 mt-2">
            <slot name="card-toolbar" :item="item" />

            <button
              v-if="fields.length && can('edit', collection, item)"
              class="rounded border p-2 hover:bg-gray-200"
              @click="currentId = itemId"
            >
              <TIconEdit />
            </button>
          </div>
          <slot :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api'
import { sortBy } from '~/utils'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useCollection from '~/use/collection'
import TIconEdit from '~/components/TIconEdit'
import TForm from '~/components/TForm'
export default {
  components: {
    TIconEdit,
    TForm
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    add: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    map: {
      type: [Function, Boolean],
      default: false
    }
  },
  data: () => ({
    currentId: false
  }),
  watch: {
    items(items) {
      this.$emit('loadItems', items)
    }
  },
  setup(props) {
    const { docs } = useCollection(props.collection)
    const { update, remove } = useDoc(props.collection)
    const { can } = useAuth()

    const activeFilter = ref(
      props.filters.find((filter) => !!filter.default)?.name
    )

    const items = computed(() => {
      if (!docs.value) {
        return []
      }

      let result = docs.value

      if (props.map) {
        result = result.map(props.map)
      }

      if (!activeFilter.value) {
        return result
      }

      const filterObject = props.filters.find(
        (filter) => filter.name === activeFilter.value
      )

      if (filterObject.map) {
        result = result.map(filterObject.map)
      }

      if (filterObject.filter) {
        result = result.filter(filterObject.filter)
      }

      if (filterObject.sort) {
        result = result.sort(sortBy(filterObject.sort))
      }

      return result
    })

    return {
      can,
      update,
      remove,
      items,
      activeFilter
    }
  },
  methods: {
    cancelItem() {
      this.currentId = false
    },
    async saveItem(data) {
      this.cancelItem()
      await this.update(data)
    },
    async removeItem(id) {
      this.cancelItem()
      await this.remove(id)
    }
  }
}
</script>
