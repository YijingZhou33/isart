<template>
  <div>
    <el-card>
      <el-row class="py-4 px-8 items-center justify-between">
        <el-col :span="4">
          <img class="" src="../../assets/images/lungs.png" />
        </el-col>
        <el-col :span="18">
          <div class="font-medium text-3xl mb-4 text-[#db2777]" v-html="main.title"></div>
          <div class="font-light text-base" v-html="main.text"></div>
        </el-col>
      </el-row>
    </el-card>

    <div class="mt-4">
      <el-collapse>
        <template v-for="({ title, text, icon }, index) in description" :key="title">
          <el-collapse-item :name="index + 1 + ''">
            <template #title>
              <font-awesome-icon :icon="`fa-solid ${icon}`" class="mr-6" />
              {{ title }}
            </template>
            <div v-html="text"></div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
const main = {
  title: 'Welcome to i-SART, <br> An Intelligent Safety Assistant tool for Radiotherapy',
  text: `i-SART is based on AI algorithms and aims to promote patient safety with proactive learning about ways that can go wrong (failure modes: FMs) in radiotherapy (RT). <br>
         It also facilitates the conduct of proactive risk assessment.`,
};

const description = [
  {
    title: 'Failure Modes Database',
    text: `The <a class='text-[#db2777] cursor-pointer underline underline-offset-4 font-semibold text-lg px-1' href="${location.pathname}/fm-list">failure modes database</a> is a data warehourse with FMs in RT. It has been developed from recent published papers and departmental reports which are based on worldwide used methodologies including Failure Mode and Effect Analysis (FMEA) AAPM TG-100, Failure Mode and Effect Criticality Analysis (FMECA), Healthcare Failure Mode and Effect Analysis (HFMEA) in RT. <br>
    You can easily navigate between the sub - processes in the major process of RT and also between various steps.Severity of FMs, potential causes and effects, and mitigation strategies are displayed as they have been identified in the reports. Occurrence / likelihood and detectability indices and RPNs are not displayed, as they are purely subjective to departmental practices. <br>
    Yet, keep in mind that a FM with low severity may hold a high RPN and needs further investigation. Explanation of the abbreviations appear as …..when you place your cursor to the…..
    <p class='text-[#db2777] text-lg font-semibold pt-4'>IMPORTANT NOTE</p>The FMs database should be used thoroughly as an advisory tool and not as a certified product. Every department functions under its own workflow, protocols, and safety barriers and technology that lead every risk assessment study. 
    `,
    icon: 'fa-toggle-on',
  },
  {
    title: 'FMEA overview',
    text: `This section provides a brief overview to the FMEA methodology.`,
    icon: 'fa-outdent',
  },
  {
    title: 'My FMEA',
    text: `At this section, you can conduct your own proactive risk assessment based on the American Association of Physicists in Medicine (AAPM) TG-100.  
           You can downloaded it and …………
          You can assist in making RT safer by submitting your FMEA study.
          It is confidential and it is protected by ………. Your data will only update the database.  `,
    icon: 'fa-book-bookmark',
  },
  {
    title: 'i-SART Evaluation',
    text: `Help us improve. Before you exit consider filling in the questionnaire whether or not you have used my FMEA section, to help us improve this program to fit your needs.`,
    icon: 'fa-comments',
  },
];
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
</style>
