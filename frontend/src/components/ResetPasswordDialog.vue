<template>
  <div>
    <el-dialog v-model="isShown" :style="screenWidth > 768 ? 'width: 33%' : screenWidth === 768 ? 'width: 50%' : 'width: 70%'" align-center>
      <template #header>
        <div class="dialog-title">{{ resetPasswordDialog.title }}</div>
      </template>
      <div class="dialog-image-container">
        <img src="../assets/images/padlock.png" :style="screenWidth >= 768 ? 'width: 8rem' : 'width: 6rem'" />
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
        <!-- New Password -->
        <el-form-item :label="resetForm.newPasswordField.name" prop="new_password">
          <el-input
            v-model="ruleForm.new_password"
            type="password"
            :placeholder="resetForm.newPasswordField.placeholder"
            show-password
            class="w-full"
            :prefix-icon="Lock"
            clearable
          />
        </el-form-item>
        <!-- Confirm New Password -->
        <el-form-item :label="resetForm.confirmNewPasswordField.name" prop="confirm_new_password" class="mt-8">
          <el-input
            v-model="ruleForm.confirm_new_password"
            type="password"
            :placeholder="resetForm.confirmNewPasswordField.placeholder"
            show-password
            class="w-full"
            :prefix-icon="Lock"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex mx-auto" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
          <el-button type="danger" @click="onUpdate(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-bottom:8px'">
            {{ resetPasswordDialog.primaryButton }}
          </el-button>
          <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-left:auto'">{{
            resetPasswordDialog.secondaryButton
          }}</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Token expired dialog -->
    <TokenExpiredDialog :token-expired-dialog-visible="tokenExpiredDialogVisible" />
  </div>
</template>

<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity';
import { Lock } from '@element-plus/icons-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { defineProps, watch, onMounted } from 'vue';
import authorization from '@/utils/authorization';
import { ElMessage } from 'element-plus';
import TokenExpiredDialog from '@/components/TokenExpiredDialog.vue';

const props = defineProps({
  resetPasswordDialogVisible: {
    type: Boolean,
    default: false,
  },
});
const { resetPasswordDialogVisible } = toRefs(props);
let isShown = ref(false);

watch(resetPasswordDialogVisible, () => {
  isShown.value = !isShown.value;
});

const resetPasswordDialog = {
  title: 'Reset password',
  primaryButton: 'Confirm',
  secondaryButton: 'Reset',
};
const messages = {
  success: 'Congrats! You have reset your password',
  err: 'Something went wrong... Please try it later',
};

const resetForm = {
  newPasswordField: {
    name: 'New password',
    placeholder: 'Please enter new password',
  },
  confirmNewPasswordField: {
    name: 'Confirm new password',
    placeholder: 'Please confirm new password',
  },
};
const rules = reactive({
  new_password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    {
      min: 6,
      max: 8,
      message: 'Length should be 6 to 8',
      trigger: 'blur',
    },
    {
      validator: function (rule, value, callback) {
        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,8}$/.test(value) == false) {
          callback(new Error('Password must include at least 1 number (0-9), 1 upper case letter (A-Z). Special characters are allowed.'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  confirm_new_password: [
    { required: true, message: 'Please password', trigger: 'blur' },
    {
      validator: function (rule, value, callback) {
        if (ruleForm.new_password != ruleForm.confirm_new_password) {
          callback(new Error("New Password and confirm password don't match."));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});
const ruleForm = reactive({
  new_password: '',
  confirm_new_password: '',
});
const ruleFormRef = ref(null);

const router = useRouter();
const storage = localStorage;
let tokenExpiredDialogVisible = ref(false);

let screenWidth = ref('');
onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onUpdate = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      const username = storage.getItem('username.isart');
      const token = storage.getItem('access.isart');

      // check if token has expired
      authorization().then((response) => {
        if (!response[0]) {
          tokenExpiredDialogVisible.value = true;
          return;
        }

        axios
          .patch(
            '/api/user/' + username + '/',
            {
              username: username,
              password: ruleForm.new_password,
            },
            {
              headers: { Authorization: 'Bearer ' + token },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              ElMessage({
                showClose: true,
                message: messages.success,
                type: 'success',
              });
              router.push({ name: 'login' });
            } else {
              ElMessage({
                showClose: true,
                message: messages.err,
                type: 'error',
              });
            }
          })
          .catch((err) => {
            if (err.response.status === 400) {
              ElMessage({
                showClose: true,
                message: err.response.data.non_field_errors[0],
                type: 'error',
              });
            } else {
              ElMessage({
                showClose: true,
                message: messages.err,
                type: 'error',
              });
            }
          });
      });
    }
  });
};

const onReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
