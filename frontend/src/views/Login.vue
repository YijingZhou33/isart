<template>
  <div>
    <Navbar />
    <section class="background-container">
      <el-row class="content-container">
        <el-col :span="12" class="hidden-xs-only">
          <div style="display: flex; justify-content: center">
            <img src="../assets/images/doctor1.png" class="lg:max-xl:w-96 md:max-lg:w-80" />
          </div>
        </el-col>
        <LoginForm />
      </el-row>
    </section>
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue';
import LoginForm from '@/components/LoginForm.vue';
</script>
