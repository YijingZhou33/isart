<template>
  <div>
    <el-card :class="screenWidth > 768 ? 'px-8' : 'px-1'">
      <div class="mt-2">
        <div class="font-medium text-3xl mb-4 text-[#db2777] text-center" v-html="main.title"></div>

        <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
          <el-breadcrumb-item :to="{ name: breadcrumb.home.pathname }"
            ><el-icon style="vertical-align: middle" size="24px" color="#db2777"><HomeFilled /></el-icon
          ></el-breadcrumb-item>
          <el-breadcrumb-item class="font-semibold text-lg text-[#475569]">{{ breadcrumb.current.title }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div v-for="(value, key) in userFm" :key="key">
          <el-row class="justify-between">
            <el-col :span="6" class="font-semibold italic text-gray-700 mb-1" v-if="value">
              <template v-if="key.indexOf('User-entered') !== -1">
                <div class="text-[#db2777]">{{ key }}</div>
              </template>
              <template v-else>
                {{ key }}
              </template>
            </el-col>
            <el-col :span="16" v-html="value"></el-col>
          </el-row>
        </div>
      </div>

      <el-divider content-position="center">{{ main.primaryDivider }}</el-divider>

      <el-form :model="form" :label-position="screenWidth > 768 ? 'left' : 'top'" ref="ruleFormRef" label-width="auto" :rules="rules">
        <!-- Subprocess && Step -->
        <el-row justify="space-between" class="mb-4" :class="screenWidth > 768 ? 'flex-row' : 'flex-col'">
          <!-- Subprocess -->
          <el-col :xs="{ span: 24 }" :span="12">
            <el-form-item :label="fmForm.subprocessField.title" prop="subprocess" required :class="subprocessIsUpdated ? 'font-semibold' : ''">
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
                :class="stepIsUpdated ? 'font-semibold' : ''"
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
              <el-form-item :label="fmForm.techniqueField.title" prop="technique" required :class="techniqueIsUpdated ? 'font-semibold' : ''">
                <el-select v-model="form.technique" :placeholder="fmForm.techniqueField.placeholder" class="w-full" @change="selectTechnique">
                  <el-option v-for="(technique, index) in techniques.value" :key="technique" :label="technique" :value="index" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- SubTechniques -->
            <el-col :span="11" v-if="hasSubTechniques && !subtechniqueInputShown">
              <el-form-item
                :label="fmForm.subTechniqueField.title"
                prop="subtechnique"
                required
                :class="subtechniqueIsUpdated ? 'font-semibold' : ''"
              >
                <el-select
                  v-model="form.subtechnique"
                  :placeholder="fmForm.subTechniqueField.placeholder"
                  class="w-full"
                  @change="selectSubtechnique"
                  :disabled="!techniqueSelected"
                >
                  <el-option v-for="(subtechnique, index) in subtechniques.value" :key="subtechnique" :label="subtechnique" :value="index" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="space-between">
            <!-- Technique Input -->
            <el-col :span="12" v-if="techniqueInputShown" class="mb-4">
              <el-form-item
                :label="fmForm.techniqueField.title"
                prop="techniqueInput"
                required
                :class="techniqueInputIsUpdated ? 'font-semibold' : ''"
              >
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
              <el-form-item
                :label="fmForm.subTechniqueField.title"
                prop="subtechniqueInput"
                required
                :class="subtechniqueInputIsUpdated ? 'font-semibold' : ''"
              >
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
              <el-form-item :label="fmForm.technologyField.title" prop="technology" required :class="technologyIsUpdated ? 'font-semibold' : ''">
                <el-select v-model="form.technology" :placeholder="fmForm.technologyField.placeholder" class="w-full" @change="selectTechnology">
                  <el-option v-for="(technology, index) in technologies.value" :label="technology" :value="index" :key="technology" />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- Technology Input -->
            <el-col :span="11" v-if="technologyInputShown">
              <el-form-item
                :label="fmForm.technologyField.title"
                prop="technologyInput"
                required
                :class="technologyInputIsUpdated ? 'font-semibold' : ''"
              >
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
        <div class="mb-8">
          <el-form-item :label="fmForm.fmField.title" prop="failureMode" required :class="failureModeIsUpdated ? 'font-semibold' : ''">
            <el-input v-model="form.failureMode" :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" :placeholder="fmForm.fmField.placeholder" />
          </el-form-item>
        </div>

        <el-divider content-position="center">{{ main.secondaryDivider }}</el-divider>

        <!-- Potential Effects -->
        <el-row justify="space-between" class="mb-4">
          <!-- Potential Effects -->
          <el-col :span="12">
            <el-form-item :label="fmForm.effectsField.title" prop="effect" :class="effectIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.severityField.title" prop="severity" :class="severityIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.effectsField.title" prop="effectInput" :class="effectInputIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.severityField.title" prop="severityInput" :class="severityInputIsUpdated ? 'font-semibold' : ''">
              <el-input-number v-model="form.severityInput" :min="1" :max="10" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Potential Causes -->
        <el-row justify="space-between" class="mb-4">
          <!-- Potential Causes -->
          <el-col :span="12">
            <el-form-item :label="fmForm.causesField.title" prop="cause" :class="causeIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.subcausesField.title" prop="subcause" :class="subcauseIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.causesField.title" prop="causeInput" required :class="causeInputIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.mitigationField.title" prop="mitigation" :class="mitigationIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item :label="fmForm.submitigationField.title" prop="submitigation" :class="submitigationIsUpdated ? 'font-semibold' : ''">
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
            <el-form-item
              :label="fmForm.mitigationField.title"
              prop="mitigationInput"
              required
              :class="mitigationInputIsUpdated ? 'font-semibold' : ''"
            >
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
        <el-form-item :label="fmForm.softwareSolutionField.title" prop="softwareSolution" :class="solutionIsUpdated ? 'font-semibold' : ''">
          <el-input
            v-model="form.softwareSolution"
            type="textarea"
            :placeholder="fmForm.softwareSolutionField.placeholder"
            :rows="fmForm.softwareSolutionField.rows"
          />
        </el-form-item>

        <el-divider content-position="center">{{ main.thirdDivider }}</el-divider>

        <!-- Comments -->
        <el-form-item :label="fmForm.commentsField.title" prop="comments" :class="commentsIsUpdated ? 'font-semibold' : ''">
          <el-input v-model="form.comments" type="textarea" :placeholder="fmForm.commentsField.placeholder" :rows="fmForm.commentsField.rows" />
        </el-form-item>

        <!-- Button -->
        <el-form-item class="mt-8 justify-between mb-2">
          <el-button type="primary" :plain="true" @click.prevent="onSubmit(ruleFormRef)" :class="screenWidth > 768 ? 'w-[20%]' : 'w-full '">{{
            main.primaryButton
          }}</el-button>
          <el-button type="warning" :plain="true" @click.prevent="onSave(ruleFormRef)" :class="screenWidth > 768 ? 'w-[20%]' : 'w-full '">{{
            main.secondaryButton
          }}</el-button>
          <el-button
            type="danger"
            :plain="true"
            @click="deleteFmDialogVisible = !deleteFmDialogVisible"
            :class="screenWidth > 768 ? 'w-[20%]' : 'w-full'"
            >{{ main.thirdButton }}</el-button
          >
          <el-button @click="onReset(ruleFormRef)" :style="screenWidth > 768 ? 'width:20%' : 'width:100%; margin-left:auto'">{{
            main.lastButton
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <DeleteFailureModeDialog :delete-fm-dialog-visible="deleteFmDialogVisible" :fmId="id" />
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
} from '@/utils/enum';
import { ElMessage } from 'element-plus';
import authorization from '@/utils/authorization';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Delete, HomeFilled, ArrowRight } from '@element-plus/icons-vue';
import DeleteFailureModeDialog from '@/components/DeleteFailureModeDialog.vue';
// subprocess & step
const subprocessSelected = ref(false);
const subprocessId = ref(1);
const stepSelected = ref(false);
const stepId = ref(1);

// techniques & technologies
const hasTechniques = ref(false);
const hasTechnologies = ref(false);
const hasSubTechniques = ref(false);
const techniqueSelected = ref(false);
const techniqueInputShown = ref(false);
const subtechniqueInputShown = ref(false);
const technologySelected = ref(false);
const technologyInputShown = ref(false);

const techniques = reactive({ value: [] });
const subtechniques = reactive({ value: [] });
const technologies = reactive({ value: [] });

// potential causes
const causeSelected = ref(false);
const causeIndex = ref(0);
const causeInputShown = ref(false);
const causeSkip = ref(false);

// potential effect
const effectSelected = ref(false);
const effectInputShown = ref(false);
const effectSkip = ref(false);
const severity = reactive({ value: [] });

// mitigation strategies
const mitigationSelected = ref(false);
const mitigationIndex = ref(0);
const mitigationInputShown = ref(false);
const mitigationSkip = ref(false);

const ruleFormRef = ref(null);
const params = reactive({
  subprocess_id: null,
  step_id: null,
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

const fmParams = reactive({
  subprocess_id: null,
  step_id: null,
  failure_mode: null,
  potential_effect: null,
  severity: null,
  potential_causes: null,
  mitigation_strategy: null,
  process_type: null,
  process_id: null,
});

const userFm = reactive({
  Subprocess: '',
  Step: '',
  Technique: '',
  'Failure Mode': '',
  'User-entered Technique': '',
  'Treatment Technology': '',
  'User-entered Treatment Technology': '',
  'Potential Effects': '',
  'User-entered Potential Effects': '',
  Severity: null,
  'User-entered Severity': null,
  'Potential Causes': '',
  'User-entered Potential Causes': '',
  'Mitigation Strategies': '',
  'User-entered Mitigation Strategies': '',
  Comments: '',
  'Software Solution': '',
});

const clearTechs = () => {
  hasTechniques.value = false;
  hasTechnologies.value = false;
  hasSubTechniques.value = false;
  techniqueSelected.value = false;
  techniqueInputShown.value = false;
  subtechniqueInputShown.value = false;
  technologyInputShown.value = false;
  technologySelected.value = false;

  form.technique = '';
  form.subtechnique = '';
  form.subtechniqueInput = '';
  form.techniqueInput = '';
  form.technologyInput = '';
  form.technology = '';
};

const main = {
  title: 'Edit Failure Modes Collected from Users',
  primaryDivider: 'The bold field(s) has already been edited before',
  secondaryDivider: 'Optional Fields',
  thirdDivider: 'Any Further Thoughts?',
  primaryButton: 'Submit',
  secondaryButton: 'Save for Later',
  thirdButton: 'Delete',
  lastButton: 'Clear',
};

const breadcrumb = {
  home: {
    title: 'Back to Edit Failure Mode',
    pathname: 'new-fms',
  },
  current: {
    title: 'User-entered Failure Mode',
  },
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
  failureMode: [{ required: true, message: 'Please enter the failure mode', trigger: 'blur' }],
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

const id = router.currentRoute.value.params.id;
const deleteFmDialogVisible = ref(false);

const messages = {
  submit_success: 'Submit successfully!',
  save_success: 'Save successfully!',
  err: 'Something went wrong... Please try it later',
};

onMounted(() => {
  screenWidth.value = document.body.clientWidth;
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };

  getUserFmLog();
});

const subprocessIsUpdated = ref(false);
const stepIsUpdated = ref(false);
const failureModeIsUpdated = ref(false);
const techniqueIsUpdated = ref(false);
const techniqueInputIsUpdated = ref(false);
const subtechniqueIsUpdated = ref(false);
const subtechniqueInputIsUpdated = ref(false);
const technologyIsUpdated = ref(false);
const technologyInputIsUpdated = ref(false);
const effectIsUpdated = ref(false);
const subeffectIsUpdated = ref(false);
const effectInputIsUpdated = ref(false);
const severityIsUpdated = ref(false);
const severityInputIsUpdated = ref(false);
const causeIsUpdated = ref(false);
const subcauseIsUpdated = ref(false);
const causeInputIsUpdated = ref(false);
const mitigationIsUpdated = ref(false);
const submitigationIsUpdated = ref(false);
const mitigationInputIsUpdated = ref(false);
const solutionIsUpdated = ref(false);
const commentsIsUpdated = ref(false);

let logCreatedData = ref();
let logUpdatedData = ref();
let fmData = ref();
const originalUserFmIsUpdated = ref(false);

const getUserFmLog = () => {
  authorization()
    .then((resolve) => {
      hasLogin.value = resolve[0];
      username.value = resolve[1];
      let routeUsername = router.currentRoute.value.params.username;
      const token = storage.getItem('access.isart');

      if (routeUsername == username.value && hasLogin.value && username.value !== null) {
        axios
          .get(`/api/user-fm/${id}/log_created/`, {
            // Authentication
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
          })
          .then((response) => {
            logCreatedData.value = response.data;
            getOriginalUserFm();
          })
          .catch((err) => console.log(err));

        axios
          .get(`/api/user-fm/${id}/log_updated/`, {
            // Authentication
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
          })
          .then((response) => {
            logUpdatedData.value = response.data;

            axios
              .get(`/api/user-fm/`, {
                params: {
                  id: id,
                },
                // Authentication
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: 'Bearer ' + token,
                },
              })
              .then((response) => {
                fmData.value = response.data[0];
                getUpdatedUserFm();
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } else {
        router.push({ name: 'admin-landing' });
      }
    })
    .catch((err) => console.log(err));
};

const getOriginalUserFm = () => {
  const subprocess_id = logCreatedData.value['subprocess_id'][1];
  userFm.Subprocess = PROCESS_STEPS[subprocess_id - 1][0].label;

  const step_id = logCreatedData.value['step_id'][1];
  userFm.Step = PROCESS_STEPS[subprocess_id - 1][0].children[step_id - 1].label;

  const process_id = subprocess_id + '-' + step_id;

  userFm['Failure Mode'] = logCreatedData.value['failure_mode'][1];

  const { technique, subtechnique, techniqueInput, subtechniqueInput } = JSON.parse(logCreatedData.value['process_type'][1]);
  if (!techniqueInput) {
    userFm.Technique = technique;
  } else {
    userFm['User-entered Technique'] = techniqueInput;
  }

  SUBTECHNIQUES.forEach((item) => {
    if (item.process_id === process_id) {
      if (subtechnique) {
        userFm[`${item.name}`] = subtechnique;
      } else if (subtechniqueInput) {
        userFm[`User-entered ${item.name}`] = subtechniqueInput;
      }
    }
  });

  const { technology, technologyInput } = JSON.parse(logCreatedData.value['technology'][1]);
  if (!technologyInput) {
    userFm['Treatment Technology'] = technology;
  } else {
    userFm['User-entered Treatment Technology'] = technologyInput;
  }

  const { effect, effectInput, subeffect, severity } = JSON.parse(logCreatedData.value['potential_effect'][1]);
  if (subeffect) {
    userFm['Potential Effects'] = effect ? `${effect}<span class="text-gray-500 pl-2">[${subeffect}]</span>` : subeffect;

    userFm['Severity'] = severity;
  } else if (effectInput) {
    userFm['User-entered Potential Effects'] = effectInput;
    const severityInput = logCreatedData.value['severity'][1];
    userFm['User-entered Severity'] = severityInput;
  }

  const { cause, subcause, causeInput } = JSON.parse(logCreatedData.value['potential_causes'][1]);
  if (cause) {
    userFm['Potential Causes'] = `${cause}<span class="text-gray-500 pl-2">[${subcause}]</span>`;
  } else if (causeInput) {
    userFm['User-entered Potential Causes'] = causeInput;
  }

  const { mitigation, submitigation, mitigationInput } = JSON.parse(logCreatedData.value['mitigation_strategy'][1]);
  if (mitigation) {
    userFm['Mitigation Strategies'] = `${mitigation}<span class="text-gray-500 pl-2">[${submitigation}]</span>`;
  } else if (mitigationInput) {
    userFm['User-entered Mitigation Strategies'] = mitigationInput;
  }

  if (logCreatedData.value['software solution']) {
    userFm['Software Solution'] = logCreatedData.value['software_solution'][1];
  }

  if (logCreatedData.value['comments']) {
    userFm['Comments'] = logCreatedData.value['comments'][1];
  }
};

const getUpdatedUserFm = () => {
  if (!logUpdatedData.value['id']) originalUserFmIsUpdated.value = true;

  // Subprocess
  if (logUpdatedData.value['subprocess_id']) {
    // created or updated
    const [prev_subprocess_id, subprocess_id] = logUpdatedData.value['subprocess_id'];
    mapSubprocess(prev_subprocess_id, subprocess_id);
  } else {
    // no update
    const subprocess_id = fmData.value.subprocess_id;
    mapSubprocess('None', subprocess_id);
  }

  // Step
  if (logUpdatedData.value['step_id']) {
    const [prev_step_id, step_id] = logUpdatedData.value['step_id'];
    mapStep(prev_step_id, step_id);
  } else {
    const step_id = fmData.value.step_id;
    mapStep('None', step_id);
  }

  // Process id
  const process_id = (params.process_id = subprocessId.value + '-' + stepId.value);

  // Techniques
  if (logUpdatedData.value['process_type']) {
    const [prevTechniqueObj, techniqueObj] = logUpdatedData.value['process_type'];
    mapTechnique(prevTechniqueObj, techniqueObj, process_id);
  } else {
    const techniqueObj = fmData.value['process_type'];
    mapTechnique('None', techniqueObj, process_id);
  }

  // Technologies
  if (logUpdatedData.value['technology']) {
    const [prevTechnologyObj, technologyObj] = logUpdatedData.value['technology'];
    mapTechnology(prevTechnologyObj, technologyObj);
  } else {
    const technologyObj = fmData.value['technology'];
    mapTechnology('None', technologyObj);
  }

  // Failure Mode
  if (logUpdatedData.value['failure_mode']) {
    const [prevFailureMode, failureMode] = logUpdatedData.value['failure_mode'];
    form.failureMode = params.failure_mode = failureMode;
    if (prevFailureMode !== 'None') failureModeIsUpdated.value = true;
  } else {
    const failureMode = fmData.value.failure_mode;
    form.failureMode = params.failure_mode = failureMode;
  }

  // Potential Effects
  if (logUpdatedData.value['potential_effect']) {
    const [prevEffectObj, effectObj] = logUpdatedData.value['potential_effect'];
    mapEffect(prevEffectObj, effectObj);
  } else {
    const effectObj = fmData.value.potential_effect;
    mapEffect('None', effectObj);
  }

  // Potential Causes
  if (logUpdatedData.value['potential_causes']) {
    const [prevCauseObj, causeObj] = logUpdatedData.value['potential_causes'];
    mapCause(prevCauseObj, causeObj);
  } else {
    const causeObj = fmData.value.potential_causes;
    mapCause('None', causeObj);
  }

  // Mitigation Strategy
  if (logUpdatedData.value['mitigation_strategy']) {
    const [prevMitigationObj, mitigationObj] = logUpdatedData.value['mitigation_strategy'];
    mapMitigation(prevMitigationObj, mitigationObj);
  } else {
    const mitigationObj = fmData.value.mitigation_strategy;
    mapMitigation('None', mitigationObj);
  }

  // Comments
  if (logUpdatedData.value['comments']) {
    const [prevComments, comments] = logUpdatedData.value['comments'];
    mapComments(prevComments, comments);
  } else {
    const comments = fmData.value.comments;
    mapComments('None', comments);
  }

  // Software Solution
  if (logUpdatedData.value['software_solution']) {
    const [prevSolution, solution] = logUpdatedData.value['software_solution'];
    mapSoftwareSolution(prevSolution, solution);
  } else {
    const solution = fmData.value.software_solution;
    mapSoftwareSolution('None', solution);
  }
};

const mapSubprocess = (prev_subprocess_id, subprocess_id) => {
  form.subprocess = params.subprocess_id = subprocessId.value = parseInt(subprocess_id);
  subprocessSelected.value = true;
  if (prev_subprocess_id !== 'None') subprocessIsUpdated.value = true;
};

const mapStep = (prev_step_id, step_id) => {
  form.step = params.step_id = stepId.value = parseInt(step_id);
  stepSelected.value = true;
  if (prev_step_id !== 'None') stepIsUpdated.value = true;
};

const mapTechnique = (prevTechniqueObj, techniqueObj, process_id) => {
  let prevTechnique = null;
  let prevSubtechnique = null;
  let prevTechniqueInput = null;
  let prevSubtechniqueInput = null;
  let hasLatestUpdate = false;
  if (prevTechniqueObj !== 'None') {
    hasLatestUpdate = true;
    prevTechnique = JSON.parse(prevTechniqueObj).technique;
    prevSubtechnique = JSON.parse(prevTechniqueObj).subtechnique;
    prevTechniqueInput = JSON.parse(prevTechniqueObj).techniqueInput;
    prevSubtechniqueInput = JSON.parse(prevTechniqueObj).subtechniqueInput;
  }

  if (techniqueObj !== undefined) {
    const { technique, subtechnique, techniqueInput, subtechniqueInput } = JSON.parse(techniqueObj);
    if (technique || techniqueInput) {
      checkTechniques();
    }

    if (!techniqueInput) {
      params.process_type.technique = technique;
      techniqueSelected.value = true;
      if (originalUserFmIsUpdated.value && hasLatestUpdate && prevTechnique !== technique) techniqueIsUpdated.value = true;

      for (let i = 0; i < techniques.value.length; i++) {
        if (techniques.value[i] === technique) {
          form.technique = i;
        }
      }
    } else if (techniqueInput) {
      techniqueInputShown.value = true;
      techniqueSelected.value = true;
      params.process_type.techniqueInput = form.techniqueInput = techniqueInput;
      if (originalUserFmIsUpdated.value && hasLatestUpdate && prevTechniqueInput !== techniqueInput) techniqueInputIsUpdated.value = true;

      for (let i = 0; i < techniques.value.length; i++) {
        if (techniques.value[i] === NOT_FOUND_OPTION) {
          form.technique = i;
        }
      }
    }

    // SubTechniques
    SUBTECHNIQUES.forEach((item) => {
      if (item.process_id === process_id) {
        fmForm.subTechniqueField.title = item.name;
        if (subtechnique) {
          params.process_type.subtechnique = subtechnique;
          hasSubTechniques.value = true;
          if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSubtechnique !== subtechnique) subtechniqueIsUpdated.value = true;

          for (let i = 0; i < subtechniques.value.length; i++) {
            if (subtechniques.value[i] === subtechnique) {
              form.subtechnique = i;
            }
          }
        } else if (subtechniqueInput) {
          subtechniqueInputShown.value = true;
          hasSubTechniques.value = true;
          params.process_type.subtechniqueInput = form.subtechniqueInput = subtechniqueInput;
          if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSubtechniqueInput !== subtechniqueInput)
            subtechniqueInputIsUpdated.value = true;
        }
      }
    });
  }
};

const mapTechnology = (prevTechnologyObj, technologyObj) => {
  let prevTechnology = null;
  let prevTechnologyInput = null;
  let hasLatestUpdate = false;
  if (prevTechnologyObj !== 'None') {
    hasLatestUpdate = true;
    prevTechnology = JSON.parse(prevTechnologyObj).technology;
    prevTechnologyInput = JSON.parse(prevTechnologyObj).technologyInput;
  }

  if (technologyObj !== undefined) {
    const { technology, technologyInput } = JSON.parse(technologyObj);
    if (technology || technologyInput) {
      checkTechnologies();
    }

    if (!technologyInput) {
      params.technology.technology = technology;
      technologySelected.value = true;
      if (originalUserFmIsUpdated.value && hasLatestUpdate && prevTechnology !== technology) technologyIsUpdated.value = true;

      for (let i = 0; i < technologies.value.length; i++) {
        if (technologies.value[i] === technology) {
          form.technology = i;
        }
      }
    } else if (technologyInput) {
      technologyInputShown.value = true;
      technologySelected.value = true;
      params.technology.technologyInput = form.technologyInput = technologyInput;
      if (originalUserFmIsUpdated.value && hasLatestUpdate && prevTechnologyInput !== technologyInput) technologyInputIsUpdated.value = true;

      for (let i = 0; i < technologies.value.length; i++) {
        if (technologies.value[i] === NOT_FOUND_OPTION) {
          form.technology = i;
        }
      }
    }
  }
};

const mapEffect = (prevEffectObj, effectObj) => {
  let prevEffect = null;
  let prevSubeffect = null;
  let prevEffectInput = null;
  let prevSeverity = null;
  let prevSeverityInput = null;
  let hasLatestUpdate = false;
  if (prevEffectObj !== 'None') {
    hasLatestUpdate = true;
    prevEffect = JSON.parse(prevEffectObj).effect;
    prevSubeffect = JSON.parse(prevEffectObj).subeffect;
    prevEffectInput = JSON.parse(prevEffectObj).effectInput;
    prevSeverity = JSON.parse(prevEffectObj).severity;
    prevSeverityInput = JSON.parse(prevEffectObj).severityInput;
  }

  const { effect, subeffect, effectInput, severityInput } = JSON.parse(effectObj);
  const severityVal = JSON.parse(effectObj).severity;
  if (!subeffect && !effectInput) {
    for (let i = 0; i < POTENTIAL_EFFECTS.length; i++) {
      if (POTENTIAL_EFFECTS[i].effect.length === 0) {
        for (let j = 0; j < POTENTIAL_EFFECTS[i].group.length; j++) {
          if (POTENTIAL_EFFECTS[i].group[j].subeffect === SKIP_OPTION) {
            if (originalUserFmIsUpdated.value && hasLatestUpdate && prevEffect !== effect) effectIsUpdated.value = true;
            form.effect = i + '-' + j;
            effectSkip.value = true;
          }
        }
      }
    }
  } else if (subeffect) {
    form.severity = params.potential_effect.severity = params.severity = severityVal;
    effectSelected.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevEffect !== effect) effectIsUpdated.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSubeffect !== subeffect) subeffectIsUpdated.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSeverity !== severityVal) severityIsUpdated.value = true;

    for (let i = 0; i < POTENTIAL_EFFECTS.length; i++) {
      if (effect === POTENTIAL_EFFECTS[i].effect || !effect) {
        for (let j = 0; j < POTENTIAL_EFFECTS[i].group.length; j++) {
          if (subeffect === POTENTIAL_EFFECTS[i].group[j].subeffect) {
            form.effect = i + '-' + j;
            severity.value = POTENTIAL_EFFECTS[i].group[j].severity;
          }
        }
      }
    }
  } else if (effectInput) {
    params.potential_effect.effectInput = form.effectInput = effectInput;
    params.potential_effect.severityInput = params.severity = form.severityInput = severityInput;
    effectInputShown.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevEffectInput !== effectInput) effectInputIsUpdated.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSeverityInput !== severityInput) severityInputIsUpdated.value = true;

    for (let i = 0; i < POTENTIAL_EFFECTS.length; i++) {
      if (POTENTIAL_EFFECTS[i].effect.length === 0) {
        for (let j = 0; j < POTENTIAL_EFFECTS[i].group.length; j++) {
          if (POTENTIAL_EFFECTS[i].group[j].subeffect === NOT_FOUND_OPTION) {
            form.effect = i + '-' + j;
          }
        }
      }
    }
  }
};

