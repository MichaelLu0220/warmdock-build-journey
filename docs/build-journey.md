# Build journey: from dock to day

This is the useful order of events, not a release log and not a reconstruction
guide for the private repository.

## 1. Start with the uncomfortable rule

The first prototype was a desktop dock with local data. That was enough to test
the idea that tasks should become finish-only promises.

This stage answered product questions that architecture diagrams could not:

- Should unfinished tasks roll over? No—the point is to let the day end.
- Should the starting list feel roomy? Also no—scarcity creates choice.
- Should points be decorative? No—they should unlock capabilities.

The prototype was disposable, but the time spent using it was not.

## 2. Separate the product rules from the screen

Before adding more platforms, the shared concepts were separated from the
desktop interface. The lesson was simple: extracting one app into layers is a
refactor; extracting two diverged apps is a rescue operation.

Only the broad dependency direction is public:

```text
product rules → application actions → platform interface
                         ↓
                 backend boundary
```

## 3. Move authority away from the client

A constraint-driven product cannot trust a browser or desktop client to award
points or rewrite history. The backend became the authority for accounts and
state changes; clients became views and requesters.

The private repository contains the actual persistence and enforcement code.
The public lesson is the important one: when the constraint *is* the product,
protect it at the boundary you control.

## 4. Admit that the web is a web page

The first web idea tried to preserve the floating-dock metaphor everywhere.
That produced experiments involving overlays and a browser extension.

They were deleted.

On desktop, a dock can genuinely live at the edge of the screen. In a browser,
people expect a page. Keeping the product philosophy did not require copying
the same container onto every platform.

## 5. Build a demo from replaceable boundaries

The public demo uses temporary in-memory data. It is interactive, needs no
account, and saves nothing.

This was possible because the interface depends on capabilities, not on one
hard-coded data source. A demo built from the real interaction flow ages much
better than a second fake application maintained beside it.

## 6. Turn weekly data into a moment

The earliest weekly review was a chart behind a menu. It was correct and easy
to ignore.

The next version arrived as a gift box. Opening it became part of the weekly
rhythm; closing it tucked the review away. The underlying information did not
need to become more sophisticated. It needed an entrance.

## 7. Discover that sharing is a privacy feature

Task titles are casual input. Casual input often contains names, health
details, clients, legal matters, or private plans.

Publishing a week therefore needed:

- an explicit choice;
- control over which titles become public;
- clear wording when some titles are hidden;
- a link that is difficult to guess;
- immediate revocation.

The private implementation is deliberately absent here. The product decision is
worth sharing because it applies to many “harmless” social features.

## 8. Spend a long time on small things

The last part of building WarmDock looked less like feature development and
more like reading:

- reading labels that wrapped badly in a pixel font;
- reading the screen under a thumb instead of a mouse pointer;
- reading network traffic created by a slow typist;
- reading the meaning implied by a loading number;
- reading whether an animation felt gentle or merely slow.

Individually, none of those fixes makes a launch post. Together, they are the
difference between software that works and a product that feels intentional.

## What I would do earlier next time

- Test authoritative rules before polishing the client.
- Decide which parts of a metaphor belong to the product and which belong only
  to one platform.
- Treat configuration and deployment checks as product work.
- Design privacy before adding a share button.
- Never sell an unlock before the feature behind it exists.

