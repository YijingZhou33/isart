<template>
  <main class="navbar">
    <section class="navbar-brand">
      <img src="../assets/images/radiotherapy.png" width="45" />
      <router-link to="/">
        <div class="navbar-title">
          {{ title }}
        </div>
      </router-link>

      <button @click="displayMenu" class="active:scale-95 duration-300 md:hidden" type="button">
        <font-awesome-icon icon="fa-solid fa-bars" size="lg" inverse />
      </button>
    </section>

    <section :class="screenWidth >= 768 || (screenWidth < 768 && showMenu) ? 'right-0' : '-right-full'" class="navbar-menu">
      <ul class="navbar-list">
        <span @click="displayMenu" class="md:hidden"><font-awesome-icon icon="fa-solid fa-xmark" inverse /></span>
        <template v-for="{ name, path, icon } in menus" :key="name">
          <li :class="menuActive === path ? 'border-b-4 border-pink-300' : ''" class="text-gray-50 duration-300">
            <a @click="navigate(path)" class="cursor-pointer font-light">
              <span class="mr-2 text-sm"> <font-awesome-icon :icon="`fa-solid ${icon}`" /></span>
              {{ name }}
            </a>
          </li>
        </template>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const title = 'iSART';
const menus = [
  {
    name: 'Home',
    path: '/',
    icon: 'fa-home',
  },
  {
    name: 'Login',
    path: '/login',
    icon: 'fa-user',
  },
  {
    name: 'Sign up',
    path: '/signup',
    icon: 'fa-user-pen',
  },
  {
    name: 'Introduction',
    path: '#about',
    icon: 'fa-file',
  },
  {
    name: 'About Us',
    path: '#about',
    icon: 'fa-magnifying-glass',
  },
];

let menuActive = ref('');
let showMenu = ref(false);
let screenWidth = ref('');

const router = useRouter();
const navigate = (path) => {
  router.push(path);
};

onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  menuActive.value = window.location.pathname;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const displayMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<style scoped>
.navbar {
  @apply z-20 md:flex md:items-center md:justify-between px-4 py-2 w-full bg-gradient-to-r from-blue-900 to-slate-700 fixed top-0 left-0 right-0;
}

.navbar-brand {
  @apply flex items-center justify-between md:gap-3;
}

.navbar-menu {
  @apply duration-300 fixed md:relative top-0 bottom-0  max-md:bg-gradient-to-r max-md:from-blue-900 max-md:to-slate-700 px-5 lg:px-0 pt-12 md:pt-0;
}

.navbar-list {
  @apply flex flex-col md:flex-row gap-3 md:gap-6 lg:gap-10 lg:text-xl;
}

.navbar-title {
  @apply text-gray-50 text-xl font-semibold lg:text-3xl;
}
</style>
