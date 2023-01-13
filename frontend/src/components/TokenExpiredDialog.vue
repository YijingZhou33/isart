<template>
  <el-dialog
    v-model="isShown"
    :style="screenWidth >= 768 ? 'width: 33%' : screenWidth === 768 ? 'width: 50%' : 'width: 80%'"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <template #header>
      <div class="dialog-title">{{ tokenExpiredDialog.title }}</div>
    </template>
    <div class="dialog-image-container">
      <img src="../assets/images/expired.png" :style="screenWidth > 768 ? 'width: 8rem' : 'width: 6rem'" />
    </div>
    <div class="dialog-description">{{ tokenExpiredDialog.description }}</div>

    <template #footer>
      <div style="margin-top: -20px">
        <el-button type="danger" class="w-full" @click="signOut">
          {{ tokenExpiredDialog.button }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, toRefs } from '@vue/reactivity';
import { defineProps, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  tokenExpiredDialogVisible: {
    type: Boolean,
    default: false,
  },
});
const { tokenExpiredDialogVisible } = toRefs(props);
let isShown = ref(false);

watch(tokenExpiredDialogVisible, () => {
  isShown.value = !isShown.value;
});

const tokenExpiredDialog = {
  title: 'Your session has expired :-(',
  description: 'You will be redirected to Login page.',
  button: 'Confirm',
};

const router = useRouter();

let screenWidth = ref('');
onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const signOut = () => {
  router.push({ name: 'login' });
};
</script>
