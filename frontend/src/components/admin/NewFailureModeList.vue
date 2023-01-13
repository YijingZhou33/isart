<template>
  <div>
    <el-card :class="screenWidth > 768 ? 'px-8' : 'px-1'">
      <el-row class="items-center justify-between">
        <el-col :span="4" class="hidden-xs-only">
          <img src="../../assets/images/thermometer.png" />
        </el-col>
        <el-col :span="18" class="justify">
          <div class="font-medium text-3xl mb-4 text-[#db2777]" v-html="main.title"></div>
          <div class="font-light text-base" v-html="main.text"></div>
        </el-col>
      </el-row>

      <el-divider content-position="center">{{ main.primaryDivider }}</el-divider>

      <el-row class="pb-4 items-center justify-between">
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="pagination.count"
          :page-size="pagination.perPage"
          :current-page="pagination.currentPage"
          @current-change="changePage"
          :hide-on-single-page="pagination.page_number != 1"
        />
      </el-row>

      <el-table
        :data="tableData"
        highligh-current-row
        stripe
        :border="true"
        :header-row-style="getHeaderStyle"
        ref="tableRef"
        @sort-change="sortChange"
        @filter-change="filterChange"
      >
        <template v-for="(col, index) in tableHeader" :key="index">
          <!-- Failure mode -->
          <template v-if="col.name === 'failure_mode'">
            <el-table-column :prop="col.name" :label="col.label" fixed> </el-table-column>
          </template>

          <template v-else-if="col.name === 'step_id'">
            <el-table-column :prop="col.name" :label="col.label" column-key="step_id" :filters="getStepIdFilter()"> </el-table-column>
          </template>

          <!-- Status -->
          <template v-else-if="col.name === 'status'">
            <el-table-column :prop="col.name" :label="col.label" width="100px" filter-placement="bottom-end" column-key="status" sortable="custom">
              <template #default="scope">
                <el-tag :type="scope.row.status === statusTags[0] ? 'danger' : 'success'" disable-transitions>{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
          </template>

          <template v-else-if="col.name === 'operation'">
            <el-table-column fixed="right" :label="col.label">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">{{ main.primaryButton }}</el-button>
                <el-button size="small" type="danger" @click.prevent="handleDelete(scope.row)">{{ main.secondaryButton }}</el-button>
              </template>
            </el-table-column>
          </template>

          <template v-else>
            <el-table-column :prop="col.name" :label="col.label" />
          </template>
        </template>
      </el-table>
    </el-card>

    <DeleteFailureModeDialog :delete-fm-dialog-visible="deleteFmDialogVisible" :fmId="id" />
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios';
import { Filter, ArrowDown } from '@element-plus/icons-vue';
import { onMounted, ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import { PROCESS_STEPS, SEVERITY_LEVELS, PROCESS_TYPES } from '@/utils/enum';
import authorization from '@/utils/authorization';
import { ElMessage } from 'element-plus';
import DeleteFailureModeDialog from '@/components/DeleteFailureModeDialog.vue';

const router = useRouter();
let tableData = ref();
let tableRef = ref(null);
let username = ref('');
let hasLogin = ref(false);
let screenWidth = ref('');
let deleteFmDialogVisible = ref(false);
let id = ref(null);

const main = {
  title: 'User Added Failure Modes',
  text: `Some description goes here .....`,
  primaryDivider: 'Failure Mode Table',
  primaryButton: 'Details',
  secondaryButton: 'Delete',
};

const messages = {
  delete_success: 'Delete successfully!',
  err: 'Something went wrong... Please try it later',
};

const pagination = reactive({
  currentPage: 1,
  count: 0,
  perPage: 0,
  totalPages: 1,
});

const tableHeader = [
  {
    name: 'subprocess_id',
    label: 'Subprocess',
  },
  {
    name: 'step_id',
    label: 'Step',
  },
  {
    name: 'failure_mode',
    label: 'Failure mode',
  },
  {
    name: 'comments',
    label: 'Comments',
  },
  {
    name: 'operation',
    label: 'Operations',
  },
  {
    name: 'status',
    label: 'Status',
  },
];

const params = reactive({
  page: 1,
  size: 4,
  published: false,
});

const statusTags = ['New', 'Archived'];

let processIds = reactive({ value: [] });

onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };

  getTableData();
});