const mapCause = (prevCauseObj, causeObj) => {
  let prevCause = null;
  let prevCauseInput = null;
  let prevSubcause = null;
  let hasLatestUpdate = false;
  if (prevCauseObj !== 'None') {
    hasLatestUpdate = true;
    prevCause = JSON.parse(prevCauseObj).cause;
    prevCauseInput = JSON.parse(prevCauseObj).causeInput;
    prevSubcause = JSON.parse(prevCauseObj).subcause;
  }

  const { cause, causeInput, subcause } = JSON.parse(causeObj);
  if (!cause && !causeInput) {
    for (let i = 0; i < POTENTIAL_CAUSES.length; i++) {
      if (POTENTIAL_CAUSES[i].cause === SKIP_OPTION) {
        if (originalUserFmIsUpdated.value && hasLatestUpdate && prevCause !== cause) causeIsUpdated.value = true;
        form.cause = i;
        causeSkip.value = true;
      }
    }
  } else if (cause) {
    params.potential_causes.cause = cause;
    params.potential_causes.subcause = subcause;
    causeSelected.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevCause !== cause) causeIsUpdated.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSubcause !== subcause) subcauseIsUpdated.value = true;

    for (let i = 0; i < POTENTIAL_CAUSES.length; i++) {
      if (cause === POTENTIAL_CAUSES[i].cause) {
        form.cause = causeIndex.value = i;

        for (let j = 0; j < POTENTIAL_CAUSES[i].subcauses.length; j++) {
          if (subcause === POTENTIAL_CAUSES[i].subcauses[j]) {
            form.subcause = POTENTIAL_CAUSES[i].subcauses[j];
          }
        }
      }
    }
  } else if (causeInput) {
    params.potential_causes.causeInput = form.causeInput = causeInput;
    causeInputShown.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevCauseInput !== causeInput) causeInputIsUpdated.value = true;

    for (let i = 0; i < POTENTIAL_CAUSES.length; i++) {
      if (POTENTIAL_CAUSES[i].cause === NOT_FOUND_OPTION) {
        form.cause = i;
      }
    }
  }
};

