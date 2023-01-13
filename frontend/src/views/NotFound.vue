<template>
  <section class="background-container">
    <div class="content-container">
      <el-empty image="https://cdn-icons-png.flaticon.com/512/5058/5058097.png" :image-size="300" :description="description" class="text-3xl">
      </el-empty>
    </div>
  </section>
</template>
<script setup>
const description = 'Sorry, Page Not Found';
</script>
<style scoped>
:deep(.el-empty__description p) {
  @apply font-semibold text-3xl text-[#db2777];
}
</style>
