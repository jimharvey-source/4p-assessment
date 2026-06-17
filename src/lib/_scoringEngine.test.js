// Sanity check the scoring engine against the worked example
// from Four_Ps_Team_Diagnostic_v1.docx Part Three.
//
// Spec worked example:
//   Purpose: Vision 75, Goals 42, Measures 67. P=61.
//   Plan:    Process 50, Roles 75, Authority 33. P=53.
//   People:  Standards 75, Trust 67, Feedback 50. P=64.
//   Pride:   Proactivity 42, Energy 33, Recognition 58. P=44.
//
//   Pride (44) is the only P below 50, so Rule 2 applies: Pride is priority.
//   Within Pride, Energy (33) is the lowest driver -> priority_driver = '4.2'.

import { scoreResponses } from './scoringEngine.js';

// We need to back-fit answers that produce those element scores.
// Element score = mean of 3 items where each is in {0, 25, 50, 75, 100}.
// To get 75: three responses of 4 (75 each) -> mean 75 ✓
// To get 42: roughly two 3s and one 4 -> (50+50+25)=125/3=41.67 -> rounds to 42 ✓
// To get 67: two 4s and one 3 -> (75+75+50)=200/3=66.67 -> rounds to 67 ✓
// To get 50: three 3s -> 50 ✓
// To get 33: two 2s and one 3 -> (25+25+50)=100/3=33.33 -> rounds to 33 ✓
// To get 58: one 4, one 3, one 3 -> (75+50+50)=175/3=58.33 -> rounds to 58 ✓

const answers = {
  // Vision (1.1) -> 75
  '1.1.a': 4, '1.1.b': 4, '1.1.c': 4,
  // Goals (1.2) -> 42
  '1.2.a': 3, '1.2.b': 3, '1.2.c': 2,
  // Measures (1.3) -> 67
  '1.3.a': 4, '1.3.b': 4, '1.3.c': 3,
  // Process (2.1) -> 50
  '2.1.a': 3, '2.1.b': 3, '2.1.c': 3,
  // Roles (2.2) -> 75
  '2.2.a': 4, '2.2.b': 4, '2.2.c': 4,
  // Authority (2.3) -> 33
  '2.3.a': 2, '2.3.b': 2, '2.3.c': 3,
  // Standards (3.1) -> 75
  '3.1.a': 4, '3.1.b': 4, '3.1.c': 4,
  // Trust (3.2) -> 67
  '3.2.a': 4, '3.2.b': 4, '3.2.c': 3,
  // Feedback (3.3) -> 50
  '3.3.a': 3, '3.3.b': 3, '3.3.c': 3,
  // Proactivity (4.1) -> 42
  '4.1.a': 3, '4.1.b': 3, '4.1.c': 2,
  // Energy (4.2) -> 33
  '4.2.a': 2, '4.2.b': 2, '4.2.c': 3,
  // Recognition (4.3) -> 58
  '4.3.a': 4, '4.3.b': 3, '4.3.c': 3,
};

const result = scoreResponses(answers);

console.log('--- ELEMENT SCORES ---');
console.log('Vision:       ', result.elementScores['1.1'], '(spec: 75)');
console.log('Goals:        ', result.elementScores['1.2'], '(spec: 42)');
console.log('Measures:     ', result.elementScores['1.3'], '(spec: 67)');
console.log('Process:      ', result.elementScores['2.1'], '(spec: 50)');
console.log('Roles:        ', result.elementScores['2.2'], '(spec: 75)');
console.log('Authority:    ', result.elementScores['2.3'], '(spec: 33)');
console.log('Standards:    ', result.elementScores['3.1'], '(spec: 75)');
console.log('Trust:        ', result.elementScores['3.2'], '(spec: 67)');
console.log('Feedback:     ', result.elementScores['3.3'], '(spec: 50)');
console.log('Proactivity:  ', result.elementScores['4.1'], '(spec: 42)');
console.log('Energy:       ', result.elementScores['4.2'], '(spec: 33)');
console.log('Recognition:  ', result.elementScores['4.3'], '(spec: 58)');

console.log('\n--- P SCORES ---');
console.log('Purpose: ', result.pScores.purpose, '(spec: 61)');
console.log('Plan:    ', result.pScores.plan,    '(spec: 53)');
console.log('People:  ', result.pScores.people,  '(spec: 64)');
console.log('Pride:   ', result.pScores.pride,   '(spec: 44)');

console.log('\n--- BANDS ---');
console.log('Purpose:', result.bands.purpose);
console.log('Plan:   ', result.bands.plan);
console.log('People: ', result.bands.people);
console.log('Pride:  ', result.bands.pride);

console.log('\n--- PRIORITY ---');
console.log('priority_p:      ', result.priority_p,      '(spec: pride)');
console.log('priority_rule:   ', result.priority_rule,   '(spec: first_weak_in_stack)');
console.log('priority_driver: ', result.priority_driver, '(spec: 4.2)');

// ASSERTIONS
const checks = [
  ['Vision',      result.elementScores['1.1'], 75],
  ['Goals',       result.elementScores['1.2'], 42],
  ['Measures',    result.elementScores['1.3'], 67],
  ['Process',     result.elementScores['2.1'], 50],
  ['Roles',       result.elementScores['2.2'], 75],
  ['Authority',   result.elementScores['2.3'], 33],
  ['Standards',   result.elementScores['3.1'], 75],
  ['Trust',       result.elementScores['3.2'], 67],
  ['Feedback',    result.elementScores['3.3'], 50],
  ['Proactivity', result.elementScores['4.1'], 42],
  ['Energy',      result.elementScores['4.2'], 33],
  ['Recognition', result.elementScores['4.3'], 58],
  ['P:purpose',   result.pScores.purpose,      61],
  ['P:plan',      result.pScores.plan,         53],
  ['P:people',    result.pScores.people,       64],
  ['P:pride',     result.pScores.pride,        44],
  ['priority_p',      result.priority_p,      'pride'],
  ['priority_rule',   result.priority_rule,   'first_weak_in_stack'],
  ['priority_driver', result.priority_driver, '4.2'],
];

let allPass = true;
for (const [name, got, expected] of checks) {
  const pass = got === expected;
  if (!pass) {
    allPass = false;
    console.log(`FAIL: ${name} got ${got} expected ${expected}`);
  }
}
if (allPass) console.log('\n✅ ALL CHECKS PASS — scoring engine matches the spec worked example.');
else         console.log('\n❌ SOME CHECKS FAILED — fix before proceeding.');
