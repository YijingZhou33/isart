<template>
  <el-col :sm="{ span: 10 }" align="center">
    <el-col class="form-container">
      <el-row justify="center"
        ><div class="form-title">{{ signupForm.title }}</div></el-row
      >
      <el-row justify="center">
        <el-form :model="ruleForm" label-width="120px" label-position="top" size="large" class="w-[90%]" :rules="rules" ref="ruleFormRef">
          <!-- username -->
          <el-form-item :label="signupForm.userField.name" prop="username" class="mb-2">
            <el-input v-model="ruleForm.username" class="w-full" :prefix-icon="User" :placeholder="signupForm.userField.placeholder" clearable />
          </el-form-item>
          <!-- password -->
          <el-form-item :label="signupForm.passwordField.name" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              :placeholder="signupForm.passwordField.placeholder"
              show-password
              class="w-full"
              :prefix-icon="Lock"
              clearable
            />
          </el-form-item>
          <!-- confirm password -->
          <el-form-item :label="signupForm.confirmPasswordField.name" prop="confirm_password">
            <el-input
              v-model="ruleForm.confirm_password"
              type="password"
              :placeholder="signupForm.confirmPasswordField.placeholder"
              show-password
              class="w-full"
              :prefix-icon="Lock"
              clearable
            />
          </el-form-item>
          <!-- email -->
          <el-form-item :label="signupForm.emailField.name" prop="email">
            <el-input
              v-model="ruleForm.email"
              :prefix-icon="Message"
              :placeholder="signupForm.emailField.placeholder"
              type="email"
              class="w-full"
              clearable
            />
          </el-form-item>
          <!-- button -->
          <el-form-item class="flex mx-auto" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
            <el-button
              type="primary"
              @click="onSignup(ruleFormRef)"
              :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-bottom:8px'"
              :plain="true"
              duration="20000"
              >{{ signupForm.primaryButton }}</el-button
            >
            <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:48%' : 'width:100%; margin-left:auto'">{{
              signupForm.secondaryButton
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-col>
  </el-col>
</template>

<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue';
import { reactive, ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';

const signupForm = {
  title: 'Create Account',
  userField: {
    name: 'Username',
    placeholder: 'Please enter username',
  },
  passwordField: {
    name: 'Password',
    placeholder: 'Please enter password',
  },
  confirmPasswordField: {
    name: 'Repeat password',
    placeholder: 'Please enter password again',
  },
  emailField: {
    name: 'Email',
    placeholder: 'Please enter email address',
  },
  primaryButton: 'Sign up',
  secondaryButton: 'Reset',
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
  confirm_password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    {
      validator: function (rule, value, callback) {
        if (ruleForm.password != ruleForm.confirm_password) {
          callback(new Error("Password and confirm password don't match"));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    {
      validator: function (rule, value, callback) {
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) == false) {
          callback(new Error('Please enter your email address in format yourname@example.com'));
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
  confirm_password: '',
  email: '',
});
const ruleFormRef = ref(null);
const router = useRouter();

let screenWidth = ref('');

const messages = {
  success: 'Congrats! You have signed up successfully',
  err: 'Something went wrong... Please try it later',
};

onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onSignup = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios
        .post('api/user/', {
          username: ruleForm.username,
          password: ruleForm.password,
          email: ruleForm.email,
        })
        .then((response) => {
          if (response.status === 201) {
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
          const { username, email } = err.response.data;
          if (err.response.status === 400) {
            const message = `${username === undefined ? '' : username} </br>
                             ${email === undefined ? '' : email}`;
            ElMessage({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: message,
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

const onReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.title {
  @apply font-bold text-blue-900 text-3xl text-center mb-2.5;
}
</style>
