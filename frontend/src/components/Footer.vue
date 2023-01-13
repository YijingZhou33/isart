<template>
  <section class="section">
    <footer class="text-gray-100">
      <section class="footer-container">
        <section class="md:w-6/12">
          <div class="footer-title">{{ footer.leftCol.title }}</div>
          <p class="font-light">
            {{ footer.leftCol.description }}
          </p>
        </section>
        <section class="md:w-6/12">
          <div class="footer-title">{{ footer.rightCol.title }}</div>
          <p class="font-light">
            {{ footer.rightCol.description }}
          </p>
          <ul class="mt-2">
            <template v-for="{ detail, icon } in footer.contact" :key="detail">
              <li>
                <font-awesome-icon :icon="`fa-solid ${icon}`" size="lg" />
                <span class="mr-2"></span>
                <a :href="'mailto:' + detail" class="email">{{ detail }}</a>
              </li>
            </template>
          </ul>
        </section>
      </section>
      <section class="copyright">
        {{ footer.copyright.description }}
        <span v-html="footer.copyright.icon"></span>
        {{ footer.copyright.year }}
      </section>
    </footer>
  </section>
</template>

<script setup>
const footer = {
  leftCol: {
    title: 'IMPORTANT NOTE',
    description:
      'The FMs library should be used thoroughly as an advisory tool and not as a ready-made product. Every department functions under its own workflow, protocols, and safety barriers which lead every risk assessment study.',
  },
  rightCol: {
    title: 'Lorem ipsum dolor sit amet consectetur',
    description:
      "The program is a collaboration of the University of West Attica in Athens and Vrije University in Amsterdam for the fulfillment of a PhD and master's degree.",
  },
  contact: [{ detail: 'isartcontact@gmail.com', icon: 'fa-envelope' }],
  copyright: {
    description: 'All rights reserved.',
    icon: '&copy;',
    year: '2022',
  },
};
</script>

<style scoped>
.section {
  @apply w-full px-6 py-12 md:px-16 xl:px-28 bg-gradient-to-r from-blue-900 to-slate-700;
}

.footer-container {
  @apply w-full flex flex-col gap-10 md:flex-row md:justify-between lg:justify-center;
}

.footer-title {
  @apply text-pink-300 font-normal font-bold;
}

.email {
  @apply font-light underline-offset-4 underline;
}

.copyright {
  @apply w-full text-center mt-16 font-light;
}
</style>
