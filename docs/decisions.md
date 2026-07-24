# Decisions, including the deleted ones

## Finish-only after commitment

The product needs a point after which a task becomes real. Before that moment,
discarding a draft is ordinary editing. After it, editing or deleting would
turn a promise back into a suggestion.

The exact private state model is not published here. The user-facing rule is:
review first, then commit.

## A week follows the person, not the calendar

Weekly review is about seven days of use after the ability is unlocked, not
about producing a corporate Monday-to-Sunday report. This keeps the feature
personal and prevents everyone from receiving the same moment at once.

The trade-off is that it does not match a conventional calendar week. That is
acceptable because WarmDock is not a reporting tool.

## A review freezes; a personal card stays alive

A shared weekly review describes a particular past week. Changing it later
would make the original share misleading, so it behaves like a snapshot.

A personal card describes the person now. Freezing a streak or current total
would make it stale, so it can reflect current public-safe data.

Same family of feature, opposite data lifecycles—the reader's expectation makes
the decision.

## “Pending” is not a difficulty score

The first interface could show a fallback value while WarmAI was still
thinking. That made the number look authoritative and then jump when the real
answer arrived.

The corrected design distinguishes:

- **pending** — no answer yet;
- **ready** — a suggestion arrived;
- **unavailable** — choose manually.

The fallback can keep the workflow alive without wearing a fake moustache and
calling itself intelligence.

## A debounce is not a reason to analyse text

A pause between keystrokes only tells us that typing paused. It does not tell
us the task title is useful.

Analysis moved to meaningful completion events such as opening an existing
title, submitting, or leaving the editor. This creates fewer requests and a
more stable interface for both fast and slow typists.

## Touch gets a different gesture contract

A narrow edge is precise with a mouse and miserable with a thumb. So the two
pointer types get opposite trades:

- **Touch** starts a turn from the whole card and commits with a *shorter* drag.
  The thin edge was the problem — a bigger start target and a lower threshold
  make the page turn instead of fighting the browser's own back gesture.
- **Mouse** keeps the narrow edge and a *longer* drag, because an ordinary drag
  across the middle of a page is almost always a text selection, not a turn.

The counter-intuitive part is that the *touch* threshold ends up smaller, not
larger. "Make it easier for the thumb" turned out to mean less required travel,
not more.

The small public gesture utility carries this trade in its defaults, and a
companion `dragPreview` utility shows the mid-drag feedback — the card rotates a
little as you pull and signals when releasing will commit — without containing
the production component.

## The browser extension was deleted

The web client originally tried to be a floating dock over other pages.

The experiment answered its question: the metaphor was stronger on platforms
where an app can genuinely occupy the screen edge. On the web, a straightforward
page was calmer, clearer, and cheaper to maintain.

Deleting work is sometimes the most complete version of the feature.

