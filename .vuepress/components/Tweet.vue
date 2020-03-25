<template>
  <Tweet :id="tweetId"></Tweet>
</template>

<script>
import { Tweet } from "vue-tweet-embed";

export default {
  props: ["id"],
  components: {
    Tweet
  },
  computed: {
    tweetId() {
      return this.id.toString();
    }
  }
};
</script>

<style></style>