const mapMitigation = (prevMitigationObj, mitigationObj) => {
  let prevMitigation = null;
  let prevSubmitigation = null;
  let prevMitigationInput = null;
  let hasLatestUpdate = false;
  if (prevMitigationObj !== 'None') {
    hasLatestUpdate = true;
    prevMitigation = JSON.parse(prevMitigationObj).mitigation;
    prevSubmitigation = JSON.parse(prevMitigationObj).submitigation;
    prevMitigationInput = JSON.parse(prevMitigationObj).mitigationInput;
  }

  const { mitigation, submitigation, mitigationInput } = JSON.parse(mitigationObj);

  if (!mitigation && !mitigationInput) {
    for (let i = 0; i < MITIGATION_STRATEGIES.length; i++) {
      if (MITIGATION_STRATEGIES[i].mitigation === SKIP_OPTION) {
        if (originalUserFmIsUpdated.value && hasLatestUpdate && prevMitigation !== mitigation) mitigationIsUpdated.value = true;
        form.mitigation = i;
        mitigationSkip.value = true;
      }
    }
  } else if (mitigation) {
    params.mitigation_strategy.mitigation = mitigation;
    params.mitigation_strategy.submitigation = submitigation;
    mitigationSelected.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevMitigation !== mitigation) mitigationIsUpdated.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevSubmitigation !== submitigation) submitigationIsUpdated.value = true;

    for (let i = 0; i < MITIGATION_STRATEGIES.length; i++) {
      if (mitigation === MITIGATION_STRATEGIES[i].mitigation) {
        form.mitigation = mitigationIndex.value = i;

        for (let j = 0; j < MITIGATION_STRATEGIES[i].submitigations.length; j++) {
          if (submitigation === MITIGATION_STRATEGIES[i].submitigations[j]) {
            form.submitigation = MITIGATION_STRATEGIES[i].submitigations[j];
          }
        }
      }
    }
  } else if (mitigationInput) {
    params.mitigation_strategy.mitigationInput = form.mitigationInput = mitigationInput;
    mitigationInputShown.value = true;
    if (originalUserFmIsUpdated.value && hasLatestUpdate && prevMitigationInput !== mitigationInput) mitigationInputIsUpdated.value = true;

    for (let i = 0; i < MITIGATION_STRATEGIES.length; i++) {
      if (MITIGATION_STRATEGIES[i].mitigation === NOT_FOUND_OPTION) {
        form.mitigation = i;
      }
    }
  }
};

