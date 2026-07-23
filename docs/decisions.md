# Decisions

The calls that were genuinely hard, with the reasoning — including the ones that were wrong first.

## The weekly period is anchored to your unlock date, not to Monday

The copy promises "every seven days after unlocking". Two readings were possible: a fixed calendar week, or seven days counted from the moment you paid for the ability.

Anchoring to the unlock date won because it matches what the product said, and because it spreads the moment out — not everyone gets their gift box on Monday morning. It also removes a whole class of timezone edge cases around "which Monday".

The cost: a user cannot compare their week to a calendar week. Nobody has asked to.

## The gift box's "seen" state lives on the server

It would have been one line in local storage. Then the box comes back on a new device, or after clearing site data, and the moment is cheapened.

So there is a column recording which period you last opened, updated through an authoritative procedure, and the "should the box glow?" question is answered by the server. The client never decides.

## Read procedures use the invoker's rights; write procedures use the definer's

The default instinct is to make everything a privileged procedure — it always works. That is also how you build a function that happily reads someone else's data if a caller passes a different identifier.

The rule settled on:

- **Reads run as the caller**, so row-level security is the isolation boundary. Any explicit ownership filter inside the query is a second line of defence, not the first.
- **Writes run privileged**, with an explicit ownership filter, and derive the user from the session — never from a parameter.

I got this wrong once mid-project: two helper functions that took a user identifier were written as privileged and granted to all signed-in users. Any logged-in person could have passed someone else's identifier and read their task titles. Caught while reviewing the diff, not by a test — which is an argument for both.

## Sharing a week freezes; sharing a profile card does not

Same feature family, opposite answers, because the reader's expectation differs.

A shared week describes one specific past week. If it changed after you shared it, the link would be lying about what you sent. Freeze it.

A profile card describes you *now*. A frozen streak count goes stale within a day. Read it live.

The frozen version has a security bonus that made it easy to defend: the public read is a token lookup returning stored JSON, so no query runs under an unauthenticated identity.

## The language service is allowed to fail, but not allowed to pretend

The gateway never throws — a failed analysis returns a fallback so task creation is never blocked. That part was right from the start.

What was wrong was the interface: while waiting for an answer, the app displayed the fallback's difficulty as if it were a real suggestion. Users saw a score appear, then jump when the real answer arrived — or, worse, saw a confident number when the service was down entirely.

The fix separated three states that had been two:

- **pending** — no answer yet. Show an ellipsis, not a number.
- **ready** — a real suggestion.
- **unavailable** — the service answered nothing. Offer a manual difficulty picker instead of inventing a number.

The fallback still exists. The interface just stopped presenting it as a recommendation.

## A debounce is not a rate limit

Analysis was debounced at 700ms, which reads as "we only send one request when the user stops typing". For a fast typist that is true. For a slow one, every pause exceeds the debounce and each letter sends a request.

The fix was not a longer debounce — it was recognising that intermediate text is worthless. Only the *finished* title is worth analysing, so analysis runs when editing is finished: on open, on Enter, on blur. Zero requests in between, at any typing speed.

## Touch targets: the whole card, but not a transparent overlay

Page turns were a 24px drag strip at the card's edge. On a phone that is both too small for a thumb and directly in the path of the browser's own back gesture.

The obvious fix — stretch the strips to cover half the card each — breaks everything, because a transparent overlay swallows every tap meant for the tasks underneath.

What works: put the drag handlers on the card itself and let events bubble. Taps still reach buttons and inputs; only a movement past the threshold counts as a turn. Mouse input keeps the narrow edge zone, because a mouse drag across the middle of a page is usually someone selecting text.

That last clause was learned the hard way: an intermediate version routed mouse drags through the card too, which turned every page-turn attempt into a text selection and made the app effectively unturnable on desktop.

## Deleting the browser extension

The web version was originally going to be a floating dock — an extension overlaying the dock on any page. It was built, then deleted.

The reason: on the web, users expect a web page. A floating panel over someone else's site is a novelty that has to be justified on every visit, and the justification never arrived. Desktop and mobile can genuinely live at the edge of a screen; a browser tab cannot.

The deletion took ten minutes and removed a platform's worth of future maintenance.
