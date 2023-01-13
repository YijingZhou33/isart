<template>
  <div class="overflow-hidden">
    <el-card :class="screenWidth > 768 ? 'px-8' : 'px-1'">
      <el-row class="pb-4 items-center justify-between">
        <el-col :span="4" class="hidden-xs-only">
          <img src="../../assets/images/medical-report.png" />
        </el-col>
        <el-col :span="18">
          <div class="font-medium text-3xl mb-4 text-[#db2777]" v-html="main.title"></div>
          <div class="font-light text-base" v-html="main.text"></div>
        </el-col>
      </el-row>

      <el-form :model="form" :label-position="screenWidth > 768 ? 'left' : 'top'" ref="ruleFormRef" label-width="auto" :rules="rules">
        <!-- Subprocess && Step -->
        <el-row justify="space-between" class="mb-4" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
          <!-- Subprocess -->
          <el-col :xs="{ span: 24 }" :span="12">
            <el-form-item :label="fmForm.subprocessField.title" prop="subprocess" required>
              <el-select v-model="form.subprocess" :placeholder="fmForm.subprocessField.placeholder" class="w-full" @change="selectSubprocess">
                <el-option v-for="(item, index) in PROCESS_STEPS" :key="index" :label="item[0].label" :value="index + 1" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Step -->
          <el-col :xs="{ span: 24 }" :span="11">
            <el-form-item :label="fmForm.stepField.title" prop="step" required>
              <el-select
                v-model="form.step"
                :placeholder="fmForm.stepField.placeholder"
                class="w-full"
                :disabled="!subprocessSelected"
                @change="selectStep"
              >
                <el-option v-for="(step, index) in PROCESS_STEPS[subprocessId - 1][0].children" :key="step" :label="step.label" :value="index + 1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Techniques -->
        <template v-if="stepSelected && hasTechniques">
          <el-row justify="space-between" class="mb-4">
            <!-- Techniques -->
            <el-col :span="12">
              <el-form-item :label="fmForm.techniqueField.title" prop="technique" required>
                <el-select v-model="form.technique" :placeholder="fmForm.techniqueField.placeholder" class="w-full" @change="selectTechnique">
                  <el-option v-for="(technique, index) in techniques.value" :key="technique" :label="technique" :value="index" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- SubTechniques -->
            <el-col :span="11" v-if="hasSubTechniques && !subtechniqueInputShown">
              <el-form-item :label="fmForm.subTechniqueField.title" prop="subtechnique" required>
                <el-select
                  v-model="form.subtechnique"
                  :placeholder="fmForm.subTechniqueField.placeholder"
                  class="w-full"
                  @change="selectSubtechnique"
                  :disabled="!techniqueSelected"
                >
                  <el-option v-for="(subtechnique, index) in subTechniques.value" :key="subtechnique" :label="subtechnique" :value="index" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <!-- Technique Input -->
            <el-col :span="12" v-if="techniqueInputShown" class="mb-4">
              <el-form-item :label="fmForm.techniqueField.title" prop="techniqueInput" required>
                <el-input
                  v-model="form.techniqueInput"
                  :autosize="{ minRows: 2, maxRows: 3 }"
                  type="textarea"
                  :placeholder="fmForm.techniqueField.placeholder"
                />
              </el-form-item>
            </el-col>

            <!-- SubTechnique Input -->
            <el-col :span="11" v-if="hasSubTechniques && subtechniqueInputShown" class="mb-4">
              <el-form-item :label="fmForm.subTechniqueField.title" prop="subtechniqueInput" required>
                <el-input
                  v-model="form.subtechniqueInput"
                  :autosize="{ minRows: 2, maxRows: 3 }"
                  type="textarea"
                  :placeholder="fmForm.subTechniqueField.placeholder"
                  :disabled="!techniqueSelected"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- Technology -->
        <template v-if="stepSelected && hasTechnologies">
          <el-row justify="space-between" class="mb-4">
            <!-- Technology -->
            <el-col :span="12">
              <el-form-item :label="fmForm.technologyField.title" prop="technology" required>
                <el-select v-model="form.technology" :placeholder="fmForm.technologyField.placeholder" class="w-full" @change="selectTechnology">
                  <el-option v-for="(technology, index) in technologies.value" :label="technology" :value="index" :key="technology" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Technology Input -->
            <el-col :span="11" v-if="technologyInputShown">
              <el-form-item :label="fmForm.technologyField.title" prop="technologyInput" required>
                <el-input
                  v-model="form.technologyInput"
                  :autosize="{ minRows: 2, maxRows: 3 }"
                  type="textarea"
                  :placeholder="fmForm.technologyField.placeholder"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- Failure Mode -->
        <!-- <el-row justify="space-between" class="mb-4" v-if="failureModeMenuShown">
          <el-col :span="12">
            <el-form-item :label="fmForm.fmField.title" prop="failureMode">
              <el-select
                v-model="form.failureMode"
                :placeholder="fmForm.fmField.placeholder"
                class="w-full"
                @change="selectFailureMode"
                :disabled="!stepSelected"
              >
                <el-option v-for="(failureMode, index) in failureModes.value" :key="failureMode" :label="failureMode" :value="index" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" v-if="hasSubFailureMode" class="mb-4">
            <el-form-item :label="fmForm.subfmField.title" prop="subFailureMode">
              <el-select
                v-model="form.subFailureMode"
                :placeholder="fmForm.subfmField.placeholder"
                class="w-full"
                @change="selectSubFailureMode"
                :disabled="!failureModeSelected"
              >
                <el-option v-for="(subfm, index) in subFailureModes.value" :key="index" :label="subfm" :value="index" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" v-if="subFailureModeInputShown">
            <el-form-item :label="fmForm.subfmField.title" prop="subFailureModeInput" required>
              <el-input
                v-model="form.subFailureModeInput"
                :autosize="{ minRows: 2, maxRows: 3 }"
                type="textarea"
                :placeholder="fmForm.subfmField.placeholder"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="mb-8" v-if="!failureModeMenuShown">
          <el-form-item :label="fmForm.fmField.title" prop="failureModeInput" required>
            <el-input
              v-model="form.failureModeInput"
              :autosize="{ minRows: 3, maxRows: 5 }"
              type="textarea"
              :placeholder="fmForm.fmField.placeholder"
              :disabled="!stepSelected"
            />
          </el-form-item>
        </div> -->

        <div class="mb-8">
          <el-form-item :label="fmForm.fmField.title" prop="failureMode" required>
            <el-input v-model="form.failureMode" :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" :placeholder="fmForm.fmField.placeholder" />
          </el-form-item>
        </div>
        <el-divider content-position="center">{{ main.primaryDivider }}</el-divider>

        <!-- Potential Effects -->
        <el-row justify="space-between" class="mb-4">
          <!-- Potential Effects -->
          <el-col :span="12">
            <el-form-item :label="fmForm.effectsField.title" prop="effect">
              <el-select
                v-model="form.effect"
                :placeholder="fmForm.effectsField.placeholder"
                class="w-full"
                :disabled="!subprocessSelected"
                @change="selectEffect"
              >
                <el-option-group v-for="(item, index1) in POTENTIAL_EFFECTS" :key="index1" :label="item.effect" :value="index1">
                  <el-option v-for="({ subeffect }, index2) in item.group" :label="subeffect" :value="index1 + '-' + index2" :key="subeffect" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Severity  -->
          <el-col :span="11" v-if="effectSelected && !effectInputShown && !effectSkip">
            <el-form-item :label="fmForm.severityField.title" prop="severity">
              <el-radio-group v-model="form.severity">
                <el-radio v-for="score in severity.value" :label="score" :value="score" :key="score" class="mr-4" @change="selectSeverity" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Potential Effects Input -->
        <el-row justify="space-between" v-if="effectInputShown">
          <!-- Potential Effects Input -->
          <el-col :span="12" class="mb-4">
            <el-form-item :label="fmForm.effectsField.title" prop="effectInput">
              <el-input
                v-model="form.effectInput"
                :autosize="{ minRows: 2, maxRows: 3 }"
                type="textarea"
                :placeholder="fmForm.effectsField.placeholder"
              />
            </el-form-item>
          </el-col>

          <!-- Severity Input -->
          <el-col :span="11" v-if="effectInputShown" class="mb-4">
            <el-form-item :label="fmForm.severityField.title" prop="severityInput">
              <el-input-number v-model="form.severityInput" :min="1" :max="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Potential Causes -->
        <el-row justify="space-between" class="mb-4">
          <!-- Potential Causes -->
          <el-col :span="12">
            <el-form-item :label="fmForm.causesField.title" prop="cause">
              <el-select
                v-model="form.cause"
                :placeholder="fmForm.causesField.placeholder"
                class="w-full"
                @change="selectCause"
                :disabled="!subprocessSelected"
              >
                <el-option v-for="(item, index) in POTENTIAL_CAUSES" :key="item.cause" :label="item.cause" :value="index" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Potential Subcauses -->
          <el-col :span="11" v-if="!causeInputShown && !causeSkip" class="mb-4">
            <el-form-item :label="fmForm.subcausesField.title" prop="subcause">
              <el-select
                v-model="form.subcause"
                :placeholder="fmForm.subcausesField.placeholder"
                class="w-full"
                @change="selectSubcause"
                :disabled="!subprocessSelected || !causeSelected"
              >
                <el-option v-for="(subcause, index) in POTENTIAL_CAUSES[causeIndex].subcauses" :key="index" :label="subcause" :value="subcause" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Potential Causes Input -->
          <el-col :span="11" v-if="causeInputShown && !causeSkip">
            <el-form-item :label="fmForm.causesField.title" prop="causeInput" required>
              <el-input
                v-model="form.causeInput"
                :autosize="{ minRows: 2, maxRows: 3 }"
                type="textarea"
                :placeholder="fmForm.causesField.placeholder"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Mitigation Strategies -->
        <el-row justify="space-between" class="mb-4">
          <!-- Mitigation Strategies -->
          <el-col :span="12">
            <el-form-item :label="fmForm.mitigationField.title" prop="mitigation">
              <el-select
                v-model="form.mitigation"
                :placeholder="fmForm.mitigationField.placeholder"
                class="w-full"
                @change="selectMitigation"
                :disabled="!subprocessSelected"
              >
                <el-option v-for="({ mitigation }, index) in MITIGATION_STRATEGIES" :key="mitigation" :label="mitigation" :value="index" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Mitigation Substrategies -->
          <el-col :span="11" v-if="!mitigationInputShown && !mitigationSkip">
            <el-form-item :label="fmForm.submitigationField.title" prop="submitigation">
              <el-select
                v-model="form.submitigation"
                :placeholder="fmForm.submitigationField.placeholder"
                class="w-full"
                :disabled="!subprocessSelected || !mitigationSelected"
                @change="selectSubmitigation"
              >
                <el-option
                  v-for="(submitigation, index) in MITIGATION_STRATEGIES[mitigationIndex].submitigations"
                  :key="index"
                  :label="submitigation"
                  :value="submitigation"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Mitigation Strategies Input -->
          <el-col :span="11" v-if="mitigationInputShown && !mitigationSkip">
            <el-form-item :label="fmForm.mitigationField.title" prop="mitigationInput" required>
              <el-input
                v-model="form.mitigationInput"
                :autosize="{ minRows: 2, maxRows: 3 }"
                type="textarea"
                :placeholder="fmForm.mitigationField.placeholder"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Software Solution -->
        <el-form-item :label="fmForm.softwareSolutionField.title" prop="softwareSolution">
          <el-input
            v-model="form.softwareSolution"
            type="textarea"
            :placeholder="fmForm.softwareSolutionField.placeholder"
            :rows="fmForm.softwareSolutionField.rows"
            :disabled="!subprocessSelected"
          />
        </el-form-item>

        <el-divider content-position="center">{{ main.secondaryDivider }}</el-divider>

        <!-- Comments -->
        <el-form-item :label="fmForm.commentsField.title" prop="comments">
          <el-input
            v-model="form.comments"
            type="textarea"
            :placeholder="fmForm.commentsField.placeholder"
            :rows="fmForm.commentsField.rows"
            :disabled="!subprocessSelected"
          />
        </el-form-item>

        <!-- Button -->
        <el-form-item class="mt-8 justify-between">
          <el-button type="primary" :plain="true" @click.prevent="onSubmit(ruleFormRef)" :class="screenWidth > 768 ? 'w-[30%]' : 'w-full mb-2'">{{
            main.primaryButton
          }}</el-button>
          <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:30%' : 'width:100%; margin-left:auto'">{{
            main.secondaryButton
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
/* eslint-disable */
import { reactive, ref, onMounted } from 'vue';
import {
  PROCESS_STEPS,
  POTENTIAL_CAUSES,
  POTENTIAL_EFFECTS,
  TECHNOLOGIES,
  TECHNIQUES,
  MITIGATION_STRATEGIES,
  NOT_FOUND_OPTION,
  SKIP_OPTION,
  SUBTECHNIQUES,
  // FAILURE_MODES,
} from '@/utils/enum';
import { ElMessage } from 'element-plus';
import authorization from '@/utils/authorization';
import axios from 'axios';
import { useRouter } from 'vue-router';