const mapSoftwareSolution = (prevSolution, solution) => {
  form.softwareSolution = solution ? solution : '';
  params.software_solution = solution;
  if (prevSolution !== 'None') solutionIsUpdated.value = true;
};

const mapComments = (prevComments, comments) => {
  form.comments = comments ? comments : '';
  params.comments = comments;
  if (prevComments !== 'None') commentsIsUpdated.value = true;
};

const selectSubprocess = (subprocess) => {
  subprocessSelected.value = true;
  subprocessId.value = subprocess;
  stepSelected.value = false;
  params.subprocess_id = subprocess;
  form.step = '';
  clearTechs();
};

const selectStep = (step) => {
  stepSelected.value = true;
  stepId.value = step;
  params.step_id = step;
  params.process_id = subprocessId.value + '-' + step;
  clearTechs();

  checkTechniques();
  checkTechnologies();
};

const checkTechniques = () => {
  TECHNIQUES.forEach((item) => {
    if (item.subprocessId === subprocessId.value) {
      hasTechniques.value = true;
      techniques.value = item.techniques;
      if (item.subtechniques != undefined) {
        item.subtechniques.forEach((elem) => {
          if (elem.stepIds.indexOf(stepId.value) !== -1) {
            subtechniques.value = elem.techniques;
            hasSubTechniques.value = true;

            SUBTECHNIQUES.forEach((item) => {
              if (item.process_id === params.process_id) {
                fmForm.subTechniqueField.title = item.name;
                userFm[`User-entered ${item.name}`] = '';
                userFm[`${item.name}`] = '';
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
    causeSkip.value = true;
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
  const subtechnique = subtechniques.value[subtechniqueIndex];
  if (subtechnique === NOT_FOUND_OPTION) {
    SUBTECHNIQUES.forEach((item) => {
      if (item.process_id === params.process_id) {
        fmForm.subTechniqueField.title = item.name;
      }
    });

    subtechniqueInputShown.value = true;
  } else {
    subtechniqueInputShown.value = false;

    params.process_type.subtechnique = subtechnique;
  }
};

const selectTechnology = (technologyIndex) => {
  technologySelected.value = true;
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

  params.failure_mode = form.failureMode.trim();
};

const getFmParams = () => {
  getInputs();

  fmParams.subprocess_id = params.subprocess_id;
  fmParams.step_id = params.step_id;
  fmParams.process_id = params.process_id;
  mapSeverity();
  fmParams.severity = params.severity;
  fmParams.failure_mode = params.failure_mode;

  if (params.process_type) {
    let techList = [];
    Object.values(params.process_type).forEach((value) => {
      if (value) techList.push(value);
    });

    fmParams.process_type = techList;
    fmParams.process_type = JSON.stringify(fmParams.process_type);
  }

  if (params.potential_effect) {
    if (params.potential_effect.subeffect) {
      fmParams.potential_effect = params.potential_effect.effect
        ? params.potential_effect.effect + ': ' + params.potential_effect.subeffect
        : params.potential_effect.subeffect;
    } else if (params.potential_effect.effectInput) {
      fmParams.potential_effect = params.potential_effect.effectInput;
    }
  }

  if (params.potential_causes) {
    if (params.potential_causes.cause) {
      fmParams.potential_causes = params.potential_causes.cause + ': ' + params.potential_causes.subcause;
    } else if (params.potential_causes.causeInput) {
      fmParams.potential_causes = params.potential_causes.causeInput;
    }
  }

  if (params.mitigation_strategy) {
    if (params.mitigation_strategy.mitigation) {
      fmParams.mitigation_strategy = params.mitigation_strategy.mitigation + ': ' + params.mitigation_strategy.submitigation;
    } else if (params.mitigation_strategy.mitigationInput) {
      fmParams.mitigation_strategy = params.mitigation_strategy.mitigationInput;
    }
  }
};

const stringifyParams = () => {
  const paramsList = ['mitigation_strategy', 'potential_causes', 'potential_effect', 'process_type', 'technology'];
  for (const param of paramsList) {
    params[param] = JSON.stringify(params[param]);
  }
};

const mapSeverity = () => {
  if (params.severity) {
    if (params.severity < 4) {
      params.severity = 1;
    } else if (params.severity < 7) {
      params.severity = 2;
    } else if (params.severity < 9) {
      params.severity = 3;
    } else {
      params.severity = 4;
    }
  }
};

const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      getFmParams();
      stringifyParams();

      authorization()
        .then((resolve) => {
          hasLogin.value = resolve[0];
          username.value = resolve[1];
          let routeUsername = router.currentRoute.value.params.username;
          const token = storage.getItem('access.isart');

          if (routeUsername == username.value && hasLogin.value && username.value !== null) {
            axios
              .post('/api/fm/', fmParams, {
                // Authentication
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              })
              .then((response) => {
                // Submit successfully
                if (response.status === 201) {
                  params.published = true;
                  axios
                    .put('/api/user-fm/' + id + '/', params, {
                      // Authentication
                      headers: {
                        Authorization: 'Bearer ' + token,
                      },
                    })
                    .then((response) => {
                      // Submit successfully
                      if (response.status === 200) {
                        ElMessage({
                          showClose: true,
                          message: messages.submit_success,
                          type: 'success',
                        });
                      } else {
                        ElMessage({
                          showClose: true,
                          message: messages.err,
                          type: 'error',
                        });
                      }
                    })
                    .catch((err) => {
                      ElMessage({
                        showClose: true,
                        message: err.response.data,
                        type: 'error',
                      });
                    });
                } else {
                  ElMessage({
                    showClose: true,
                    message: messages.err,
                    type: 'error',
                  });
                }
                router.push({ name: 'new-fms' });
              })
              .catch((err) => {
                ElMessage({
                  showClose: true,
                  message: err.response.data,
                  type: 'error',
                });
                router.push({ name: 'new-fms' });
              });
          } else {
            router.push({ name: 'admin-landing' });
          }
        })
        .catch((err) => console.log(err));

      formEl.resetFields();
    }
  });
};

const onSave = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      getInputs();
      stringifyParams();

      authorization()
        .then((resolve) => {
          hasLogin.value = resolve[0];
          username.value = resolve[1];
          let routeUsername = router.currentRoute.value.params.username;
          const token = storage.getItem('access.isart');

          if (routeUsername == username.value && hasLogin.value && username.value !== null) {
            axios
              .put('/api/user-fm/' + id + '/', params, {
                // Authentication
                headers: { Authorization: 'Bearer ' + token },
              })
              .then((response) => {
                // Save successfully
                if (response.status === 200) {
                  ElMessage({
                    showClose: true,
                    message: messages.save_success,
                    type: 'success',
                  });
                } else {
                  ElMessage({
                    showClose: true,
                    message: messages.err,
                    type: 'error',
                  });
                }
              })
              .catch((err) => {
                ElMessage({
                  showClose: true,
                  message: err.response.data,
                  type: 'error',
                });
              });

            router.push({ name: 'new-fms' });
          } else {
            router.push({ name: 'admin-landing' });
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
