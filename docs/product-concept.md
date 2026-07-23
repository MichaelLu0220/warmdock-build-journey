# Product concept

## The rule

Most todo apps reward you for adding. Add a task, feel productive. Move it to tomorrow, feel productive again. The list grows, the guilt grows with it, and eventually you declare bankruptcy and start a new list.

WarmDock takes the opposite position: **a task, once created, cannot be edited or deleted — only finished.**

That single rule does most of the design work:

- **It makes creating a task cost something.** If you cannot quietly rewrite it later, you think about the wording now.
- **It removes the busywork that feels like work.** There is no reordering, no re-tagging, no grooming. There is nothing to do with a task except do it.
- **It makes the day honest.** At the end of the day the list says what actually happened.

There is one escape hatch, and it is deliberately narrow: a task that has not yet had its difficulty set is still a *draft* and can be discarded. Once you commit to a difficulty, it is a promise.

## The daily cycle

WarmDock is not a list that lives forever. It is a **day** that opens and closes.

- The first task you create locks the day's timezone and its reset time.
- Tasks belong to that day. They do not roll over.
- At the reset time the day settles: totals are computed, points move into your wallet, the streak advances or breaks.
- The next day starts empty.

The closing is a small ceremony rather than a silent rollover. If everything got done, the app says so and gets out of the way. If it didn't, it says that too — without red badges or a nagging counter. The tone throughout is *warm and unhurried*: no exclamation marks, no streak-loss panic, no "you're falling behind".

## Scarcity as the progression system

You start with **three task slots**. Not because three is optimal, but because a small number forces a choice, and choosing is the point.

Completing tasks earns points. Points are spent on an **ability tree**:

- **Capacity** — a fourth, fifth, sixth, seventh slot
- **Focus** — mark one task as the day's focus for a small bonus
- **Rhythm** — set your own daily reset time instead of midnight
- **Analysis** — weekly review

This inverts the usual settings page. Features are not toggles you find in a menu; they are things the app hands you after you have shown you use it. A new user cannot misconfigure WarmDock, because there is almost nothing to configure yet.

## Difficulty, and why a machine guesses it

Points come from difficulty, so difficulty has to be set — and asking a user to rate their own task from 1 to 5 every time is friction that adds nothing.

So a small language service (WarmAI) reads the task title and proposes a score, plus a corrected wording when the original has typos. The user can accept or override it.

Three rules keep this from becoming annoying:

1. **It never blocks.** If the service is slow or down, the app says so plainly and lets the user pick a difficulty by hand. Task creation is never gated on a model responding.
2. **It never invents confidence.** While the answer is still in flight the score shows an ellipsis, not a placeholder number. A number on screen means a real answer arrived.
3. **It is not chatty.** One request when the modal opens, one when the user finishes editing. No requests while typing.

## The weekly review

Seven days after unlocking weekly analysis — and every seven days after — a gift box appears in the corner of the app. Opening it unwraps that week: what got finished each day, the strongest day, the days closed out clean.

Closing the review tucks it into the account page, where it stays.

A week can be **shared as a public link**. Because task titles are the least-guarded thing people write ("call the oncologist", "email the lawyer"), sharing offers two paths:

- **Share everything** — the whole week, titles included.
- **Choose what to show** — tick the tasks that go public; the numbers still count all of them, and the page says plainly that some were held back.

Shared links are unguessable, excluded from search engines, and can be turned off at any time.

## What WarmDock is not

- Not a project manager. No sub-tasks, no dependencies, no assignees.
- Not a calendar. Tasks have a day, not a time.
- Not a habit tracker. The streak counts days you finished what you promised, not days you opened the app.
- Not a team tool. One person, one day, one small list.
