<template>
  <div>
    <template v-for="(subprocess, index) in process" :key="index">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        background-color="#475569"
        text-color="#fff"
        active-text-color="#db2777"
      >
        <template v-for="{ title, phase } in subprocess" :key="title">
          <el-menu-item :index="phase" @click="activeIndex = phase" class="menu-item"> {{ title }}</el-menu-item>
        </template>
      </el-menu>
    </template>
    <template v-for="(item, index) in tree" :key="index">
      <el-tree
        :data="item"
        :props="defaultProps"
        @node-click="handleNodeClick"
        v-show="activeIndex === index + 1 + ''"
        :default-expand-all="true"
        :expand-on-click-node="false"
      />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PROCESS_STEPS, PROCESS } from '@/utils/enum';

const process = PROCESS;

const tree = PROCESS_STEPS;
const activeIndex = ref('1');

const router = useRouter();

// Menu item
const handleSelect = (data) => {
  console.log(data);
};

// Tree node
const handleNodeClick = (data) => {
  let processId = data.label.split(' ')[0];
  // step_id
  let processIds = [];
  if (processId.indexOf('.') !== -1) {
    processIds = processId.split('.');
  } else {
    processIds = [processId];
  }
  router.push({ name: 'fm-detail', params: { process_ids: processIds } });
};

const defaultProps = {
  children: 'children',
  label: 'label',
};
</script>

<style scoped>
.menu-item {
  @apply font-medium;
  font-size: medium;
}

:deep(.el-tree) {
  @apply pl-4 py-4 overflow-scroll;
}

:deep(.el-tree-node__label) {
  @apply font-medium text-base text-gray-700;
}

:deep(.el-tree-node__content:hover) {
  @apply bg-pink-600 bg-opacity-40;
}

:deep(.el-tree-node__content) {
  @apply py-4;
}
</style>