const getTableData = () => {
  authorization()
    .then((resolve) => {
      hasLogin.value = resolve[0];
      username.value = resolve[1];
      let routeUsername = router.currentRoute.value.params.username;

      if (routeUsername == username.value && hasLogin.value && username.value !== null) {
        axios
          .get('/api/user-fm/', {
            params,
            // Authentication
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('access.isart'),
            },
          })
          .then((response) => {
            tableData.value = response.data.results;

            pagination.perPage = response.data.per_page;
            pagination.count = response.data.count;
            pagination.currentPage = response.data.page_number;
            pagination.totalPages = response.data.total_pages;

            mapFields();
          })
          .catch((err) => console.log(err));
      } else {
        router.push({ name: 'admin-landing' });
      }
    })
    .catch((err) => console.log(err));
};

const mapFields = () => {
  tableData.value.forEach((item) => {
    // step_id
    item.step_id = PROCESS_STEPS[item.subprocess_id - 1][0].children[item.step_id - 1].label;
    // subprocess_id
    item.subprocess_id = PROCESS_STEPS[item.subprocess_id - 1][0].label;
    // status
    item.status = new Date(item.created).toLocaleString() === new Date(item.updated).toLocaleString() ? statusTags[0] : statusTags[1];

    // process_id
    if (processIds.value.indexOf(item.process_id) === -1) {
      processIds.value.push(item.process_id);
    }
  });
};

const changePage = (val) => {
  if ((val > pagination.currentPage && val <= pagination.totalPages) || (val < pagination.currentPage && val >= 0)) {
    pagination.currentPage = params.page = val;
    getTableData();
  }
};

const getStepIdFilter = () => {
  let filter = [];
  processIds.value.forEach((item) => {
    let [subprocessId, stepId] = item.split('-');
    subprocessId = parseInt(subprocessId);
    stepId = parseInt(stepId);
    const steps = PROCESS_STEPS[subprocessId - 1][0].children;
    for (let i = 0; i < steps.length; i++) {
      if (i + 1 === stepId) {
        filter.push({
          text: steps[i].label,
          value: subprocessId + '-' + (i + 1),
        });
      }
    }
  });

  return filter;
};

const filterChange = (filter) => {
  if (filter['step_id']) {
    let processIdList = [];

    filter.step_id.forEach((value) => {
      processIdList.push(value);
    });
    params['process_id'] = processIdList.join(',');
  } else {
    params['process_id'] = undefined;
    params['step_id'] = undefined;
  }
  params.page = 1;
  getTableData();
};

const handleEdit = (row) => {
  router.push({ name: 'fm-edit', params: { id: row.id } });
};

const handleDelete = async (row) => {
  id.value = row.id + '';
  deleteFmDialogVisible.value = !deleteFmDialogVisible.value;
};

const getHeaderStyle = () => {
  return {
    color: '#475569',
    fontSize: 'medium',
  };
};

const sortChange = (column) => {
  const field = column.prop === 'status' ? 'updated' : column.prop;

  let ordering = column.order;
  if (ordering === 'ascending') {
    params['ordering'] = field + ',';
  } else if (ordering === 'descending') {
    params['ordering'] = '-' + field + ',';
  } else {
    params['ordering'] = undefined;
  }
  params['page'] = 1;
  getTableData(false);
};
</script>

<style scoped>
:deep(.el-breadcrumb__inner.is-link) {
  @apply text-base;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  @apply text-[#db2777] underline underline-offset-4;
}
:deep(.el-pagination) {
  @apply text-base;
}
:deep(.el-pager li.is-active),
:deep(.el-pager li:hover),
:deep(.el-pagination button:hover),
:deep(.el-table th.el-table__cell > .cell.highlight) {
  @apply text-[#db2777];
}

:deep(.el-table .descending .sort-caret.descending) {
  border-top-color: #db2777;
}

:deep(.el-table .ascending .sort-caret.ascending) {
  border-bottom-color: #db2777;
}

:deep(.el-divider__text.is-center) {
  @apply text-[#db2777] text-base font-light;
}

:deep(.el-divider--horizontal) {
  @apply my-10;
}
</style>
