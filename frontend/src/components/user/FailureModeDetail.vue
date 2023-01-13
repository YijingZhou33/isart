<template>
  <div>
    <div class="flex mt-2 mb-6 justify-between">
      <!-- breadcrumb -->
      <el-breadcrumb :separator-icon="ArrowRight" class="flex items-center">
        <el-breadcrumb-item :to="{ name: breadcrumb.fms.pathname }">
          <font-awesome-icon icon="fa-solid fa-house" class="mr-2 text-[#db2777]" />
          {{ breadcrumb.fms.name }}</el-breadcrumb-item
        >

        <template v-if="breadcrumb.fms_by_subprocess_id">
          <el-breadcrumb-item
            v-if="breadcrumb.fms_by_step_id"
            :to="{ name: 'fm-detail', params: { process_ids: [breadcrumb.fms_by_subprocess_id] } }"
            >{{ PROCESS_STEPS[breadcrumb.fms_by_subprocess_id - 1][0].label }}</el-breadcrumb-item
          >
          <el-breadcrumb-item v-else>{{ PROCESS_STEPS[breadcrumb.fms_by_subprocess_id - 1][0].label }}</el-breadcrumb-item>
        </template>

        <template v-if="breadcrumb.fms_by_step_id">
          <el-breadcrumb-item>{{
            PROCESS_STEPS[breadcrumb.fms_by_subprocess_id - 1][0].children[breadcrumb.fms_by_step_id - 1].label
          }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
      <!-- pagination -->
      <div class="flex self-center space-x-4">
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="pagination.count"
          :page-size="pagination.perPage"
          :current-page="pagination.currentPage"
          @current-change="changePage"
          :hide-on-single-page="pagination.page_number != 1"
        />
      </div>
    </div>

    <div class="flex flex-col justify-between h-[90%]">
      <div class="flex-1 relative" ref="containerRef">
        <el-table
          :data="tableData"
          @sort-change="sortChange"
          highligh-current-row
          stripe
          :cell-style="getCellStyle"
          :border="true"
          :header-row-style="getHeaderStyle"
          @filter-change="filterChange"
          ref="tableRef"
        >
          <template v-for="(col, index) in tableHeader" :key="index">
            <!-- Failure mode -->
            <el-table-column :prop="col.name" :label="col.label" :width="col.width + 'px'" fixed v-if="col.name === 'failure_mode'">
              <template #default="scope">
                {{ scope.row.failure_mode }}
                <el-tooltip effect="dark" :content="scope.row.abr" placement="top" v-if="scope.row.abr">
                  <font-awesome-icon icon="fa-solid fa-circle-info" v-if="scope.row.abr" class="ml-2 text-[#db2777]" />
                </el-tooltip>
              </template>
            </el-table-column>

            <!-- Step id -->
            <template v-else-if="col.name === 'step_id' && breadcrumb.fms_by_step_id !== undefined">
              <el-table-column
                :prop="col.name"
                :label="col.label"
                :width="col.width + 'px'"
                v-if="false"
                column-key="step_id"
                :filters="getStepIdFilter()"
              >
              </el-table-column>
            </template>

            <template v-else-if="col.name === 'step_id' && breadcrumb.fms_by_step_id === undefined">
              <el-table-column
                :prop="col.name"
                :label="col.label"
                :width="col.width + 'px'"
                :filters="getStepIdFilter()"
                column-key="step_id"
                v-if="true"
              >
              </el-table-column>
            </template>

            <!-- Severity -->

            <el-table-column
              :prop="col.name"
              :label="col.label"
              :width="col.width + 'px'"
              sortable="custom"
              :filters="getSeverityFilter()"
              column-key="severity"
              v-else-if="col.name === 'severity'"
            >
              <template #header="scope"
                >{{ scope.column.property }}
                <el-tooltip effect="dark" :content="severityList" raw-content placement="top">
                  <font-awesome-icon icon="fa-solid fa-lightbulb" class="ml-2 text-[#db2777]" />
                </el-tooltip>
              </template>
            </el-table-column>

            <!-- Process type -->
            <el-table-column
              :prop="col.name"
              :label="col.label"
              :width="col.width + 'px'"
              :filters="getProgressTypeFilter()"
              column-key="process_type"
              v-else-if="col.name === 'process_type'"
            />

            <!-- Found in other steps -->
            <el-table-column :prop="col.name" :label="col.label" :width="col.width + 'px'" v-else-if="col.name === 'found_in_other_steps'">
              <template #default="scope"
                >{{ scope.row.found_in_other_steps }}
                <a @click="navToOtherFm(scope.row.found_in_other_steps)">
                  <font-awesome-icon
                    icon="fa-solid fa-up-right-from-square"
                    class="ml-2 text-[#db2777] cursor-pointer"
                    v-if="scope.row.found_in_other_steps"
                  />
                </a>
              </template>
            </el-table-column>

            <!-- Updated -->
            <el-table-column
              :prop="col.name"
              :label="col.label"
              :width="col.width + 'px'"
              :filters="getUpdatedTimeFilter()"
              filter-placement="bottom-end"
              column-key="updated"
              sortable="custom"
              v-else-if="col.name === 'updated'"
            >
              <template #default="scope">
                <el-tag
                  :type="scope.row.updated === `${dateRange.items[0]}` ? 'danger' : `${dateRange.items[1]}` ? '' : 'success'"
                  disable-transitions
                  >{{ scope.row.updated }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column :prop="col.name" :label="col.label" :width="col.width + 'px'" v-else />
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios';
import { Filter } from '@element-plus/icons-vue';
import { onMounted, ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, ArrowDown } from '@element-plus/icons-vue';
import { PROCESS_STEPS, SEVERITY_LEVELS, PROCESS_TYPES } from '@/utils/enum';
import authorization from '@/utils/authorization';

const router = useRouter();
let tableData = ref();
let containerWidth = ref('');
let containerRef = ref(null);
let tableRef = ref(null);
let username = ref('');
let hasLogin = ref(false);

const pagination = reactive({
  currentPage: 1,
  count: 0,
  perPage: 0,
  totalPages: 1,
});

const breadcrumb = reactive({
  fms: {
    name: 'Process Steps',
    pathname: 'fm-list',
  },
  fms_by_subprocess_id: undefined,
  fms_by_step_id: undefined,
});

const tableHeader = [
  {
    name: 'step_id',
    label: 'Step id',
    width: null,
  },
  {
    name: 'failure_mode',
    label: 'Failure mode',
    width: null,
  },
  {
    name: 'severity',
    label: 'Severity',
    width: null,
  },
  {
    name: 'updated',
    label: 'Updated time',
  },
  {
    name: 'process_type',
    label: 'Technique',
    width: null,
  },
  // {
  //   name: 'current_mitigation',
  //   label: 'Current mitigation',
  //   width: null,
  // },
  {
    name: 'found_in_other_steps',
    label: 'Found in other steps',
    width: null,
  },
  {
    name: 'potential_causes',
    label: 'Potential causes',
    width: null,
  },
  {
    name: 'potential_effect',
    label: 'Potential effect',
    width: null,
  },
  {
    name: 'mitigation_strategy',
    label: 'Mitigation strategy',
    width: null,
  },
  {
    name: 'software',
    label: 'Software related to Fms',
    width: null,
  },
];

const dateRange = {
  items: ['Since this month', 'Since the last 3 months', 'Since the last 6 months'],
  timestamps: [30, 30 * 3, 30 * 6],
};

const severityList = `<table class="table-fixed">
  <tr>
    <td>🟢</td>
    <td>Low</td>
    <td>Inconvenience or minor effect</td>
  </tr>
  <tr>
    <td>🟡</td>
    <td>Moderate</td>
    <td>Temporary injury (needs additional medical care)</td>
  </tr>
  <tr>
    <td>🟠</td>
    <td>Severe</td>
    <td>Permanent injury (needs major medical intervention)</td>
  </tr>
  <tr>
    <td >🔴</td>
    <td>Catastrophic</td>
    <td>Life-threatening or death</td>
  </tr>
</table>`;

const params = reactive({
  page: 1,
  size: 4,
});

const getSeverityFilter = () => {
  let filter = [];
  for (const level of SEVERITY_LEVELS) {
    filter.push({
      text: level.emoji + '    ' + level.label,
      value: level.emoji,
    });
  }
  return filter;
};

const getProgressTypeFilter = () => {
  let filter = [];
  for (const type of PROCESS_TYPES) {
    filter.push({
      text: type,
      value: type,
    });
  }
  return filter;
};

const getUpdatedTimeFilter = () => {
  let filter = [];
  for (let i = 0; i < dateRange.timestamps.length; i++) {
    filter.push({
      text: dateRange.items[i],
      value: dateRange.timestamps[i],
    });
  }
  return filter;
};

const getStepIdFilter = () => {
  let filter = [];
  let [subprocessId, stepId] = router.currentRoute.value.params.process_ids;
  if (subprocessId !== undefined) {
    subprocessId = parseInt(subprocessId);
    const steps = PROCESS_STEPS[subprocessId - 1][0].children;
    for (let i = 0; i < steps.length; i++) {
      filter.push({
        text: steps[i].label,
        value: subprocessId + '-' + (i + 1),
      });
    }
  } else {
    for (let i = 0; i < PROCESS_STEPS.length; i++) {
      if (stepId === undefined || i === stepId - 1 || stepId.length === 0) {
        const steps = PROCESS_STEPS[i][0].children;
        for (let j = 0; j < steps.length; j++) {
          filter.push({
            text: steps[j].label,
            value: i + 1 + '-' + (j + 1),
          });
        }
      }
    }
  }

  return filter;
};

onMounted(() => {
  getContainerWidth();

  // enter from sidebar
  if (router.currentRoute.value.params.process_ids === undefined) {
    params.page = 1;
    getTableData(true);
  }
});

const getContainerWidth = () => {
  containerWidth.value = containerRef.value.clientWidth;
  window.onresize = () => {
    return (() => {
      containerWidth.value = containerRef.value.clientWidth;
    })();
  };
};

const getTableData = (isReloading) => {
  authorization()
    .then((resolve) => {
      hasLogin.value = resolve[0];
      username.value = resolve[1];
      let routeUsername = router.currentRoute.value.params.username;

      if (routeUsername == username.value && hasLogin.value && username.value !== null) {
        axios
          .get('/api/fm/', {
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

            // classify severity
            mapFields();

            // avoid resizing in breadcrumb
            if (isReloading) {
              // calculate column width based on content
              calMaxWidth(200, 290, 'mitigation_strategy');
            }
          })
          .catch((err) => console.log(err));
      } else {
        router.push({ name: 'user-landing' });
      }
    })
    .catch((err) => console.log(err));
};

const mapFields = () => {
  tableData.value.forEach((item) => {
    // step_id
    item.step_id = PROCESS_STEPS[item.subprocess_id - 1][0].children[item.step_id - 1].label;
    // severity
    const severityIndex = item.severity;
    item.severity = SEVERITY_LEVELS[severityIndex - 1].emoji;
    // exclude unknown severity
    // item.severity = SEVERITY_LEVELS[severityIndex].emoji;

    // process_type
    // const processIndex = item.process_type - 1;
    // item.process_type = PROCESS_TYPES[processIndex].label;

    if (item.process_type.indexOf('[') !== -1) {
      item.process_type = JSON.parse(item.process_type);
      item.process_type = item.process_type.length === 0 ? undefined : item.process_type;
    }

    // uploaded time
    const time = computeTime(item.created);
    for (let i = 0; i < dateRange.timestamps.length; i++) {
      if (time < dateRange.timestamps[i]) {
        item.updated = dateRange.items[i];
        break;
      }
    }
  });
};

const computeTime = (time) => {
  const current = Date.parse(new Date());
  const end = Date.parse(new Date(time));

  if (end < current) {
    const difference = current - end;
    const days = Math.floor(difference / (24 * 3600 * 1000));
    return days;
  }
};

const getProcessIdParams = () => {
  const processIds = router.currentRoute.value.params.process_ids; // ["1"], ["1", "1"], ["1", ""]

  if (processIds.length === 1 || processIds[1] === '') {
    // subprocess
    breadcrumb.fms_by_subprocess_id = processIds[0];
    breadcrumb.fms_by_step_id = undefined;
    params['subprocess_id'] = processIds[0];
    params['step_id'] = undefined;
  } else if (processIds.length === 2) {
    breadcrumb.fms_by_subprocess_id = processIds[0];
    breadcrumb.fms_by_step_id = processIds[1];
    params['subprocess_id'] = processIds[0];
    params['step_id'] = processIds[1];
  }
};

const changePage = (val) => {
  if ((val > pagination.currentPage && val <= pagination.totalPages) || (val < pagination.currentPage && val >= 0)) {
    pagination.currentPage = params.page = val;
    getTableData(false);
  }
};

/**
 * Breadcrumb
 */
watch(
  () => router.currentRoute.value.params.process_ids,
  (value) => {
    if (value) {
      getProcessIdParams();
    } else {
      params['subprocess_id'] = undefined;
      params['step_id'] = undefined;
      breadcrumb.fms_by_step_id = undefined;
      breadcrumb.fms_by_subprocess_id = undefined;
    }
    params.page = 1;
    getTableData(true);
  },
  { immediate: true }
);

const filterChange = (filter) => {
  if (filter['severity']) {
    let severityParams = [];
    if (filter.severity.length !== 0) {
      filter.severity.forEach((item) => {
        severityParams.push(item);
      });
      let severityList = [];
      severityParams.forEach((value) => {
        SEVERITY_LEVELS.forEach((level) => {
          if (value == level.emoji) {
            severityList.push(level.value);
          }
        });
      });
      params['severity'] = severityList.join(',');
    } else {
      params['severity'] = undefined;
    }
  } else if (filter['rpn']) {
    // TODO
  } else if (filter['process_type']) {
    let processTypeList = [];
    if (filter.process_type.length !== 0) {
      filter.process_type.forEach((value) => {
        processTypeList.push(value);
      });
      params['process_type'] = processTypeList.join(',');
    } else {
      params['process_type'] = undefined;
    }
  } else if (filter['step_id']) {
    let processIdList = [];

    filter.step_id.forEach((value) => {
      processIdList.push(value);
    });
    params['process_id'] = processIdList.join(',');
  } else if (filter['updated']) {
    if (filter.updated.length != 0) {
      let timestamp = dateRange.timestamps[0];

      filter.updated.forEach((value) => {
        // value: days
        if (value > timestamp) {
          timestamp = value;
        }
      });

      const current = new Date();
      timestamp = current.setTime(current.setDate(current.getDate() - timestamp));
      const date = formatDate(timestamp);
      params['updated_after'] = date;
    } else {
      params['updated_after'] = undefined;
    }
  } else {
    params['process_id'] = undefined;
    params['step_id'] = undefined;
  }

  params.page = 1;
  getTableData(false);
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
};

const sortChange = (column) => {
  let field = column.prop;
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

const flexWidth = (font, prop, tableData, title) => {
  if (tableData.length === 0) {
    return;
  }
  let flexWidth = 0; // initial width
  let columnContent = '';
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.font = font;
  if (prop === '' && title) {
    columnContent = title;
  } else {
    // get the widest cell
    let index = 0;
    for (let i = 0; i < tableData.length; i++) {
      const now_temp = tableData[i][prop] + '';
      const max_temp = tableData[index][prop] + '';
      const now_temp_w = context.measureText(now_temp).width;
      const max_temp_w = context.measureText(max_temp).width;
      if (now_temp_w > max_temp_w) {
        index = i;
      }
    }

    columnContent = tableData[index][prop];

    const column_w = context.measureText(columnContent).width;
    const title_w = context.measureText(title).width;
    if (column_w < title_w) {
      columnContent = title || 'blank';
    }
  }

  let width = context.measureText(columnContent);
  flexWidth = width.width + 40;

  return flexWidth;
};

const calMaxWidth = (maxFixedWidth, extraWidth, maxWidthCol) => {
  let totalColWidth = 0;
  containerWidth.value += extraWidth;
  for (let i = 0; i < tableHeader.length; i++) {
    let col = tableHeader[i];
    col.width = flexWidth('16px font-robot', col.name, [...tableData.value], col.label);
    if (col.width > maxFixedWidth) {
      col.width = maxFixedWidth;
    }
    totalColWidth += col.width;
  }
  if (totalColWidth < containerWidth.value) {
    let maxWidthColIndex = getHeaderIndex(maxWidthCol);
    tableHeader.forEach((col) => {
      if (col.name === 'step_id' || col.name === maxWidthColIndex) {
        col.width += ((containerWidth.value - totalColWidth) / 4) * 1;
      } else if (col.name === maxWidthColIndex) {
        col.width += ((containerWidth.value - totalColWidth) / 4) * 1;
      } else if (col.name === 'failure_mode') {
        col.width += ((containerWidth.value - totalColWidth) / 4) * 2;
      }
    });
  }
};

const getCellStyle = (args) => {
  if (args.column.property === 'severity') {
    return {
      textAlign: 'center',
    };
  }
};

const getHeaderStyle = () => {
  return {
    color: '#475569',
    fontSize: 'medium',
  };
};

const getHeaderIndex = (headerName) => {
  for (let i = 0; i < tableHeader.length; i++) {
    if (tableHeader[i].name === headerName) {
      return i;
    }
  }
};

const navToOtherFm = (content) => {
  const regex = /^([1-9][\d]{0,2})(\.[1-9]+)?/;
  if (regex.test(content)) {
    let process_id = content.split(' ')[0];
    let process_ids = [];
    if (process_id.includes('.')) {
      process_ids = process_id.split('.');
    } else {
      process_ids = [process_id];
    }
    router.push({ name: 'fm-detail', params: { process_ids } });
  }
};
</script>

<style scoped>
:deep(.el-table) {
  @apply absolute;
}

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
</style>
