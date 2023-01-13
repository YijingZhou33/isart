<template>
  <el-dialog v-model="isShown" :style="screenWidth > 768 ? 'width: 33%' : screenWidth === 768 ? 'width: 50%' : 'width: 80%'" align-center>
    <template #header>
      <div class="dialog-title">{{ forgotPasswordDialog.title }}</div>
    </template>
    <div class="dialog-image-container">
      <img src="../assets/images/forgot-password.png" :style="screenWidth >= 768 ? 'width: 8rem' : 'width: 6rem'" />
    </div>
    <div class="dialog-description" :class="screenWidth >= 768 ? 'w-3/4' : 'w-full text-sm'">
      {{ forgotPasswordForm.description }}
    </div>
    <!-- form -->
    <el-form
      :model="ruleForm"
      label-width="150px"
      label-position="top"
      size="large"
      :rules="rules"
      ref="ruleFormRef"
      class="mx-auto"
      style="margin-bottom: -30px"
    >
      <!-- Email -->
      <el-form-item :label="forgotPasswordForm.emailField.name" prop="email">
        <el-input
          v-model="ruleForm.email"
          type="password"
          :placeholder="forgotPasswordForm.emailField.placeholder"
          show-password
          class="w-full"
          :prefix-icon="Lock"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex mx-auto" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
        <el-button type="danger" @click="onSend(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-bottom:8px'">
          {{ forgotPasswordDialog.primaryButton }}
        </el-button>
        <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-left:auto'">{{
          forgotPasswordDialog.secondaryButton
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity';
import { Lock } from '@element-plus/icons-vue';
// import axios from 'axios';
// import { useRouter } from 'vue-router';
import { defineProps, watch, onMounted } from 'vue';

const props = defineProps({
  forgotPasswordDialogVisible: {
    type: Boolean,
    default: false,
  },
});
const { forgotPasswordDialogVisible } = toRefs(props);
let isShown = ref(false);

watch(forgotPasswordDialogVisible, () => {
  isShown.value = !isShown.value;
});

const forgotPasswordDialog = {
  title: 'Forgot Your Password?',
  primaryButton: 'Send Email',
  secondaryButton: 'Reset',
};

const forgotPasswordForm = {
  description: 'Please enter your register email address to receive reset information',
  emailField: {
    name: 'Email',
    placeholder: 'Please enter email address',
  },
};

const ruleForm = reactive({
  email: '',
});
const ruleFormRef = ref(null);
// const router = useRouter();

let screenWidth = ref('');
onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onSend = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const onReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
