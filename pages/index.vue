<template>
  <main class="container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div>
      <div class="typo">
        <p><strong>Everyhing closed?</strong></p>
        <h1>We are open 24/7</h1>
        <p>
          Guten Abend is a social hub to socialize and have fun. We meet via
          Zoom online. Join to get emails about our next events.
        </p>
      </div>
      <div class="container text-center p-4 w-full md:max-w-xl mx-auto">
        <nuxt-link
          to="/signup"
          class="bg-primary hover:shadow no-underline text-white font-semibold py-2 px-4 rounded text-white"
        >
          Join Now
        </nuxt-link>
      </div>
      <div class="typo">
        <h2>Any time of the day</h2>
        <details class="custom-block details"
          ><summary>Morning</summary>
          <ul>
            <li>Yoga</li>
            <li>Accountability groups (support groups to achieve goals)</li>
          </ul></details
        >
        <details class="custom-block details"
          ><summary>Lunch</summary>
          <ul>
            <li><a href="/salsa">Salsa Warm Up</a></li>
          </ul></details
        >
        <details class="custom-block details"
          ><summary>Evening</summary>
          <ul>
            <li><a href="/mafia">Mafia Game</a></li>
            <li>Conversation games</li>
            <li>Concerts</li>
            <li>Board games</li>
            <li>Storytelling</li>
            <li>Presentations</li>
            <li>Stand-up comedy</li>
          </ul></details
        >
        <h2>Want more?</h2>
        <p>
          <a
            href="https://github.com/razbakov/guten-abend/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            >Suggest an idea</a
          >
        </p>
        <p>
          We are also looking for creators and animators, who would like to
          contribute to our club and share some fun with us!
        </p>
        <p>
          Stay healthy!
          <a
            href="https://razbakov.com"
            target="_blank"
            rel="noopener noreferrer"
            >Aleksey Razbakov</a
          >
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import useThreads from '~/use/threads.js'

export default {
  setup() {
    const { create, loading } = useThreads()

    return {
      create,
      loading
    }
  }
}
</script>
