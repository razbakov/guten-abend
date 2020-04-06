<template>
  <div class="p-4 text-center border-t bg-orange-100">
    <h3 class="text-xl">How was it?</h3>
    <div class="flex justify-center my-4">
      <TRating v-model="rating" />
    </div>
  </div>
</template>

<script>
import TRating from '~/components/TRating'
import useRSVP from '~/use/rsvp'
import useDoc from '~/use/doc'

export default {
  components: {
    TRating
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    rating: 0
  }),
  setup(props) {
    const { getRsvp } = useRSVP()
    const { updateById } = useDoc('participants')
    const rsvpOpbject = getRsvp(props.id)

    return {
      updateById,
      rsvpOpbject
    }
  },
  watch: {
    rating(val) {
      this.updateById(this.rsvpOpbject.id, {
        feedback: val
      })
    }
  }
}
</script>