const subprocessSelected = ref(false);
const stepSelected = ref(false);
const subprocessId = ref(1);
const stepId = ref(1);
const causeSelected = ref(false);
const causeIndex = ref(0);
const effectSelected = ref(false);
const mitigationSelected = ref(false);
const mitigationIndex = ref(0);
const hasTechniques = ref(false);
const hasTechnologies = ref(false);
const hasSubTechniques = ref(false);
const techniqueSelected = ref(false);
const techniqueInputShown = ref(false);
const subtechniqueInputShown = ref(false);
const technologyInputShown = ref(false);
const effectInputShown = ref(false);
const causeInputShown = ref(false);
const mitigationInputShown = ref(false);
const effectSkip = ref(false);
const causeSkip = ref(false);
const mitigationSkip = ref(false);
const techniques = reactive({ value: [] });
const subTechniques = reactive({ value: [] });
const technologies = reactive({ value: [] });
const severity = reactive({ value: [] });
// const failureModeMenuShown = ref(false);
// const failureModeSelected = ref(false);
// const hasSubFailureMode = ref(true);
// const failureModeInputShown = ref(false);
// const subFailureModeInputShown = ref(false);
// const failureModeIndex = ref(0);
// const failureModes = reactive({ value: [] });
// const subFailureModes = reactive({ value: [] });
// const failureModeKeywords = reactive({ value: [] });

