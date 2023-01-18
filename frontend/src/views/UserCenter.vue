<template>
  <el-container class="home-container">
    <!-- header -->
    <el-header>
      <div class="header-item">
        <img src="../assets/images/radiotherapy.png" width="40" />
        <div class="navbar-title">{{ header.title }}</div>
      </div>
      <div class="header-item">
        <div class="username hidden-sm-and-down">Welcome, {{ username }}</div>
        <div class="header-item flex-wrap justify-end">
          <el-button type="danger" @click="resetPasswordDialogVisible = !resetPasswordDialogVisible" text>
            <el-icon class="el-icon--left"><Edit /></el-icon>{{ header.primaryButton }}</el-button
          >
          <el-button type="danger" text @click.prevent="signOut">
            <el-icon class="el-icon--left"><WarningFilled /></el-icon>{{ header.secondaryButton }}</el-button
          >
        </div>
      </div>
    </el-header>

    <el-container class="bg-stone-100">
      <!-- side bar -->
      <el-aside :width="isCollapse ? '64px' : '250px'">
        <div class="toggle-button" :v-show="!isMobile">
          <el-switch
            v-model="isCollapse"
            class="ml-2 flex"
            inline-prompt
            style="--el-switch-on-color: #db2777; --el-switch-off-color: #db2777"
            inactive-text="Collapse"
          />
        </div>
        <el-menu
          active-text-color="#db2777"
          background-color="#475569"
          default-active="1"
          text-color="#fff"
          class="h-full font-medium"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <template v-for="({ title, pathname, icon, isGroup, subtitle }, index) in menu" :key="title">
            <template v-if="isGroup">
              <el-sub-menu :index="index + 1 + ''">
                <template #title>
                  <div @click="navigateTo(pathname, params)" class="w-full">
                    <font-awesome-icon :icon="`fa-solid ${icon}`" class="ml-2 mr-5" />
                    {{ title }}
                  </div>
                </template>
                <template v-for="({ title, pathname, icon, params }, subindex) in subtitle" :key="title">
                  <el-menu-item :index="index + 1 + '-' + (subindex + 1)">
                    <div @click="navigateTo(pathname, params)" class="w-full">
                      <font-awesome-icon :icon="`fa-solid ${icon}`" :class="isCollapse ? 'mb-5' : ''" class="mr-4" />
                      {{ title }}
                    </div>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="index + 1 + ''">
                <div @click="navigateTo(pathname, params)" class="w-full">
                  <font-awesome-icon :icon="`fa-solid ${icon}`" class="ml-2 mr-5" />
                  {{ title }}
                </div>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <!-- update password dialog -->
  <ResetPasswordDialog :reset-password-dialog-visible="resetPasswordDialogVisible" />

  <!-- token expired dialog -->
  <TokenExpiredDialog :token-expired-dialog-visible="tokenExpiredDialogVisible" />
</template>

<script setup>
/* eslint-disable */
import { WarningFilled, Edit } from '@element-plus/icons-vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import authorization from '@/utils/authorization';
import ResetPasswordDialog from '@/components/ResetPasswordDialog.vue';
import TokenExpiredDialog from '@/components/TokenExpiredDialog.vue';

const header = {
  title: 'iSART',
  primaryButton: 'Update password',
  secondaryButton: 'Sign out',
};

const menu = [
  {
    title: 'Before You Start',
    pathname: 'user-landing',
    icon: 'fa-user-gear',
    isGroup: false,
  },
  { title: 'FMEA Overview', pathname: 'fmea', icon: 'fa-outdent', isGroup: false },
  {
    title: 'Failure Mode Database',
    isGroup: true,
    icon: 'fa-toggle-on',
    subtitle: [
      { title: 'Process Steps', pathname: 'fm-list', icon: 'fa-list-check' },
      { title: 'Failure Mode List', pathname: 'fm-detail', params: { process_ids: '' }, icon: 'fa-filter' },
    ],
  },
  {
    title: 'Report New Failure Modes',
    pathname: 'fm-create',
    icon: 'fa-book-bookmark',
    isGroup: false,
  },
  { title: 'My FMEA', pathname: 'fmea', icon: 'fa-folder-plus', isGroup: false },
  { title: 'i-SART Evaluation', pathname: 'fmea', icon: 'fa-comments', isGroup: false },
];

let isCollapse = ref(false);
let isMobile = ref(false);
let screenWidth = ref('');
let username = ref('');
let hasLogin = ref(false);
let tokenExpiredDialogVisible = ref(false);
let resetPasswordDialogVisible = ref(false);

const router = useRouter();
const storage = localStorage;

onMounted(() => {
  // check screen width
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      return screenWidth.value < 768 ? (isMobile.value = isCollapse.value = true) : (isMobile.value = false);
    })();
  };

  authorization()
    .then((resolve) => {
      hasLogin.value = resolve[0];
      username.value = resolve[1];
      let routeUsername = router.currentRoute.value.params.username;

      if (username.value === null || routeUsername != username.value) {
        // navigateTo('login');
        tokenExpiredDialogVisible.value = !hasLogin.value;
      }
    })
    .catch((err) => console.log(err));
});

const navigateTo = (pathname, params = null) => {
  if (params) {
    router.push({ name: pathname, params: params });
  } else {
    router.push({ name: pathname });
  }
};

watch(
  () => router.currentRoute.value.params,
  (value) => {
    if (value) {
      authorization()
        .then((resolve) => {
          hasLogin.value = resolve[0];
          username.value = resolve[1];
          let routeUsername = router.currentRoute.value.params.username;

          if (username.value === null || routeUsername != username.value) {
            // navigateTo('login');
            tokenExpiredDialogVisible.value = !hasLogin.value;
          }
        })
        .catch((err) => console.log(err));
    }
  }
);

const signOut = () => {
  storage.clear();
  navigateTo('login');
};
</script>

<style scoped>
.home-container {
  padding: 0px !important;
  margin: 0px !important;
  height: 100vh;
}
.el-header {
  @apply bg-gradient-to-r from-pink-600 to-indigo-700 flex justify-between align-middle;
}

.header-item {
  @apply flex items-center;
}

.toggle-button {
  @apply flex py-3 justify-center bg-stone-100 bg-[#475569];
}

.navbar-title {
  @apply text-white text-xl font-semibold lg:text-3xl ml-6;
}

.username {
  @apply text-gray-100 font-normal mr-6;
}

:deep(.el-aside) {
  @apply overflow-hidden;
}
:deep(.el-menu-item *),
:deep(.el-sub-menu__title *) {
  @apply align-baseline;
}
</style>
