# Build journey

The order things were built in, and what each phase actually cost.

## 1. A desktop MVP, standalone

WarmDock started as a single Tauri app with local storage. One platform, one codebase, no accounts.

This was the right start for one reason: **the rules had to be discovered before they could be shared.** Finish-only tasks, the daily settle, points, the ability tree — none of that was obvious on paper. It took using the thing for a while to learn that unfinished tasks must *not* roll over, and that three starting slots is uncomfortable in the productive way.

Cost: everything was tangled together. Domain rules lived inside components.

## 2. Pull the rules out into packages

Before adding a second platform, the app was split along dependency direction: pure domain rules and types at the bottom, then the backend adapters, then a framework-agnostic app layer, then DOM components.

Doing this *before* the second platform rather than during it was the single highest-leverage decision in the project. Extracting shared code from two divergent apps is a rewrite; extracting it from one is a refactor.

## 3. Move the truth to a real backend

Local storage cannot enforce anything. If the client owns the data, the client can edit a completed task — and the product is its constraints.

So: a hosted Postgres backend, every state change behind a stored procedure, row-level security on direct reads, and a database test suite written alongside the schema rather than after it.

The state machine fuzz test found real bugs that no amount of clicking would have. It is the test I would write first next time.

## 4. Add the web app

Next.js, sharing everything below the DOM layer with desktop.

The initial framing was wrong. The plan was to make the web app *also* a floating dock — a browser extension, an overlay, the same right-edge experience. Two false starts later the answer was obvious: **on the web, be a web page.** A normal centered app, like every other web tool. The dock metaphor belongs to desktop and mobile, where the app can actually live at the edge of the screen. The extension was deleted.

## 5. Give it a face

A marketing landing page, a public demo running the whole product on in-memory fake data, terms and privacy pages, sign-in.

The demo is the piece that earns its keep. Because the app layer talks to interfaces rather than a client, the demo is not a mock-up — it is the real app with a different backend. Nothing to maintain separately, and nothing to get out of sync.

## 6. Ship the backend to production

Migrations pushed to the hosted project, environment variables split between local and production, custom domain, and the language service moved behind a server-side proxy so its key never reaches a browser.

The first production incident was mundane and instructive: the proxy returned 503 for every request because an environment variable was set locally but never in the deployment. The code was right — the *hardening* was right, in fact, since an earlier version would have silently used a development key. Configuration is part of the product; a deploy is not done when the build is green.

## 7. Weekly review, and the sharing problem

Weekly analysis had been purchasable on the ability tree for a while without existing. That is worse than not shipping it — people were spending points on air. Building it was paying off a debt.

The feature grew in three passes:

1. **A read-only bar chart** buried in the ability page. Correct, and boring — it had no moment, and no reason to look at it.
2. **A gift box.** Every seventh day something appears in the corner. Open it, and the week unwraps out of the box. Close it, and it flies into the account page, where it lives. The data did not change; the *timing* did, and that made it a feature.
3. **Sharing.** A week can become a public page — and that is where the interesting problem was.

## 8. The sharing problem

Sharing a week means publishing task titles, and task titles are the least-guarded thing anyone writes. "Call the oncologist." "Email the lawyer about the divorce." "Fix the bug for [client]."

The first version published everything with a plain warning. That is defensible — sharing is deliberate, the warning is on the button, and it can be revoked. It is also the kind of defensible that produces a bad day for one user in a thousand.

The version that shipped offers a choice: share everything, or tick which tasks appear. Default is everything ticked, because the person pressing the button is proud of their week, not filling in a form. The numbers on the public page always count the whole week — only titles are filtered — and the page says so, so no reader is misled about what they are seeing.

Server-side, the selection is never trusted: whatever list of task identifiers the client sends is intersected with "tasks belonging to this user, in this period, actually completed" before anything is stored.

## 9. Polish, which is mostly reading

The last stretch was almost entirely fixing things that only appear when a real person uses the app on a real device:

- A slow typist fired one language-service request per letter, because a debounce is not a rate limit. Fixed by only analysing when editing is *finished* — on open, on Enter, on blur — and never in between.
- Traditional Chinese wrapped a label onto two lines, because the pixel typeface made an adjacent element 200px wide for the sake of the word "points". Deleting the word fixed the layout.
- Two navigation buttons wrapped to two lines on a phone, because nothing had told them not to.
- The demo's guided-tour bubble always positioned itself to the left of its target — fine on a desktop dock, completely off-screen on a phone.
- Page-turn drags were a 24px strip at the very edge of a card: fine for a mouse, hostile to a thumb, and competing with the browser's own back gesture.

None of these are interesting individually. Together they are most of the difference between "it works" and "it feels finished".

## What I would do differently

- **Write the database tests first, always.** They caught more than every other kind of test combined, and they are the only tests that protect a rule the client cannot be trusted with.
- **Decide the platform metaphor before building for the platform.** Two false starts on "web as a floating dock" were two false starts too many.
- **Do not sell a feature on the ability tree before it exists.** Even to yourself.
- **Treat configuration as code that can fail.** The green build lies about the environment.
