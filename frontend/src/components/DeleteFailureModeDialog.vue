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
      <div class="dialog-title">{{ deleteFmDialog.title }}</div>
    </template>
    <div class="dialog-image-container">
      <img src="../assets/images/file.png" :style="screenWidth > 768 ? 'width: 8rem' : 'width: 6rem'" />
    </div>
    <div class="dialog-description">{{ deleteFmDialog.description }}</div>

    <template #footer>
      <div style="margin-top: -20px">
        <el-button type="danger" @click="onDelete()" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-bottom:8px'">
          {{ deleteFmDialog.primaryButton }}
        </el-button>
        <el-button @click="isShown = !isShown" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-left:auto'">{{
          deleteFmDialog.secondaryButton
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
/* eslint-disable */
import { ref, toRefs } from '@vue/reactivity';
import { defineProps, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import authorization from '@/utils/authorization';
import axios from 'axios';

const props = defineProps({
  deleteFmDialogVisible: {
    type: Boolean,
    default: false,
  },
  fmId: {
    type: String,
    default: '0',
  },
});
const { deleteFmDialogVisible, fmId } = toRefs(props);
let isShown = ref(false);
let id = ref('0');

watch(deleteFmDialogVisible, () => {
  isShown.value = !isShown.value;
  id.value = fmId.value;
});

const deleteFmDialog = {
  title: 'Are you sure to delete this FM?',
  description: 'This FM will be gone forever...',
  primaryButton: 'Confirm',
  secondaryButton: 'Cancel',
};

const router = useRouter();
const storage = localStorage;
let username = ref('');
let hasLogin = ref(false);

const messages = {
  delete_success: 'Delete successfully!',
  err: 'Something went wrong... Please try it later',
};

let screenWidth = ref('');
onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onDelete = async () => {
  authorization()
    .then((resolve) => {
      hasLogin.value = resolve[0];
      username.value = resolve[1];
      let routeUsername = router.currentRoute.value.params.username;
      const token = storage.getItem('access.isart');
      if (routeUsername == username.value && hasLogin.value && username.value !== null) {
        axios
          .delete('/api/user-fm/' + id.value + '/', {
            // Authentication
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((response) => {
            // Delete successfully
            if (response.status === 204) {
              // No content
              ElMessage({
                showClose: true,
                message: messages.delete_success,
                type: 'success',
              });
            } else {
              ElMessage({
                showClose: true,
                message: messages.err,
                type: 'error',
              });
            }
          })
          .catch((err) => {
            ElMessage({
              showClose: true,
              message: err.response.data,
              type: 'error',
            });
          });
      }
    })
    .catch((err) => console.log(err));
  isShown.value = !isShown.value;

  if (router.currentRoute.value.name === 'new-fms') {
    location.reload();
  } else {
    router.push({ name: 'new-fms' });
  }
};
</script>