const ruleFormRef = ref(null);
const params = reactive({
  subprocess_id: null,
  step_id: null,
  // failure_mode: {
  //   failureMode: null,
  //   subFailureMode: null,
  //   failureModeInput: null,
  //   subFailureModeInput: null,
  // },
  failure_mode: null,
  potential_effect: {
    effect: null,
    effectInput: null,
    subeffect: null,
    severity: null,
    severityInput: null,
  },
  potential_causes: {
    cause: null,
    subcause: null,
    causeInput: null,
  },
  severity: null,
  mitigation_strategy: {
    mitigation: null,
    submitigation: null,
    mitigationInput: null,
  },
  process_type: {
    technique: null,
    subtechnique: null,
    techniqueInput: null,
    subtechniqueInput: null,
  },
  process_id: null,
  published: 0,
  comments: null,
  technology: {
    technology: null,
    technologyInput: null,
  },
  software_solution: null,
});

const clearTechs = () => {
  hasTechniques.value = false;
  hasTechnologies.value = false;
  hasSubTechniques.value = false;
  techniqueSelected.value = false;
  techniqueInputShown.value = false;
  subtechniqueInputShown.value = false;
  technologyInputShown.value = false;

  form.technique = '';
  form.subtechnique = '';
  form.subtechniqueInput = '';
  form.techniqueInput = '';
  form.technologyInput = '';
  form.technology = '';
};

