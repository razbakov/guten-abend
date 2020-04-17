<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:header>
        <div class="text-gray-900">
          Vote for ideas from members of our club or add yours.
          <span v-if="!uid">Sign in first.</span>
        </div>
        <div class="text-sm text-gray-700">
          Once idea gets enough fans we will schedule an event and notify you.
        </div>
      </template>
      <template v-slot:card-toolbar="{ item }">
        <button
          v-if="can('manage', collection, item)"
          class="p-2 hover:text-primary"
          @click="
            openedListId !== item.id
              ? (openedListId = item.id)
              : (openedListId = false)
          "
        >
          <TPeopleIcon
            :class="openedListId === item.id ? 'text-primary' : ''"
          />
        </button>
      </template>
      <template v-slot:default="{ item }">
        <TGuests
          v-if="openedListId === item.id"
          :id="item.id"
          class="p-4 card-item"
        />
        <div v-else class="p-4 card-item">
          <div class="flex">
            <div class="flex-grow">
              <div class="font-bold text-xl mb-2">{{ item.title }}</div>
              <TPreview class="mb-2" :content="item.description" />
            </div>
            <div class="text-gray-500 w-8 ml-2 text-center">
              <button
                class="text-center hover:text-green-500"
                :class="{ 'text-green-500': item.response === 'yes' }"
                @click="updateRsvp(item.id, collection, 'yes')"
              >
                <UpIcon class="h-6 w-6" />
              </button>
              <div class="text-gray-700 font-bold leading-none">
                {{ item.upVotes }}
              </div>
              <div class="text-gray-700 text-sm">votes</div>
              <button
                class="text-center hover:text-primary"
                :class="{ 'text-primary': item.response === 'no' }"
                @click="updateRsvp(item.id, collection, 'no')"
              >
                <DownIcon class="h-6 w-6 hover:text-primary" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { ref } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TGuests from '~/components/TGuests'
import UpIcon from '~/components/icons/Up'
import DownIcon from '~/components/icons/Down'
import TPeopleIcon from '~/components/icons/People'

export default {
  components: {
    TCardList,
    TPreview,
    TGuests,
    UpIcon,
    DownIcon,
    TPeopleIcon
  },
  setup() {
    const title = 'Ideas'
    const collection = 'ideas'
    const add = 'Add your idea'

    const { getCount, getRsvpResponse, updateRsvp } = useRSVP()
    const openedListId = ref(false)

    const fields = [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Summarize your idea in 2-3 words'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'markdown',
        placeholder: 'Describe your idea'
      }
    ]

    const filters = [
      {
        name: 'active',
        label: 'Active',
        default: true,
        map: (item) => {
          const upVotes = getCount(item.id)
          const downVotes = getCount(item.id, 'no')
          const votes = upVotes - downVotes
          const response = getRsvpResponse(item.id)
          const multi = !response ? 3 : response === 'yes' ? 2 : 1
          const order = multi * 100 + votes

          return {
            ...item,
            upVotes,
            downVotes,
            votes,
            response,
            order
          }
        },
        sort: '-order'
      }
    ]

    const { can, uid } = useAuth()

    return {
      can,
      uid,
      fields,
      title,
      collection,
      add,
      filters,
      openedListId,
      updateRsvp
    }
  }
}
</script>
