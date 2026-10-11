// =====================================================================
// QUESTION BANK
// The Four Ps Team Diagnostic v1.0
// Companion to Competency Framework v1.4
// =====================================================================
//
// This file is the single source of truth for the 40-item diagnostic.
// The scoring engine, the flow pages, and the report renderer all read
// from this structure. Edit here only.
//
// Item codes follow the framework's Option C convention:
//   Driver X.Y produces Element X.Y.
//   The three items per element are coded X.Y.a, X.Y.b, X.Y.c.
//
// Voice rules applied to every item:
//   UK English, no em dashes, no antithesis, no jargon,
//   plain statements about observable team state.
//
// =====================================================================

export const SCALE = {
  min: 1,
  max: 5,
  // Likert -> 0-100 mapping used by the scoring engine.
  // Matches the OSCI Pro scoring spine.
  toScore: { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 },
  anchors: [
    { value: 1, label: 'Almost never true' },
    { value: 2, label: 'Rarely true' },
    { value: 3, label: 'Sometimes true' },
    { value: 4, label: 'Often true' },
    { value: 5, label: 'Almost always true' },
  ],
};

export const BAND_LABELS = [
  { min: 0,  max: 39,  label: 'Not yet present' },
  { min: 40, max: 59,  label: 'Inconsistent' },
  { min: 60, max: 74,  label: 'Broadly present' },
  { min: 75, max: 89,  label: 'Strong' },
  { min: 90, max: 100, label: 'Exemplary' },
];

// =====================================================================
// CONTEXT QUESTIONS (C1-C4)
// =====================================================================

export const CONTEXT_QUESTIONS = [
  {
    code: 'C1',
    field: 'team_size',
    question: 'How many people report directly to you?',
    options: [
      { value: '1-3',   label: '1 to 3' },
      { value: '4-7',   label: '4 to 7' },
      { value: '8-15',  label: '8 to 15' },
      { value: '16+',   label: '16 or more' },
    ],
  },
  {
    code: 'C2',
    field: 'tenure',
    question: 'How long have you been leading this team?',
    options: [
      { value: '<6m',     label: 'Less than 6 months' },
      { value: '6-18m',   label: '6 to 18 months' },
      { value: '18m-3y',  label: '18 months to 3 years' },
      { value: '3y+',     label: 'More than 3 years' },
    ],
  },
  {
    code: 'C3',
    field: 'pressure',
    question: 'What is the dominant pressure on your team right now?',
    options: [
      { value: 'delivery', label: 'Delivery against tight deadlines' },
      { value: 'change',   label: 'Change or restructure' },
      { value: 'growth',   label: 'Growth or scale-up' },
      { value: 'recovery', label: 'Recovery from a setback' },
      { value: 'steady',   label: 'Steady-state operations' },
    ],
  },
  {
    code: 'C4',
    field: 'team_type',
    question: 'What kind of team is it?',
    options: [
      { value: 'operational', label: 'Operational (front-line delivery)' },
      { value: 'project',     label: 'Project (time-bounded work)' },
      { value: 'functional',  label: 'Functional (a specialist discipline)' },
      { value: 'leadership',  label: 'Leadership (other leaders reporting to you)' },
      { value: 'mixed',       label: 'Mixed' },
    ],
  },
];

// =====================================================================
// THE FOUR Ps WITH ELEMENTS, DRIVERS, AND THE 36 DIAGNOSTIC ITEMS
// =====================================================================

