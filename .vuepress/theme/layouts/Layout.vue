<template>
  <main class="container w-full md:max-w-xl mx-auto" v-if="$pagination">
    <article v-for="page in $pagination.pages" class="mb-4 block p-4 rounded">
      <div class="flex justify-between text-sm">
        <div>
          <time :datetime="page.frontmatter.date">{{ time(page.frontmatter.date) }}</time>
          <span class="ml-4 text-blue-600 text-sm">{{ page.frontmatter.category }}</span>
        </div>
        <div class="text-gray-600 flex">
          <span>{{ page.readingTime.text }}</span>
        </div>
      </div>

      <h2 class="text-2xl font-extrabold hover:underline">
        <router-link :to="page.path">
          {{ page.title }}
        </router-link>
      </h2>
      <div class="flex">
        <div class="text-lg">{{ page.frontmatter.description }}</div>
      </div>
    </article>
    <div class="mb-16 text-center markdown">
      <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink">Prev</router-link>
      <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink">Next</router-link>
    </div>
  </main>
</template>

<script>
import format from 'date-fns/format';

export default {
  methods: {
    time(val) {
      return format(new Date(val), 'do MMMM yyyy');
    }
  }
}
</script>
