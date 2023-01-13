<template>
  <div>
    <el-card>
      <el-row class="py-4 px-8 items-center justify-between">
        <el-col :span="4">
          <img src="../../assets/images/medical-assistance.png" />
        </el-col>
        <el-col :span="18">
          <div class="font-medium text-3xl mb-4 text-[#db2777]" v-html="main.title"></div>
          <div class="font-light text-base" v-html="main.text"></div>
        </el-col>
      </el-row>
    </el-card>

    <el-row class="mt-6 justify-between">
      <el-col :span="16">
        <el-carousel trigger="click" :autoplay="false" id="container" arrow="always">
          <el-carousel-item>
            <v-chart :option="severityPieChartOption" ref="pieChartRef" id="pieChart" />
          </el-carousel-item>

          <!-- <el-carousel-item>
          <v-chart :option="subprocessBarChartOption" ref="barChartRef" id="barChart" />
        </el-carousel-item> -->

          <el-carousel-item>
            <v-chart :option="subprocessSeverityBarChartOption" ref="stackChartRef" id="stackChart" />
          </el-carousel-item>

          <el-carousel-item>
            <v-chart :option="techniquePieChartOption" ref="roseChartRef" id="roseChart" />
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <el-col :span="7">
        <el-card class="h-full">
          <template #header>
            <el-row class="justify-between items-center">
              <el-col :span="4"><img src="../../assets/images/wreath.png" /></el-col>
              <el-col class="font-medium text-3xl text-center text-[#db2777]" :span="18"> {{ card.title }}</el-col>
            </el-row>
          </template>
          <div>
            <el-row class="mb-2" v-for="{ name, icon, text } in card.statistics" :key="icon">
              <el-col :span="2">{{ icon }}</el-col>
              <el-col class="text-base font-medium text-gray-700" :span="18" v-html="name"></el-col>
              <el-col :span="4" class="text-[#db2777] font-light text-lg text-center">{{ text }}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
/* eslint-disable */
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, onMounted, reactive } from 'vue';
import axios from 'axios';
import authorization from '@/utils/authorization';
import { SEVERITY_LEVELS, PROCESS, PROCESS_TYPES } from '@/utils/enum';
import { useRouter } from 'vue-router';

const main = {
  title: 'Welcome to i-SART Administrator Dashboard',
  text: `Some descriptions go here...`,
};

let statistics = reactive({
  FMsBefore: 0,
  FMsAfter: 0,
  userNum: 0,
  userAddedFMs: 0,
  fmeaReports: 0,
});

const card = reactive({
  title: 'iSART Summary',
  statistics: [
    {
      icon: '🏆',
      name: 'Total number of FMs',
      text: ``,
    },
    {
      icon: '',
      name: `<span class="pl-4 text-gray-500">Before the release of iSART</>`,
      text: `${statistics.FMsBefore}`,
    },
    {
      icon: '',
      name: `<span class="pl-4 text-gray-500">After the release of iSART</>`,
      text: `${statistics.FMsAfter}`,
    },
    {
      icon: '👏',
      name: 'Number of registered users',
      text: `${statistics.userNum}`,
    },
    {
      icon: '📊',
      name: 'Number of user-added FMs',
      text: `${statistics.userAddedFMs}`,
    },
    {
      icon: '🗓',
      name: 'Number of FMEA reports user submitted',
      text: `${statistics.fmeaReports}`,
    },
  ],
});

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart, LineChart]);

// provide(THEME_KEY, 'dark');

let pieChartRef = ref(null);
let barChartRef = ref(null);
let stackChartRef = ref(null);
let roseChartRef = ref(null);

let username = ref('');
let hasLogin = ref(false);

const params = reactive({
  page: 1,
  size: 10000,
});

let data = ref(null);
const subprocessChart = {
  title: 'Subprocess',
  legend: [],
};
let subprocessData = reactive({ value: [] });

const severityChart = {
  title: 'The Amount of FMs by Severity',
  legend: [],
};
let severityData = reactive({ value: [] });

const subprocessSeverityBarChart = {
  title: 'FM Severity Distribution by Subprocess',
  subprocessLegend: [],
  severityLegend: [],
};
let subprocessSeverityData = reactive({ value: [] });

const techniquePieChart = {
  title: 'The Amount of FMs by Treatment Technique',
  legend: [],
};
let techniqueData = reactive({ value: [] });

const router = useRouter();

const fourColorsPalette = ['#C5F8C8', '#FAF096', '#FCCB8F', '#F9989F'];
const sevenColorsPalette = ['#8ecae6', '#219ebc', '#126782', '#023047', '#ffb703', '#fd9e02', '#fb8500'];

