const PROCESS = [
  [
    {
      phase: '1',
      title: 'Patient assessment',
    },
    {
      phase: '2',
      title: 'Patient creation',
    },
    {
      phase: '3',
      title: 'Scheduling/Booking',
    },

    {
      phase: '4',
      title: 'Simulation/Imaging',
    },
    {
      phase: '5',
      title: 'Transfer images',
    },
  ],
  [
    {
      phase: '6',
      title: 'Treatment planning',
    },
    {
      phase: '7',
      title: 'Pretreatment procedures',
    },

    {
      phase: '8',
      title: 'Treatment',
    },
    {
      phase: '9',
      title: 'On-treatment procedures',
    },
    {
      phase: '10',
      title: 'Posttreatment procedures',
    },
  ],
];

const PROCESS_STEPS = [
  [
    {
      label: '1. Patient Assessment / Initial Consultation',
      children: [
        { label: '1.1 Patient identification' },
        { label: '1.2 Review medical records including pathology report/staging, imaging' },
        { label: '1.3 Physical exam' },
        { label: '1.4 Evaluation of previous radiotherapy treatments' },
        { label: '1.5 Evaluation of patient medical conditions / concomitant diseases (comorbidities)' },
        { label: '1.6 Decision to treat' },
        { label: "1.7 Radiation Oncologist's report / Selection of clinical protocol" },
        { label: '1.8 Additional exams / prescribe medication' },
        { label: '1.9 Informed consent' },
        { label: '1.10 Patient education' },
        { label: '1.11 Insurance evaluation' },
        { label: '1.12 Software related items' },
        { label: '1.13 Other' },
      ],
    },
  ],
  [
    {
      label: '2. Patient information entered into radiation oncology information system / written chart',
      children: [{ label: '2.1 Patient ID' }, { label: '2.2 Medical history' }, { label: '2.3 Software related items' }, { label: '2.4 Other' }],
    },
  ],
  [
    {
      label: '3. Scheduling/booking procedures pretreatment, planning, treatment and follow-up',
      children: [
        { label: '3.1 Bookings made according to protocol' },
        { label: '3.2 Bookings made according to request details (including requested changes following initial booking)' },
        { label: '3.3 Recording of booked appointments (including requested changes following initial booking)' },
        { label: '3.4 Communication of appointments to patient (including requested changes following initial booking)' },
        { label: '3.5 Communication of appointment between staff groups (including requested changes following initial booking)' },
        { label: '3.6 Software related items' },
        { label: '3.7 Other' },
      ],
    },
  ],
  [
    {
      label: '4. Imaging for RT planning / CT simulation - Other imaging',
      children: [
        { label: '4.1 Patient identification' },
        { label: '4.2 Documentation prior to scanning' },
        { label: '4.3 Patient preparation' },
        { label: '4.4 Patient position and immobilization' },
        { label: '4.5 Special devices prepared as necessary for motion management' },
        { label: '4.6 Special devices prepared for surface-image guidance' },
        { label: '4.7 Contrast administration' },
        {
          label: '4.8 CT image acquisition',
          children: [{ label: '4.8a CT image acquisition' }, { label: '4.8b PET CT simulation' }],
        },
        { label: '4.9 Marking reference point on patient if needed and /or localization device and in software' },
        { label: '4.10 Documentation after scanning' },
        { label: '4.11 Additional imaging modalities (i.e., MRI, US, PET)' },
        { label: '4.12 Software related items' },
        { label: '4.13 Other' },
      ],
    },
  ],
  [
    {
      label: '5. Transfer images and other Digital Imaging Communication in Medicine (DICOM) data',
      children: [
        { label: '5.1 Transfer of images to treatment planning system' },
        { label: '5.2 Transfer of images to archiving system' },
        { label: '5.3 Software related items' },
        { label: '5.4 Other' },
      ],
    },
  ],
  [
    {
      label: '6. Treatment planning',
      children: [
        { label: '6.1 Create case (define patient in TP database)' },
        { label: '6.2 Import images into TP database' },
        { label: '6.3 Image registration (fusion) of multiple datasets' },
        { label: '6.4 Delineation of target(s) and organs at risk' },
        { label: '6.5 Treatment prescription - treatment parameters specified (site, modality, energy, doses, fractions)' },
        {
          label: '6.6 Treatment plan production: (e.g beam arrangement, dose calculation, dose distribution, dose–volume histograms (DVHs), etc.)',
        },
        { label: '6.7 Evaluate/review treatment plan' },
        { label: '6.8 Final plan and prescription approval by physicist / physician' },
        {
          label: `6.9 Plan preparation (e.g. patient demographics, treatment protocol, prepare imaging /motion management, prepare patient chart, \n
                transfer patient data to treatment delivery, scheduling)`,
        },
        { label: '6.10 Software related items' },
        { label: '6.11 Other' },
      ],
    },
  ],
  [
    {
      label: '7. Pretreatment QA procedures',
      children: [
        { label: '7.1 Daily equipment /device QA' },
        { label: '7.2 Pretreatment patient-specific plan measurement (e.g., IMRT / VMAT QA)' },
        { label: '7.3 Software related items' },
        { label: '7.4 Other' },
      ],
    },
  ],
  [
    {
      label: '8. Treatment',
      children: [
        { label: '8.1 Patient identification ' },
        { label: '8.2 Time-out (e.g., verification of clinical parameters, treatment consent, etc.)' },
        { label: '8.3 Prepare patient for treatment' },
        { label: '8.4 Patient positioning and immobilization' },
        { label: '8.5 Image guidance' },
        { label: '8.6 Utilization of motion management system / surface image guidance' },
        { label: '8.7 In vivo dosimetry' },
        { label: '8.8 Treatment delivery' },
        { label: '8.9 Software related items' },
        { label: '8.10 Other' },
      ],
    },
  ],
  [
    {
      label: '9. On-treatment quality management',
      children: [
        { label: '9.1 Clinical examination (prior 1rst fraction, weekly, end of RT)' },
        { label: '9.2 Review of portal images / localization images (including CBCT)' },
        { label: '9.3 Adaptive replanning' },
        { label: '9.4 Other' },
      ],
    },
  ],
  [
    {
      label: '10. Post treatment procedures & Follow-up',
      children: [
        { label: '10.1 Follow-up consultation and documentation ' },
        { label: '10.2 Archiving of details of treatment' },
        { label: '10.3 Software related items' },
        { label: '10.4 Other' },
      ],
    },
  ],
];

