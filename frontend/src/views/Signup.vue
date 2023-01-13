<template>
  <div>
    <Navbar />
    <section class="background-container">
      <el-row class="content-container">
        <el-col :span="12" class="hidden-xs-only" style="align-self: center">
          <div style="display: flex; justify-content: center">
            <img src="../assets/images/doctor2.png" class="lg:max-xl:w-96 md:max-lg:w-80" />
          </div>
        </el-col>
        <RegisterForm />
      </el-row>
    </section>
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue';
import RegisterForm from '@/components/RegisterForm.vue';
</script>
