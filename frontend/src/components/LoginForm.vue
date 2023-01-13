<template>
  <el-col :sm="{ span: 10 }" align="center">
    <el-col class="form-container">
      <div class="form-title">{{ loginForm.title }}</div>

      <el-row justify="center">
        <el-form :model="ruleForm" label-width="120px" label-position="top" size="large" class="w-[90%]" :rules="rules" ref="ruleFormRef">
          <!-- Username -->
          <el-form-item :label="loginForm.userField.name" prop="username" class="mb-2" required>
            <el-input v-model="ruleForm.username" class="w-full" :placeholder="loginForm.userField.placeholder" :prefix-icon="User" clearable />
          </el-form-item>
          <!-- Password -->
          <el-form-item :label="loginForm.passwordField.name" prop="password" required>
            <el-input
              v-model="ruleForm.password"
              type="password"
              :placeholder="loginForm.passwordField.placeholder"
              show-password
              class="w-full"
              :prefix-icon="Lock"
              clearable
            />
          </el-form-item>
          <!-- Button -->
          <el-form-item class="flex mx-auto mt-8" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
            <el-button
              type="primary"
              @click.prevent="onLogin(ruleFormRef)"
              :plain="true"
              duration="20000"
              :class="screenWidth > 768 ? 'w-[48%]' : 'w-full mb-2'"
              >{{ loginForm.primaryButton }}</el-button
            >
            <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-left:auto'">{{
              loginForm.secondaryButton
            }}</el-button>
            <div class="w-full">
              <el-button type="danger" link @click="forgotPasswordDialogVisible = !forgotPasswordDialogVisible" class="link-button">{{
                loginForm.linkButton
              }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-row>
    </el-col>
  </el-col>

  <ForgotPasswordDialog :forgot-password-dialog-visible="forgotPasswordDialogVisible" />
</template>

<script setup>
import { reactive, ref } from '@vue/reactivity';
import { User, Lock } from '@element-plus/icons-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import ForgotPasswordDialog from '@/components/ForgotPasswordDialog.vue';
import { onMounted } from 'vue';

const loginForm = {
  title: 'Welcome to iSART!',
  userField: {
    name: 'Username',
    placeholder: 'Please enter username',
  },
  passwordField: {
    name: 'Password',
    placeholder: 'Please enter password',
  },
  primaryButton: 'Log in',
  secondaryButton: 'Reset',
  linkButton: 'Forgot your password?',
};

const rules = reactive({
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    {
      min: 4,
      max: 6,
      message: 'Length should be 4 to 6',
      trigger: 'blur',
    },
    {
      validator: function (rule, value, callback) {
        if (/^[a-zA-Z0-9]{4,6}$/.test(value) == false) {
          callback(new Error('Username must only include numbers and letters'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
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
          callback(new Error('Password must include at least 1 number (0-9), 1 upper case letter (A-Z). Special characters are allowed'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

const ruleForm = reactive({
  username: '',
  password: '',
});
const ruleFormRef = ref(null);
const router = useRouter();
const messages = {
  success: 'Login successfully!',
  no_account_found: 'Incorrect username or password',
  err: 'Something went wrong... Please try it later',
};

let forgotPasswordDialogVisible = ref(false);
let screenWidth = ref('');

onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onLogin = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios
        .post('api/token/', {
          username: ruleForm.username,
          password: ruleForm.password,
        })
        .then((response) => {
          // Login success
          if (response.status === 200) {
            ElMessage({
              showClose: true,
              message: messages.success,
              type: 'success',
            });

            const storage = localStorage;
            // token expired time 60 mins
            // const expiredTime = Date.parse(response.headers.date) + 15000;
            const expiredTime = Date.parse(response.headers.date) + 60 * 60000;

            // set localStorage
            storage.setItem('access.isart', response.data.access);
            storage.setItem('refresh.isart', response.data.refresh);
            storage.setItem('expiredTime.isart', expiredTime);
            storage.setItem('username.isart', ruleForm.username);

            // redirect to user center

            if (response.data.is_admin) {
              // admin account
              router.push({ name: 'admin-landing', params: { username: ruleForm.username } });
            } else {
              // user account
              router.push({ name: 'user-landing', params: { username: ruleForm.username } });
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            ElMessage({
              showClose: true,
              message: messages.no_account_found,
              type: 'error',
            });
          } else {
            ElMessage({
              showClose: true,
              message: err,
              type: 'error',
            });
          }
        });
    }
  });
};

const onReset = async (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.link-button {
  @apply text-lg font-semibold text-center mt-4 underline hover:underline-offset-4;
}
</style>