const SEVERITY_LEVELS = [
  // {
  //   value: 0,
  //   emoji: '⚪️',
  //   label: 'Unknown',
  // },
  {
    value: 1,
    emoji: '🟢',
    label: 'Low',
  },
  {
    value: 2,
    emoji: '🟡',
    label: 'Moderate',
  },
  {
    value: 3,
    emoji: '🟠',
    label: 'Severe',
  },
  {
    value: 4,
    emoji: '🔴',
    label: 'Catastrophic',
  },
];

const NOT_FOUND_OPTION = 'Did not find what you are looking for? Type it here';

const SKIP_OPTION = 'Nothing on my mind yet';

const PROCESS_TYPES = ['VMAT, paperless', '3D RT', 'IMRT', 'Lung SABR (SBRT)', 'RT pathway', 'SG DIBH BREAST', 'Vmat breast'];

const POTENTIAL_EFFECTS = [
  {
    effect: '',
    group: [{ subeffect: 'No effect', severity: [1] }],
  },
  {
    effect: '',
    group: [{ subeffect: 'Inconvenience', severity: [2, 3] }],
  },
  {
    effect: 'Suboptimal plan or treatment',
    group: [{ subeffect: 'Minor dosimetric error', severity: [4] }],
  },
  {
    effect: 'Wrong dose, dose distribution, location, or volume',
    group: [
      { subeffect: 'Limited toxicity or tumor underdose', severity: [5, 6] },
      { subeffect: 'Potentially serious toxicity or tumor underdose', severity: [7, 8] },
    ],
  },
  {
    effect: 'Very wrong dose, dose distribution, location, or volume',
    group: [
      { subeffect: 'Possible very serious toxicity or tumor underdose', severity: [9] },
      { subeffect: 'Catastrophic', severity: [10] },
    ],
  },
  {
    effect: '',
    group: [{ subeffect: NOT_FOUND_OPTION }],
  },
  {
    effect: '',
    group: [{ subeffect: SKIP_OPTION }],
  },
];

