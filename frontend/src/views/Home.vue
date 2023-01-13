<template>
  <Navbar />
  <Headline />

  <Footer />
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Headline from '@/components/Headline.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'Home',
  components: { Navbar, Headline, Footer },
};
</script>
