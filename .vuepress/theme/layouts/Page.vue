<template>
  <main v-if="$page.frontmatter.qrcode && $route.query.share" class="md:flex">
    <div class="md:w-1/3">
      <img src="/qr.svg" class="w-full" />
    </div>
    <article class="markdown container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
      <Content />
    </article>
  </main>
  <main v-else class="markdown">
    <article class="container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
      <Content />
    </article>
  </main>
</template>

<script>
import format from "date-fns/format";

export default {
  methods: {
    time(val) {
      return format(new Date(val), "do MMMM yyyy");
    }
  }
};
</script>