onMounted(() => {
  window.onresize = () => {
    pieChartRef.value.resize(resizeDom('pieChart', 'container'));
    // barChartRef.value.resize(resizeDom('barChart', 'container'));
    stackChartRef.value.resize(resizeDom('stackChart', 'container'));
    roseChartRef.value.resize(resizeDom('roseChart', 'container'));
  };
  pieChartRef.value.resize(resizeDom('pieChart', 'container'));
  // barChartRef.value.resize(resizeDom('barChart', 'container'));
  stackChartRef.value.resize(resizeDom('stackChart', 'container'));
  roseChartRef.value.resize(resizeDom('roseChart', 'container'));

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
            // totalFMs - before
            card.statistics[1].text = response.data.count;
            data.value = response.data.results;

            classifyData();
          })
          .catch((err) => console.log(err));

        axios
          .get('/api/user/', {
            params: {
              page: 1,
              size: 4,
              is_admin: false,
            },
            // Authentication
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('access.isart'),
            },
          })
          .then((response) => {
            card.statistics[3].text = response.data.length;
          })
          .catch((err) => console.log(err));

        axios
          .get('/api/user-fm/', {
            params: {
              page: 1,
              size: 10000,
            },
            // Authentication
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + localStorage.getItem('access.isart'),
            },
          })
          .then((response) => {
            card.statistics[4].text = response.data.count;
          })
          .catch((err) => console.log(err));
      } else {
        router.push({ name: 'admin-landing' });
      }
    })
    .catch((err) => console.log(err));
});

const resizeDom = (chartId, containerId) => {
  let chartDom = document.getElementById(chartId);

  const containerHeight = document.getElementById(containerId).clientHeight;
  const containerWidth = document.getElementById(containerId).clientWidth;

  chartDom.style.height = containerHeight + 'px';
  chartDom.style.width = containerWidth + 'px';

  return { width: containerWidth, height: containerHeight };
};

const classifyData = () => {
  // Severity
  SEVERITY_LEVELS.forEach((severity) => {
    const label = severity.emoji + ' ' + severity.label;
    severityData.value.push({
      name: label,
      value: 0,
    });
    severityChart.legend.push(label);
    subprocessSeverityData.value.push({
      name: label,
      data: [],
      type: 'bar',
      stack: 'x',
      color: fourColorsPalette[severity.value - 1],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
    });
    subprocessSeverityBarChart.severityLegend.push(label);
  });

  // Subprocess
  for (const process of PROCESS) {
    process.forEach((item) => {
      const label = item.phase + '. ' + item.title;
      subprocessData.value.push(0);
      subprocessChart.legend.push(label);

      subprocessSeverityBarChart.subprocessLegend.push(label);
      subprocessSeverityData.value.forEach((item) => {
        item.data.push(0);
      });
    });
  }

  // Technique
  PROCESS_TYPES.forEach((technique) => {
    techniqueData.value.push({
      name: technique,
      value: 0,
    });
    techniquePieChart.legend.push(technique);
  });

  data.value.forEach((item) => {
    subprocessData.value[item.subprocess_id - 1] += 1;
    severityData.value[item.severity - 1].value += 1;
    subprocessSeverityData.value[item.severity - 1].data[item.subprocess_id - 1] += 1;

    for (let i = 0; i < PROCESS_TYPES.length; i++) {
      if (PROCESS_TYPES[i] === item.process_type) {
        techniqueData.value[i].value += 1;
      }
    }
  });

  subprocessSeverityData.value.push({ type: 'line', data: subprocessData.value, smooth: true });
};

const severityPieChartOption = ref({
  title: {
    text: severityChart.title,
    left: 'center',
    top: 20,
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 20,
    top: 60,
    data: severityChart.legend,
  },
  series: [
    {
      name: severityChart.title,
      type: 'pie',
      color: fourColorsPalette,
      radius: '70%',
      center: ['50%', '60%'],
      data: severityData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

const subprocessBarChartOption = ref({
  xAxis: {
    data: subprocessChart.legend,
  },
  yAxis: {},
  series: [{ name: subprocessChart.title, type: 'bar', data: subprocessData.value }],
});

const subprocessSeverityBarChartOption = ref({
  title: {
    text: subprocessSeverityBarChart.title,
    left: 'center',
    top: 20,
  },
  legend: {
    orient: 'horizontal',
    bottom: 10,
    data: subprocessSeverityBarChart.severityLegend,
  },
  tooltip: {
    trigger: 'item',
  },
  xAxis: {
    type: 'category',
    axisTick: {
      alignWithLabel: true,
    },
    data: subprocessSeverityBarChart.subprocessLegend,
  },
  yAxis: [
    {
      type: 'value',
      name: 'Failure Modes',
      min: 0,
      max: 200,
      position: 'left',
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: subprocessSeverityData.value,
});

const techniquePieChartOption = ref({
  title: {
    text: techniquePieChart.title,
    left: 'center',
    top: 20,
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 20,
    top: 60,
    data: techniquePieChart.legend,
  },
  series: [
    {
      name: techniquePieChart.title,
      type: 'pie',
      color: sevenColorsPalette,
      radius: ['35%', '70%'],
      center: ['50%', '60%'],
      data: techniqueData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});
</script>

<style scoped>
:deep(.el-collapse-item__header) {
  @apply px-8 text-xl font-medium;
}

:deep(.el-collapse-item__content) {
  @apply px-16 text-base font-light pt-4 whitespace-pre-line;
}

:deep(.el-collapse-item__header) {
  @apply text-[#475569];
}

:deep(.el-carousel__container) {
  @apply h-full min-h-[400px];
}

.el-carousel__item {
  @apply bg-[#fff] opacity-80;
}
</style>
