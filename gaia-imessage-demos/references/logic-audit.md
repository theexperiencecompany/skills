# Logic audit

The founder catches continuity errors on the first read. The job of this pass is to catch them before the render.

Every beat must survive all twelve gates. A single failure means rewrite, not soften.

## The shared failure

The script is written from the writer's knowledge of the intended story, not from the audience's and characters' knowledge at each beat.

The writer already knows a booking exists, a number was said, a person is called Northline, the scene is about a raise. That context gets compressed out, and the line arrives carrying facts only the author has. The result is locally fluent and globally incoherent.

## The state ledger

Fill one row per beat before writing the dialogue. A blank cell is the bug.

| Beat | Day and time | Speaker | What they know at this point | What changed since the last beat | Why now, not earlier or later | Mechanism: how it reached them |
|---|---|---|---|---|---|---|
| 1 | Mon, Nov 2 6:02 AM | GAIA | Calendar, inbox, onboarding goal | New day | Morning brief | Reads calendar and mail |
| 2 | Mon, Nov 2 | User | The brief | Receipts still unsent | Worry | Types |
| 3 | Mon, Nov 2 | GAIA | Receipts were sent last night | Confirmation | Answers the question | Mail sent from Downloads |

Rules:

- Knowledge only grows from a shown source.
- A change must be caused by a named event.
- "Why now" must beat "why not yesterday."
- A mechanism always has an actor and a channel.

## The twelve gates

1. **Number provenance.** Can I point to the earlier beat or source that makes this exact number the only correct one? Fails: 104 against the 118 said last month with no explanation.
2. **Prior state.** Which earlier beat established the thing this action acts on? Fails: "found a cheaper flight" when no flight was ever booked.
3. **Gap accounting.** What changed during the time skip, and does the next beat show it? Fails: a multi-day jump hides a booking appearing from nowhere.
4. **Referent resolution.** Does every noun and pronoun resolve to exactly one earlier referent? A pronoun is fine when only one antecedent is live. Fails: "two months back" with no anchor.
5. **Mechanism.** Can I name the sender, the channel, and why it lands here rather than somewhere else? Fails: a contract teleporting into an inbox.
6. **Adjacency.** Do these two lines require each other to be false? Fails: "nothing on my plate" followed by a personal item.
7. **Evidence for judgment.** What did the speaker see that justifies this call, and did the audience see it too? Fails: "ten drafts, three are good" with no basis.
8. **Mouth test.** Would a real person say this, in these words, to this person? Short is fine when it carries a constraint or a reaction. Fails: "Book it." as a bare command where the schedule matters. Passes: "Book it. I'm free Thursday afternoon."
9. **Knowledge state.** What did this character learn since their last beat, and from whom? Fails: "who is this" from a user who signed up.
10. **Stake.** What does the user gain or risk in this beat? If nothing, why does the beat exist? This is not a demand for conflict. A calm beat still needs a stake: time, money, reputation, or a decision.
11. **Premise.** Name the scene's subject in one noun. Does this line advance that noun? Fails: a beat that drifted into a neighboring topic while the wording stayed clean.

12. **Calendar truth.** Does every weekday match its date, and does every spoken day ("Thursday", "Friday") match a divider? Fails: "Thursday afternoon" under a divider that says "Tue, Nov 3".

## The three highest-leverage checks

1. **What changed since the last beat?**
   This kills the silent state changes. Writers write each beat from the ending, so the middle is assumed. One question per beat removes the largest class of "I don't understand logically."

2. **Does every number and shorthand resolve to a prior concrete beat?**
   Check every digit and every deictic: "back then", "the other one", "last month". Demand an anchor. Pronouns are fine when only one antecedent is live. This catches errors that survive a read because the writer's brain fills the referent.

3. **What is this scene about, in one noun?**
   Run this first. A wrong premise invalidates every downstream fix. It is the cheapest way to catch a scene that drifted.

## The founder's examples, mapped

- "it says 104 not the 118 you told them last month" → gate 1.
- "i'll find a flight, then in november 14 ... found one cheaper than the one you have ... how does that make sense?" → gates 2 and 3.
- "i'm not sure what 'two months back' means" → gate 4.
- "why and how would it put it in my inbox?" → gate 5.
- "if theres nothing on my plate then why does it say mom called" → gate 6.
- "ten drafts three are good, seems a bit confusing" → gate 7.
- "'book it' is too short too" → gate 8.
- "who is this ... the user legit signed up" → gate 9.
- "why would we want to have a disagreement?" → gate 10, which asks for a stake, not a fight.
- "maybe not even about investor updates like this?" → gate 11.

## Output

The audit returns three things:

- Failed gates, each with the beat id and the exact line.
- A rewritten line for each failure.
- A verdict: pass, or list the beats that must change before rendering.

No pass is valid if any gate is unanswered. "Probably fine" is a fail.