export const PS = [
  {
    code: 'P1',
    key: 'purpose',
    name: 'Purpose',
    question: 'Where are we headed, and why does it matter?',
    colour: '#4CAF50',
    colourClass: 'purpose',
    leadershipWork: 'Goal setting and Review',
    descriptor: 'The longer-term vision and the year-by-year goals to achieve that vision, that define the direction the team is moving in.',
    elements: [
      {
        code: '1.1',
        name: 'Vision',
        driverCode: '1.1',
        driverName: 'Understands the vision',
        field: 'el_vision',
        items: [
          { code: '1.1.a', text: 'Every member of my team can describe, in their own words, what we are here to do.' },
          { code: '1.1.b', text: 'If I stopped four different people on my team and asked them where we are heading, I would get recognisably similar answers.' },
          { code: '1.1.c', text: 'When a new piece of work appears, my team can tell whether it fits our direction without having to ask me.' },
        ],
      },
      {
        code: '1.2',
        name: 'Goals',
        driverCode: '1.2',
        driverName: 'Transfers it into goals',
        field: 'el_goals',
        items: [
          { code: '1.2.a', text: 'Each member of my team can describe their two or three live goals from memory, including what done looks like.' },
          { code: '1.2.b', text: 'Goals on my team are shaped in conversation, with real chance for the team member to push back and refine.' },
          { code: '1.2.c', text: 'When obstacles appear, my team members bring me the problem with options attached.' },
        ],
      },
      {
        code: '1.3',
        name: 'Measures',
        driverCode: '1.3',
        driverName: 'Monitors through measures',
        field: 'el_measures',
        items: [
          { code: '1.3.a', text: 'My team has three to five measures that everyone knows by name and current value.' },
          { code: '1.3.b', text: 'We review our key measures in every regular team meeting.' },
          { code: '1.3.c', text: 'When a measure goes the wrong way, our conversation focuses on understanding the cause.' },
        ],
      },
    ],
  },
  {
    code: 'P2',
    key: 'plan',
    name: 'Plan',
    question: 'How are we going to get there?',
    colour: '#0077B6',
    colourClass: 'plan',
    leadershipWork: 'Delegation',
    descriptor: 'The structure of the business and the minimum standard operating procedures that let people work with safety and freedom of movement.',
    elements: [
      {
        code: '2.1',
        name: 'Process',
        driverCode: '2.1',
        driverName: 'Designs the work',
        field: 'el_process',
        items: [
          { code: '2.1.a', text: 'For the work that recurs in our team, we have agreed steps that everyone follows.' },
          { code: '2.1.b', text: 'A new starter could pick up the way we do our main work using the documentation we have.' },
          { code: '2.1.c', text: 'We regularly review and trim our processes to keep them simple.' },
        ],
      },
      {
        code: '2.2',
        name: 'Roles',
        driverCode: '2.2',
        driverName: 'Allocates the work',
        field: 'el_roles',
        items: [
          { code: '2.2.a', text: "Each member of my team can name what they own and what is somebody else's job." },
          { code: '2.2.b', text: 'When new work appears, we agree who owns it within a day or two.' },
          { code: '2.2.c', text: "My team members step in and out of each other's territory by explicit agreement." },
        ],
      },
      {
        code: '2.3',
        name: 'Authority',
        driverCode: '2.3',
        driverName: 'Delegates the authority',
        field: 'el_authority',
        items: [
          { code: '2.3.a', text: 'Each member of my team knows the kind of decisions they can take alone and the kind that need escalation.' },
          { code: '2.3.b', text: 'Day-to-day decisions get made on my team without me having to be in the room.' },
          { code: '2.3.c', text: "When unexpected situations arise, my team's first move is to act, with a brief report afterwards." },
        ],
      },
    ],
  },
  {
    code: 'P3',
    key: 'people',
    name: 'People',
    question: 'How do we hold ourselves to the right standards?',
    colour: '#8B00CC',
    colourClass: 'people',
    leadershipWork: 'Performance Review and Feedback',
    descriptor: 'The mindset, standards, performance expectations and feedback that turn talented individuals into a high-performing team.',
    elements: [
      {
        code: '3.1',
        name: 'Standards',
        driverCode: '3.1',
        driverName: 'Sets the standard',
        field: 'el_standards',
        items: [
          { code: '3.1.a', text: 'My team holds itself to three or four explicit standards that everyone can describe.' },
          { code: '3.1.b', text: 'When someone on my team falls below the standard, it gets named within a day or two.' },
          { code: '3.1.c', text: 'The same standards apply to senior and junior members of my team.' },
        ],
      },
      {
        code: '3.2',
        name: 'Trust',
        driverCode: '3.2',
        driverName: 'Builds the trust',
        field: 'el_trust',
        items: [
          { code: '3.2.a', text: 'Members of my team say difficult things to each other without it becoming personal.' },
          { code: '3.2.b', text: 'When someone on my team is struggling, they say so, and the team rallies around them.' },
          { code: '3.2.c', text: 'When my team members make commitments to each other, they either keep them or raise the difficulty early.' },
        ],
      },
      {
        code: '3.3',
        name: 'Feedback',
        driverCode: '3.3',
        driverName: 'Gives the feedback',
        field: 'el_feedback',
        items: [
          { code: '3.3.a', text: 'Feedback happens on my team frequently and in both directions.' },
          { code: '3.3.b', text: 'My team members ask for feedback as well as receive it.' },
          { code: '3.3.c', text: 'Difficult feedback gets given on my team in time for the person to act on it.' },
        ],
      },
    ],
  },
  {
    code: 'P4',
    key: 'pride',
    name: 'Pride',
    question: 'Do we actually care? How does it show?',
    colour: '#FF9800',
    colourClass: 'pride',
    leadershipWork: 'Coaching',
    descriptor: 'The internal conversations that turn competent execution into genuine ownership by the people doing the work.',
    elements: [
      {
        code: '4.1',
        name: 'Proactivity',
        driverCode: '4.1',
        driverName: 'Coaches initiative',
        field: 'el_proactivity',
        items: [
          { code: '4.1.a', text: 'My team members bring me problems with options attached for handling them.' },
          { code: '4.1.b', text: 'Uncovered work on my team gets picked up by someone within a day.' },
          { code: '4.1.c', text: 'My team members make small improvements to how we work without being asked.' },
        ],
      },
      {
        code: '4.2',
        name: 'Energy',
        driverCode: '4.2',
        driverName: 'Protects energy',
        field: 'el_energy',
        items: [
          { code: '4.2.a', text: 'Members of my team arrive ready to work and recover well between intense periods.' },
          { code: '4.2.b', text: 'My team talks about its work with genuine interest, even when the work is hard.' },
          { code: '4.2.c', text: 'Setbacks on my team are absorbed and learnt from within the same week.' },
        ],
      },
      {
        code: '4.3',
        name: 'Recognition',
        driverCode: '4.3',
        driverName: 'Recognises the work',
        field: 'el_recognition',
        items: [
          { code: '4.3.a', text: 'Recognition on my team is given in the moment and tied to what the person actually did.' },
          { code: '4.3.b', text: 'The invisible contributors on my team get recognised as often as the visible ones.' },
          { code: '4.3.c', text: 'Recognition on my team accurately reflects what the person actually contributed.' },
        ],
      },
    ],
  },
];

// =====================================================================
// FLAT ITEM ACCESSORS — for the diagnostic flow and the scoring engine
// =====================================================================

export const ALL_ITEMS = PS.flatMap(p =>
  p.elements.flatMap(el =>
    el.items.map(item => ({
      ...item,
      pKey: p.key,
      pCode: p.code,
      pName: p.name,
      elementCode: el.code,
      elementName: el.name,
      elementField: el.field,
      driverCode: el.driverCode,
      driverName: el.driverName,
    }))
  )
);

export const TOTAL_ITEMS = ALL_ITEMS.length; // 36

// =====================================================================
// VERSIONING
// =====================================================================

export const INSTRUMENT_VERSION = '1.0';
export const FRAMEWORK_VERSION  = '1.4';
