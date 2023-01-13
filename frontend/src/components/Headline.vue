<template>
  <section class="section">
    <main class="main">
      <!-- Hero image -->
      <img src="../assets/images/x-ray.png" class="hero-image" />

      <!-- Caption -->
      <section class="md:w-5/12">
        <div class="title">{{ headline.title }}</div>

        <p class="description">
          {{ headline.description }}
        </p>

        <router-link :to="headline.signupPath">
          <a class="button">
            <span class="button-text">{{ headline.button }}</span>
          </a>
        </router-link>
      </section>
    </main>
  </section>
</template>

<script setup>
const headline = {
  title: 'iSART',
  signupPath: '/signup',
  description:
    'iSART aims to promote patient safety with proactive learning about ways that can go wrong (failure modes: FMs) in radiotherapy and facilitate the conduct of proactive risk assessment.',
  button: 'Sign up now',
};
</script>

<style scoped>
.section {
  @apply w-full px-6 py-12 md:px-16 xl:px-28 lg:min-h-screen bg-gradient-to-r from-indigo-400 via-pink-300 to-sky-300;
}

.main {
  @apply z-10 lg:pt-28 md:py-10 md:flex md:flex-row-reverse md:justify-between md:items-center gap-3;
}

.hero-image {
  @apply md:w-5/12 block mb-8 lg:mb-0;
}

.title {
  @apply lg:text-5xl lg:leading-snug text-3xl text-pink-600 font-semibold;
}

.description {
  @apply lg:text-2xl text-gray-200 font-light mt-4;
}

.button {
  @apply duration-300 cursor-pointer active:ring-2 ring-indigo-300 hover:scale-90  mt-4 w-8/12 lg:mt-8 justify-center flex items-center gap-2 lg:gap-3 bg-blue-900 py-3 px-3 lg:py-4 rounded-lg;
}

.button-text {
  @apply ml-2 lg:text-xl font-medium text-gray-100;
}
</style>
