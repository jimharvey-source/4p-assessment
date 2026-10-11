// =====================================================================
// REPORT CONTENT
// Narrative source material for the free report.
//
// Drawn from Four Ps Competency Framework v1.4:
//   - "What it costs" passages from each element page
//   - "Development moves" from each element page
//   - P-level summary language from the chapter intros
//
// Voice rules applied: UK English, no em dashes, no antithesis,
// no jargon, written to the manager as a peer.
//
// Free report uses one paragraph per priority P + one move per driver.
// The Pro report (Phase 2) will use more of this material.
// =====================================================================

// One paragraph per P explaining what the score means and what is at stake.
// Voiced from a "thoughtful friend" register.

export const P_NARRATIVES = {
  purpose: {
    headline: 'Purpose is where the work begins.',
    bodyParas: [
      'Of the four Ps, Purpose is both the most discussed and the least reliably held. Every leadership programme talks about vision. Every appraisal asks about goals. And yet, in most teams, if you stop people in the corridor and ask them what their team is for, you get four different answers from four different people.',
      'A weak score here means your team is operating without a settled answer to the question of where they are heading. The cost is rarely dramatic. It shows up as decision fatigue at your desk, inconsistency in the work the team produces, energy spent on the wrong things, and good people quietly disengaging because they cannot tell whether what they are doing matters.',
      'The leadership work that holds this P together is Goal setting and Review. Done well, it turns intention into commitment, and commitment into the work that compounds.',
    ],
  },
  plan: {
    headline: 'Plan is where the work moves.',
    bodyParas: [
      'A team with a clear Purpose can still fail to deliver if the Plan is wrong. The plan is the structure of the business: how the moving parts fit together, the hand-offs, the dependencies, the minimum standard operating procedures that let people work with safety and freedom of movement inside those boundaries.',
      'A weak score here means your team has the right intentions but the wrong scaffolding around them. The symptoms are familiar: things fall through the gaps, decisions bottleneck at your desk, new starters take six months to get useful rather than six weeks, and the team becomes brittle because the work depends on individuals rather than the system.',
      'The leadership work that holds this P together is Delegation: the discipline of pushing authority and responsibility to the lowest possible level in the organisation. Done well, it turns the plan from a document into the actual flow of work.',
    ],
  },
  people: {
    headline: 'People is where the work holds together.',
    bodyParas: [
      'Purpose and Plan are necessary. They are not sufficient. A team with both can still come apart if the conditions for working together are missing.',
      'A weak score here means the standards, the trust, and the feedback that turn a group of talented individuals into a high-performing team are not yet in place. The cost shows up under pressure: difficult conversations get avoided, bad news gets concealed until it can no longer be concealed, and the team performs at sixty per cent of its potential because its members are protecting themselves rather than backing each other up.',
      'The leadership work that holds this P together is Performance Review and Feedback. Done well, it keeps the team honest with itself over time and lifts the standard for everyone.',
    ],
  },
  pride: {
    headline: 'Pride is where the work comes alive.',
    bodyParas: [
      'Pride is downstream of the other three Ps. Without Purpose, there is nothing to take pride in. Without Plan, no clear vehicle through which to express care. Without People, no team to take pride in being part of.',
      'A weak score here means your team has the structural conditions in place but is operating without the internal state that turns competent execution into genuine ownership. The cost is sustained underperformance against capacity. The team appears competent but consistently does eighty per cent of what it could. Strong performers feel invisible. Care drains away.',
      'The leadership work that holds this P together is Coaching. Done well, it builds the judgement and ownership that turns a competent executor into someone who genuinely runs their patch as their own.',
    ],
  },
};

// One "one move this week" per driver.
// This is the single highest-leverage development move drawn from the
// framework's development moves for the corresponding element.
// Each move is concrete, specific, and doable in real meetings.

export const DRIVER_MOVES = {
  '1.1': {
    driver: 'Understands the vision',
    move: 'Stop the team. Ask each person, one to one, to describe in two sentences what the team is for. Listen to the four different answers. Do not try to fix it in the room. Then write the version you wish all four of them had given.',
  },
  '1.2': {
    driver: 'Transfers it into goals',
    move: 'At the end of every goal-setting conversation this week, ask one question: on a scale of one to ten, how committed do you feel to this goal? If the answer is below eight, the work is not finished. Find out what is in the way and either fix it or change the goal.',
  },
  '1.3': {
    driver: 'Monitors through measures',
    move: 'Decide the three to five measures that, taken together, would tell an outside observer whether your team is winning. Put them somewhere everyone can see them every day. Resist the urge to add a sixth.',
  },
  '2.1': {
    driver: 'Designs the work',
    move: 'List the five most important recurring activities in your team. For each, ask whether there is a documented process or whether it lives in someone\'s head. The ones in someone\'s head are your priority. Document them this week, even at the level of a one-page outline.',
  },
  '2.2': {
    driver: 'Allocates the work',
    move: 'Run a roles workshop with the team. Each person writes down what they think their role is. Each other team member writes down what they think that person\'s role is. Compare the lists. The gaps and disagreements are the work.',
  },
  '2.3': {
    driver: 'Delegates the authority',
    move: 'Make a list of the ten kinds of decisions that come up most often in your team. For each, decide which delegation level it sits at, and tell the team. The clarity is the gift.',
  },
  '3.1': {
    driver: 'Sets the standard',
    move: 'Name three or four standards explicitly. Not as values. As behaviours: we respond to client queries within X. We do not leave a meeting without writing down what was agreed. We tell each other when we are stuck rather than going quiet for a week. Specific, observable, enforceable.',
  },
  '3.2': {
    driver: 'Builds the trust',
    move: 'Lead with reliability yourself. Make the small commitments this week: turning up on time, sending the note you said you would send, doing the small thing you promised. Meet them visibly. Trust is built bottom-up from these moments.',
  },
  '3.3': {
    driver: 'Gives the feedback',
    move: 'Ask each team member how they prefer to receive feedback. Direct or empathetic. Short or talked through. In the moment or held for later. The five minutes that conversation takes pays back in every feedback exchange for the rest of the working relationship.',
  },
  '4.1': {
    driver: 'Coaches initiative',
    move: 'When a team member brings you a problem this week, ask them what they think the answer is before you offer one. The first three times will feel slower than just answering. By the tenth, the team member is bringing answers as well as problems.',
  },
  '4.2': {
    driver: 'Protects energy',
    move: 'Audit what is draining your team\'s energy this week. Pointless meetings. Rework caused by unclear briefs. Conflict that has not been addressed. Stop the visible drains. Most teams can recover ten to twenty per cent of their energy just by stopping the things that should not be happening.',
  },
  '4.3': {
    driver: 'Recognises the work',
    move: 'Build a noticing practice. Spend five minutes at the end of each week scanning what each team member has done. Pick one or two specific things to name on Monday. Recognise specifically: "the way you handled the call with X on Tuesday, that was exactly the right call, and it saved the relationship."',
  },
};

// Mapping from priority P to the relevant Management Ignite tool.
// Used by the report's CTA section.

export const TOOL_FOR_P = {
  purpose: { name: 'Goal Ignite',      url: 'https://goal.management-ignition.com' },
  plan:    { name: 'Delegate Ignite',  url: 'https://delegate.management-ignition.com' },
  people:  { name: 'Feedback Ignite',  url: 'https://feedback.management-ignition.com' },
  pride:   { name: 'Coach Ignite',     url: 'https://coach.management-ignition.com' },
};