const POTENTIAL_CAUSES = [
  {
    cause: 'Individual',
    subcauses: [
      'Failure to recognise hazard (knowledge-based etc)',
      'Decision making process (rule-based or old or invalid rule used etc)',
      'Slips and lapses (skill-based, involuntary automaticity etc)',
      'Communication (inaccuracy or omission of verbal, written etc)',
      'Violation (deliberate action, acting outside scope etc)',
    ],
  },
  {
    cause: 'Procedural',
    subcauses: [
      'No procedures / protocols (not in place or unavailable etc)',
      'Inadequate procedures / protocols',
      'Adherence to procedures / protocols',
      'Process design (impractical and inefficient processes etc)',
    ],
  },
  {
    cause: 'Technical',
    subcauses: [
      'Equipment or IT network failure (including immobilisation & accessories)',
      'Commissioning/ calibration/ maintenance (including immobilisation & accessories)',
      'Device / Product design',
    ],
  },
  {
    cause: 'Patient Related',
    subcauses: [
      'Medical condition (inability to remain still etc)',
      'Communication with the patient (language issues, comprehension etc)',
      'Non-compliance',
    ],
  },
  {
    cause: 'Teamwork / Management / Organisational',
    subcauses: [
      'Inadequate leadership (inadequate supervision, congruence or consistency etc)',
      'Unclear responsibilities and lines of accountability (across the radiotherapy pathway)',
      'Inadequate capital resources (equipment in use no longer fit for purpose etc)',
      'Inadequate staffing (insufficient staffing levels or skill mix necessary to meet the demands of a service etc)',
      'Inadequate training (inadequate or lack of training etc)',
      'Inadequate risk assessment (poor change management etc)',
    ],
  },
  {
    cause: 'Environmental',
    subcauses: ['Physical (power cut, control area excessively noisy, distractions etc)', 'Natural factors (fire, flood etc)'],
  },
  {
    cause: 'Other',
    subcauses: ['Other'],
  },
  {
    cause: NOT_FOUND_OPTION,
  },
  {
    cause: SKIP_OPTION,
  },
];

const TECHNOLOGIES = [
  {
    subprocessId: 6,
    technologies: ['Pinacle', 'Monaco', 'Eclipse', 'Accuracy Precision', NOT_FOUND_OPTION],
  },
  {
    subprocessId: 8,
    technologies: [
      'Elekta Precise',
      'Elekta Versa HD',
      'Elekta Harmony',
      'Elekta Infinity',
      'Elekta Synergy',
      'Varian Edge',
      'Varian TrueBeam',
      'Varian VitalBeam',
      'Accuracy CyberKnife S7',
      'Accuracy ToMotherapy',
      'Accuracy Radixact',
      'Accuracy Precision',
      NOT_FOUND_OPTION,
    ],
  },
];

const TECHNIQUES = [
  {
    subprocessId: 6,
    techniques: ['2D RT', '3D CRT', 'Tomotherapy', 'VMAT', 'IMRT', 'SRS / SRT', 'SBRT', 'electrons', NOT_FOUND_OPTION],
  },
  {
    subprocessId: 8,
    techniques: ['2D RT', '3D CRT', 'Tomotherapy', 'VMAT', 'IMRT', 'SRS / SRT', 'SBRT', 'electrons', NOT_FOUND_OPTION],
    subtechniques: [
      {
        stepIds: [5],
        techniques: ['KV', 'MV', 'CBCT', NOT_FOUND_OPTION],
      },
    ],
  },
];