// const clearFailureModes = () => {
//   failureModeMenuShown.value = false;
//   failureModeSelected.value = false;
//   hasSubFailureMode.value = false;
//   failureModeInputShown.value = false;
//   subFailureModeInputShown.value = false;
//   failureModeIndex.value = 0;
//   failureModes.value = [];
//   subFailureModes.value = [];
//   failureModeKeywords.value = [];

//   form.failureMode = '';
//   form.subFailureMode = '';
//   form.failureModeInput = '';
//   form.subFailureModeInput = '';
// };

const main = {
  title: 'Do you want to share any failure modes you encountered in the daily work?',
  text: `Some description goes here .....`,
  primaryDivider: 'Optional Fields',
  secondaryDivider: 'Any Further Thoughts?',
  primaryButton: 'Submit',
  secondaryButton: 'Clear',
};

const fmForm = {
  subprocessField: {
    title: 'Subprocess',
    placeholder: 'Please select the subprocess',
  },
  stepField: {
    title: 'Step',
    placeholder: 'Please select the step',
  },
  techniqueField: {
    title: 'Technique',
    placeholder: 'Please select/enter the technique',
  },
  subTechniqueField: {
    title: '',
    placeholder: 'Please select/enter the technique',
  },
  technologyField: {
    title: 'Treatment Technology',
    placeholder: 'Please select/enter the technology',
  },
  fmField: {
    title: 'Failure Mode',
    placeholder: 'Please enter the failure mode',
  },
  // fmField: {
  //   title: 'Failure Mode',
  //   placeholder: 'Please select/enter the failure mode',
  // },
  // subfmField: {
  //   title: '',
  //   placeholder: 'Please select/enter the failure mode',
  // },
  effectsField: {
    title: 'Potential Effects',
    placeholder: 'Please select/enter the potential effects',
  },
  severityField: {
    title: 'Severity',
  },
  causesField: {
    title: 'Potential Causes',
    placeholder: 'Please select/enter the potential causes',
  },
  subcausesField: {
    title: '',
    placeholder: 'Please select the potential causes',
  },
  mitigationField: {
    title: 'Mitigation Strategies',
    placeholder: 'Please select/enter the mitigation Strategies',
  },
  submitigationField: {
    title: '',
    placeholder: 'Please select the mitigation Strategies',
  },
  commentsField: {
    title: 'Comments',
    placeholder: 'Please enter your comments',
    rows: 5,
  },
  softwareSolutionField: {
    title: 'Any software solution',
    placeholder: 'Do you think of any new feature in the software would mitigate the risk of this FM?',
    rows: 5,
  },
};

