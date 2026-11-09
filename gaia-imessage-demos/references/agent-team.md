# Agent team and scoring

Run five independent agents per round. Each gets the script and nothing about the intent. Never tell an agent what you were trying to do.

The point is to simulate the readers who matter: someone who has never heard of GAIA, someone who is the customer, and someone who funds companies.

## Roles

### 1. Cold viewer

A person who does not know GAIA, does not know the category, and does not care about the persona. Make them a specific person, not a generic "user."

Score 0 to 10 on:

- `who_what`: can they say who these people are and what is happening, after one read?
- `why_care`: do they understand why it matters without being told?
- `confusion`: 10 means nothing confused them.
- `human_voice`: does it sound like real people texting?
- `wow`: did any moment make them lean in?
- `believability`: 10 means it felt real, 0 means staged
- `retention`: would they finish it?
- `share`: would they send it to a friend, and which line?

Ask for the three things that lost them, quoted exactly.

### 2. Persona-native viewer

The actual customer. A founder raising a round, or a service-business owner running jobs. They judge whether the work is real.

Score:

- `understands_my_business`
- `would_work_week_two`
- `trust_with_money`
- `human_voice`
- `cringe`: 10 means none, 0 means constant
- `wow`
- `would_pay_the_price`

### 3. YC partner

Forty demos in a day. They judge whether this is a company, not a video.

Score:

- `company_clarity`
- `wedge`: why not Duet, Dots, Muse, Instinct, Folk?
- `proof`: does the demo prove or assert?
- `impact`
- `defensibility`
- `demo_craft`
- `second_meeting`

Ask: what does this accidentally reveal, what would you ask, what would make it a 9.

### 4. Dialogue editor

A screenwriter who reads for a living. They catch written lines.

Score:

- `owner_voice`
- `assistant_voice`
- `rhythm`
- `subtext`
- `mess`: 10 means it has the disfluency of real texting, 0 means sterile
- `written_lines`: 10 means none.
- `ending`

Ask them to quote every line that sounds written and rewrite the three worst.

### 5. Continuity auditor

Pedantic on purpose. Names, dates, money, mechanisms, logic.

They return:

- every continuity error with the exact lines
- anything introduced and never resolved
- anything the viewer is expected to know but was never told
- an internal consistency score
- one fix that resolves the most errors with the fewest words

## Pass thresholds

This bar is deliberately hard.

- Cold viewer average at least **7.5**, and no dimension below **6**.
- Cold viewer `who_what` at least **7**. Anything lower is an automatic fail.
- Continuity **10/10**. Any error blocks the render.
- YC partner `demo_craft` at least **7.5** and `impact` at least **7**.
- Dialogue `written_lines` at least **8**.
- Persona-native viewer `trust_with_money` at least **7** and `would_pay_the_price` at least **7**.
- Zero failed gates in the logic audit.

A qualitative flag such as "I could not tell who these people are" is a fail even if every number clears.

## Iteration

- Run a round, rewrite, then run a fresh set of agents. Do not reuse the same agents, or they anchor on their first read.
- Two rounds must clear the thresholds before rendering. The second round is a confirmation, not a fresh hunt for a different opinion.
- If two cold viewers score the same script more than **1.5 points** apart, you are at the noise floor. Stop editing sentences and change the story, the protagonist, or the claim.
- Track the scores in a table. Report the round number and the delta, not just the final score.

## What the agents cannot fix

A scripted chat cannot prove retention or a real customer. If the YC partner says proof is 3 or 4, no rewrite will fix it. The answer is a real thread, a real customer, or one artifact from production. Say that plainly instead of polishing the prose again.

## Prompts

Give each agent:

- the role and the specific life they live
- the script, with artifacts marked in brackets
- the dimensions and the 0 to 10 instruction
- the instruction to be harsh: 5 is average, 8 is better than almost anything, 9+ is screenshot-worthy
- a request for the three things that lost them, quoted exactly

Do not give them the claim, the intent, or your own notes. If they need the intent, the script has already failed.