const SUBTECHNIQUES = [{ process_id: '8-5', name: 'Imagining Technique' }];

const MITIGATION_STRATEGIES = [
  {
    mitigation: 'Forcing functions and constraints',
    submitigations: ['Interlock', 'Barriers', 'Computerized order entry with feedback'],
  },
  {
    mitigation: 'Automation and computerization',
    submitigations: ['Bar codes', 'Automated monitoring', 'Computerized verification', 'Computerized order entry'],
  },
  {
    mitigation: 'Protocols, standards, and information',
    submitigations: ['Check-off forms', 'Establishing protocol/clarify protocol', 'Alarms', 'Labels', 'Signs', 'Reduce similarity'],
  },
  {
    mitigation: 'Independent double check systems and other redundancies',
    submitigations: [
      'Redundant measurement',
      'Independent review',
      'Operational checks',
      'Comparison with standards',
      'Increase monitoring',
      'Add status check',
      'Acceptance test',
    ],
  },
  {
    mitigation: 'Rules and policies',
    submitigations: [
      'Priority',
      'Establishing/clarify communication line',
      'Staffing',
      'Better scheduling',
      'Mandatory pauses',
      'Repair',
      'PMI (preventive maintenance inspection)',
      'Establish and perform QC and QA (hardware and software)',
    ],
  },
  {
    mitigation: 'Education and information',
    submitigations: ['Training', 'Experience', 'Instruction'],
  },
  {
    mitigation: NOT_FOUND_OPTION,
  },
  {
    mitigation: SKIP_OPTION,
  },
];

const FAILURE_MODES = [
  {
    process_id: '8-1',
    failureModes: [
      { mode: 'Wrong patient (day 1): treatment data used on the wrong patient' },
      { mode: 'Wrong patient (day N): treatment data used on the wrong patient' },
    ],
    keywords: [
      ['wrong', 'mistaken', 'incorrect', 'lack', 'missed'],
      ['patient', 'identify', 'identification', 'treatment data'],
    ],
  },
  {
    process_id: '8-3',
    keywords: [['fail, lack']],
  },
  {
    process_id: '8-4',
    failureModes: [
      { mode: 'Position patient for treatment: Incorrect patient position (day 1)' },
      {
        mode: 'Patient set up for treatment: Immobilization aids incorrectly used (day N treatment)',
        submodes: [
          'Use of Posirest® inst. of Posiboard®, and vice versa (breast)',
          'Wrong immobilization device: use of a different headrest',
          'Wrong immobilization device: use of a different thermopl. Mask',
          'Wrong arms position on Wing Board®, Posirest®, Posiboard®',
          "No use of patient's aids, described on set-up report, as towels",
          NOT_FOUND_OPTION,
        ],
      },
      {
        mode: 'Patient set up for treatment:  Bolus not applied as prescribed (omitted, wrongly positioned or wrong thickness)(day N treatment)',
        submodes: [
          'Set treatment parameters: Wrong treatment accessories (Missing/incorrect bolus, blocks) (day 1)',
          'Wrong or lack of Bolus positioning',
          "Patient's anatomical changes (e.g. patient thinner, tumour volume decrease/increase) (H&N) (lung) (pelvis) (breast)",
          NOT_FOUND_OPTION,
        ],
      },
      { mode: NOT_FOUND_OPTION },
    ],
    keywords: [
      ['wrong', 'incorrect', 'not applied', 'lack', 'different', 'no use'],
      ['immobilization device', 'immobilization aids', 'treatment accessories'],
    ],
  },
];

export {
  PROCESS_STEPS,
  SEVERITY_LEVELS,
  PROCESS_TYPES,
  PROCESS,
  POTENTIAL_CAUSES,
  POTENTIAL_EFFECTS,
  TECHNOLOGIES,
  TECHNIQUES,
  MITIGATION_STRATEGIES,
  NOT_FOUND_OPTION,
  SKIP_OPTION,
  SUBTECHNIQUES,
  FAILURE_MODES,
};