const form = reactive({
  subprocess: '',
  step: '',
  technique: '',
  subtechnique: '',
  techniqueInput: '',
  subtechniqueInput: '',
  technology: '',
  technologyInput: '',
  failureMode: '',
  // subFailureMode: '',
  // failureModeInput: '',
  // subFailureModeInput: '',
  effect: '',
  effectInput: '',
  severity: null,
  severityInput: null,
  cause: '',
  subcause: '',
  causeInput: '',
  mitigation: '',
  submitigation: '',
  mitigationInput: '',
  comments: '',
  softwareSolution: '',
});

const rules = reactive({
  subprocess: [{ required: true, message: 'Please select the subprocess', trigger: 'change' }],
  step: [{ required: true, message: 'Please select the step', trigger: 'change' }],
  technique: [{ required: true, message: 'Please select the technique', trigger: 'change' }],
  subtechnique: [{ required: true, message: 'Please select the technique', trigger: 'change' }],
  techniqueInput: [
    {
      required: true,
      message: `Please enter the technique`,
      trigger: 'blur',
    },
  ],
  subtechniqueInput: [
    {
      required: true,
      message: `Please enter the technique`,
      trigger: 'blur',
    },
  ],
  technology: [{ required: true, message: 'Please select the technology', trigger: 'change' }],
  technologyInput: [
    {
      required: true,
      message: `Please enter the technology`,
      trigger: 'blur',
    },
  ],
  failureMode: [{ required: true, message: 'Please enter the failure mode', trigger: 'change' }],
  // failureMode: [{ required: true, message: 'Please select the failure mode', trigger: 'change' }],
  // subFailureMode: [{ required: true, message: 'Please select the failure mode', trigger: 'change' }],
  // failureModeInput: [
  //   { required: true, message: 'Please enter the failure mode', trigger: 'blur' },
  //   {
  //     validator: function (rule, fmValue, callback) {
  //       const keywordsSize = failureModeKeywords.value.length;
  //       let flags = new Array(keywordsSize).fill(false);
  //       for (let i = 0; i < keywordsSize; i++) {
  //         for (const keyword of failureModeKeywords.value[i]) {
  //           if (fmValue.toLowerCase().includes(keyword)) {
  //             flags[i] = true;
  //             break;
  //           }
  //         }
  //       }
  //       let missingKeywords = [];
  //       for (let i = 0; i < keywordsSize; i++) {
  //         if (flags[i] === false) {
  //           missingKeywords.push(failureModeKeywords.value[i].join(', '));
  //         }
  //       }
  //       if (missingKeywords.length > 0) {
  //         callback(new Error(`The failure mode should at least include the following keywords: ${missingKeywords}`));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: 'change',
  //   },
  // ],
  // subFailureModeInput: [
  //   { required: true, message: 'Please enter the failure mode', trigger: 'blur' },
  //   {
  //     validator: function (rule, fmValue, callback) {
  //       const keywordsSize = failureModeKeywords.value.length;
  //       let flags = new Array(keywordsSize).fill(false);
  //       for (let i = 0; i < keywordsSize; i++) {
  //         for (const keyword of failureModeKeywords.value[i]) {
  //           if (fmValue.toLowerCase().includes(keyword)) {
  //             flags[i] = true;
  //             break;
  //           }
  //         }
  //       }
  //       let missingKeywords = [];
  //       for (let i = 0; i < keywordsSize; i++) {
  //         if (flags[i] === false) {
  //           missingKeywords.push(failureModeKeywords.value[i].join(', '));
  //         }
  //       }
  //       if (missingKeywords.length > 0) {
  //         callback(new Error(`The failure mode should at least include the following keywords: ${missingKeywords}`));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: 'change',
  //   },
  // ],
  severity: [{ required: true, message: 'Please select the severity', trigger: 'change' }],
  severityInput: [{ required: true, message: 'Please select the severity, it should be 1 to 10', trigger: 'change' }],
  effectInput: [
    {
      required: true,
      message: `Please enter the potential effect, otherwise you can select "${SKIP_OPTION}" in the dropdown list to skip this step`,
      trigger: 'blur',
    },
  ],
  subcause: [
    {
      validator: function (rule, value, callback) {
        if (causeSelected.value && value === '') {
          callback(new Error(`Please select the potential cause, otherwise you can select "${SKIP_OPTION}" in the dropdown list to skip this step`));
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
  causeInput: [
    {
      required: true,
      message: `Please enter the potential cause, otherwise you can select "${SKIP_OPTION}" in the dropdown list to skip this step`,
      trigger: 'blur',
    },
  ],
  submitigation: [
    {
      validator: function (rule, value, callback) {
        if (mitigationSelected.value && value === '') {
          callback(
            new Error(`Please select the mitigation strategy, otherwise you can select "${SKIP_OPTION}" in the dropdown list to skip this step`)
          );
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
  mitigationInput: [
    {
      required: true,
      message: `Please enter the mitigation strategy, otherwise you can select "${SKIP_OPTION}" in the dropdown list to skip this step`,
      trigger: 'blur',
    },
  ],
});
const router = useRouter();
const storage = localStorage;
let screenWidth = ref('');
let username = ref('');
let hasLogin = ref(false);

const messages = {
  success: 'Submit successfully!',
  no_credentials: 'Authentication credentials were not provided',
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

const selectSubprocess = (subprocess) => {
  subprocessSelected.value = true;
  subprocessId.value = subprocess;
  stepSelected.value = false;
  params.subprocess_id = subprocess;
  form.step = '';

  clearTechs();
  // clearFailureModes();
};

const selectStep = (step) => {
  stepSelected.value = true;
  stepId.value = step;
  params.step_id = step;
  params.process_id = subprocessId.value + '-' + step;
  clearTechs();
  checkTechniques();
  checkTechnologies();

  // clearFailureModes();
  // checkFailureModes();
};

const checkTechniques = () => {
  TECHNIQUES.forEach((item) => {
    if (item.subprocessId === subprocessId.value) {
      hasTechniques.value = true;
      techniques.value = item.techniques;
      if (item.subtechniques != undefined) {
        item.subtechniques.forEach((elem) => {
          if (elem.stepIds.indexOf(stepId.value) !== -1) {
            subTechniques.value = elem.techniques;
            hasSubTechniques.value = true;

            SUBTECHNIQUES.forEach((item) => {
              if (item.process_id === params.process_id) {
                fmForm.subTechniqueField.title = item.name;
              }
            });
          }
        });
      }
    }
  });
};

const checkTechnologies = () => {
  TECHNOLOGIES.forEach((item) => {
    if (item.subprocessId === subprocessId.value) {
      hasTechnologies.value = true;
      technologies.value = item.technologies;
    }
  });
};

// const checkFailureModes = () => {
//   for (let i = 0; i < FAILURE_MODES.length; i++) {
//     if (FAILURE_MODES[i].process_id === params.process_id) {
//       if (FAILURE_MODES[i].failureModes !== undefined) {
//         failureModeMenuShown.value = true;
//         failureModeIndex.value = i;
//         FAILURE_MODES[i].failureModes.forEach((item) => {
//           failureModes.value.push(item.mode);
//         });
//       }
//       if (FAILURE_MODES[i].keywords !== undefined) {
//         failureModeKeywords.value = FAILURE_MODES[i].keywords;
//       }
//     }
//   }
// };

const selectCause = (index) => {
  causeSelected.value = true;
  causeSkip.value = false;
  causeInputShown.value = false;
  form.subcause = '';
  params.potential_causes.subcause = null;
  params.potential_causes.causeInput = null;

  if (POTENTIAL_CAUSES[index].cause === NOT_FOUND_OPTION) {
    causeInputShown.value = true;

    form.causeInput = '';
  } else if (POTENTIAL_CAUSES[index].cause === SKIP_OPTION) {
    causeInputShown.value = false;
    causeSkip.value = true;

    params.potential_causes.cause = null;
  } else {
    causeInputShown.value = false;
    causeIndex.value = index;

    params.potential_causes.cause = POTENTIAL_CAUSES[index].cause;
  }
};

const selectSubcause = (subcause) => {
  params.potential_causes.subcause = subcause;
};

const selectEffect = (effectIndex) => {
  const [index, subindex] = effectIndex.split('-');
  effectSelected.value = true;
  effectSkip.value = false;
  params.potential_effect.effectInput = null;
  params.potential_effect.subeffect = null;
  params.potential_effect.severity = null;
  params.potential_effect.severityInput = null;
  const effect = POTENTIAL_EFFECTS[index].effect;
  const subeffectItem = POTENTIAL_EFFECTS[index].group[subindex];

  if (subeffectItem.subeffect === NOT_FOUND_OPTION) {
    effectInputShown.value = true;
    form.severityInput = null;
    form.effectInput = '';
  } else if (subeffectItem.subeffect === SKIP_OPTION) {
    effectSkip.value = true;
    effectInputShown.value = false;

    params.potential_effect.effect = null;
  } else {
    effectInputShown.value = false;
    severity.value = subeffectItem.severity;

    if (effect.length == 0) {
      params.potential_effect.subeffect = subeffectItem.subeffect;
    } else {
      params.potential_effect.effect = effect;
      params.potential_effect.subeffect = subeffectItem.subeffect;
    }
  }
};

const selectSeverity = (severity) => {
  params.severity = severity;
  params.potential_effect.severity = severity;
};

const selectMitigation = (index) => {
  mitigationSelected.value = true;
  mitigationSkip.value = false;
  mitigationInputShown.value = false;
  form.submitigation = '';
  params.mitigation_strategy.mitigationInput = null;
  params.mitigation_strategy.submitigation = null;

  const mitigation = MITIGATION_STRATEGIES[index].mitigation;
  if (mitigation === NOT_FOUND_OPTION) {
    mitigationInputShown.value = true;

    form.mitigationInput = '';
  } else if (mitigation === SKIP_OPTION) {
    mitigationInputShown.value = false;
    mitigationSkip.value = true;

    params.mitigation_strategy.mitigation = null;
  } else {
    mitigationInputShown.value = false;
    mitigationIndex.value = index;

    params.mitigation_strategy.mitigation = mitigation;
  }
};

const selectSubmitigation = (submitigation) => {
  params.mitigation_strategy.submitigation = submitigation;
};

const selectTechnique = (techniqueIndex) => {
  techniqueSelected.value = true;
  form.subtechnique = '';
  form.subtechniqueInput = '';
  params.process_type.subtechnique = null;
  params.process_type.subtechniqueInput = null;
  params.process_type.techniqueInput = null;
  const technique = techniques.value[techniqueIndex];
  if (technique === NOT_FOUND_OPTION) {
    techniqueInputShown.value = true;
    hasSubTechniques.value ? (subtechniqueInputShown.value = true) : (subtechniqueInputShown.value = false);
  } else {
    techniqueInputShown.value = false;
    subtechniqueInputShown.value = false;

    params.process_type.technique = technique;
  }
};

const selectSubtechnique = (subtechniqueIndex) => {
  const subtechnique = subTechniques.value[subtechniqueIndex];
  if (subtechnique === NOT_FOUND_OPTION) {
    subtechniqueInputShown.value = true;
  } else {
    subtechniqueInputShown.value = false;

    params.process_type.subtechnique = subtechnique;
  }
};

const selectTechnology = (technologyIndex) => {
  form.technologyInput = '';
  params.technology.technologyInput = null;
  const technology = technologies.value[technologyIndex];
  if (technology === NOT_FOUND_OPTION) {
    technologyInputShown.value = true;
  } else {
    technologyInputShown.value = false;

    params.technology.technology = technology;
  }
};

const selectFailureMode = (index) => {
  failureModeSelected.value = true;
  failureModeInputShown.value = false;
  hasSubFailureMode.value = false;
  subFailureModeInputShown.value = false;
  failureModeInputShown.value = false;

  form.subFailureMode = '';
  form.subFailureModeInput = '';
  params.failure_mode.failureMode = null;
  params.failure_mode.failureModeInput = null;
  params.failure_mode.subFailureMode = null;
  params.failure_mode.subFailureModeInput = null;

  const failureMode = failureModes.value[index];
  if (failureMode === NOT_FOUND_OPTION) {
    subFailureModeInputShown.value = true;
  } else {
    if (FAILURE_MODES[failureModeIndex.value].failureModes[index].submodes !== undefined) {
      hasSubFailureMode.value = true;
      subFailureModes.value = FAILURE_MODES[failureModeIndex.value].failureModes[index].submodes;
    } else {
      subFailureModeInputShown.value = true;
    }

    params.failure_mode.failureMode = failureMode;
  }
};

const selectSubFailureMode = (subFailureModeIndex) => {
  params.failure_mode.failureModeInput = null;
  params.failure_mode.subFailureMode = null;
  params.failure_mode.subFailureModeInput = null;
  const subFailureMode = subFailureModes.value[subFailureModeIndex];
  if (subFailureMode === NOT_FOUND_OPTION) {
    subFailureModeInputShown.value = true;
    hasSubFailureMode.value = false;
  } else {
    subFailureModeInputShown.value = false;

    params.failure_mode.subFailureMode = subFailureMode;
  }
};

const getInputs = () => {
  if (causeInputShown.value) {
    params.potential_causes.cause = null;
    params.potential_causes.subcause = null;
    params.potential_causes.causeInput = form.causeInput.trim();
  }

  if (effectInputShown.value) {
    params.potential_effect.effect = null;
    params.potential_effect.severity = null;
    params.potential_effect.effectInput = form.effectInput.trim();
    params.potential_effect.severityInput = form.severityInput;
    params.severity = form.severityInput;
  }

  if (mitigationInputShown.value) {
    params.mitigation_strategy.mitigation = null;
    params.mitigation_strategy.mitigationInput = form.mitigationInput.trim();
  }

  if (techniqueInputShown.value) {
    params.process_type.technique = null;
    params.process_type.techniqueInput = form.techniqueInput.trim();
  }

  if (subtechniqueInputShown.value) {
    params.process_type.subtechnique = null;
    params.process_type.subtechniqueInput = form.subtechniqueInput.trim();
  }

  if (technologyInputShown.value) {
    params.technology.technology = null;
    params.technology.technologyInput = form.technologyInput.trim();
  }

  if (form.comments) {
    params.comments = form.comments.trim();
  }

  if (form.softwareSolution) {
    params.software_solution = form.softwareSolution.trim();
  }

  // if (failureModeMenuShown.value) {
  //   if (subFailureModeInputShown.value) {
  //     params.failure_mode.failureModeInput = null;
  //     params.failure_mode.subFailureModeInput = form.subFailureModeInput.trim();
  //   }
  // } else {
  //   params.failure_mode.failureMode = null;
  //   params.failure_mode.subFailureMode = null;
  //   params.failure_mode.subFailureModeInput = null;
  //   params.failure_mode.failureModeInput = form.failureModeInput.trim();
  // }

  params.failure_mode = form.failureMode.trim();
};

const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      getInputs();

      authorization()
        .then((resolve) => {
          hasLogin.value = resolve[0];
          username.value = resolve[1];
          let routeUsername = router.currentRoute.value.params.username;
          const token = storage.getItem('access.isart');

          params.process_type = JSON.stringify(params.process_type);
          params.technology = JSON.stringify(params.technology);
          params.potential_causes = JSON.stringify(params.potential_causes);
          params.potential_effect = JSON.stringify(params.potential_effect);
          params.mitigation_strategy = JSON.stringify(params.mitigation_strategy);

          if (routeUsername == username.value && hasLogin.value && username.value !== null) {
            axios
              .post('/api/user-fm/', params, {
                // Authentication
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              })
              .then((response) => {
                // Submit successfully
                if (response.status === 201) {
                  ElMessage({
                    showClose: true,
                    message: messages.success,
                    type: 'success',
                  });
                  console.log(params);
                } else {
                  ElMessage({
                    showClose: true,
                    message: messages.err,
                    type: 'error',
                  });
                }
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  ElMessage({
                    showClose: true,
                    message: messages.no_credentials,
                    type: 'error',
                  });
                } else {
                  ElMessage({
                    showClose: true,
                    message: err.response.data,
                    type: 'error',
                  });
                }
              });
            router.push({ name: 'user-landing' });
          }
        })
        .catch((err) => console.log(err));

      formEl.resetFields();
    }
  });
};

const onReset = async (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped>
:deep(.el-divider__text.is-center) {
  @apply text-[#db2777] text-base font-light;
}

:deep(.el-divider--horizontal) {
  @apply my-10;
}

:deep(.el-select-group__title) {
  @apply text-gray-700 font-semibold text-xs;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  @apply bg-[#db2777] border-[#db2777];
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  @apply text-[#db2777];
}
</style>
