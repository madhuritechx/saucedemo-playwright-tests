# Sauce Demo — Playwright E2E Tests

End-to-end UI test suite for [Sauce Demo](https://www.saucedemo.com/), built with
**Playwright** and **TypeScript** using the Page Object Model.

The goal of this project is not maximum coverage — it is to show a small,
clean, maintainable suite that covers the highest-risk flows of the app, with
meaningful assertions and a structure that would scale.

---

## Tech stack

- [Playwright](https://playwright.dev/) test runner
- TypeScript
- Page Object Model for reusable, readable page interactions

## Project structure

```
.
├── pages/                # Page Objects — one class per screen
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
├── tests/
│   ├── auth.setup.ts     # logs in once via the UI, saves the session
│   ├── login.spec.ts     # login flow: happy path + negative cases
│   ├── cart.spec.ts      # cart badge / contents integrity
│   ├── checkout.spec.ts  # full checkout + price validation
│   └── test-data.ts      # users, products, shared constants
├── utils/
│   └── money.ts          # currency parsing helper
├── .github/workflows/    # CI — runs the suite on every push / PR
└── playwright.config.ts
```

---

## Setup

Requires [Node.js](https://nodejs.org/) 20 or newer (required by Playwright 1.63+).

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browsers
npx playwright install
```

## Running the tests

```bash
# Run the whole suite (headless)
npm test

# Watch it run in a browser
npm run test:headed

# Interactive UI mode (great for debugging)
npm run test:ui

# Open the HTML report after a run
npm run report
```

---

## What is covered and why

The tests target the flows where a failure would hurt an e-commerce app the
most, deliberately spread across different **risk categories**:

| Test | Category | Key assertions |
|------|----------|----------------|
| **Login — standard user** | Happy path / auth | Lands on inventory, 6 products shown |
| **Login — invalid password** | Negative / security | Exact error message, user stays on login page |
| **Login — locked-out user** | Negative | Exact locked-out message |
| **Cart integrity** | State management | Badge count updates on add **and** remove; cart holds the right item |
| **Checkout** | Core business flow | Overview lists the right products; item total matches prices; item total + tax = grand total; order confirmed |
| **Checkout validation** | Negative / form | Missing first name is blocked with the correct error, stays on the form |

## Design decisions

- **Page Object Model** — selectors and actions live in one place per screen,
  so tests read like plain English and a UI change is a one-line fix.
- **Stable, user-facing locators** — form and navigation controls use Sauce
  Demo's `data-test` hooks (`testIdAttribute` + `getByTestId`). On the product
  grid, items are found by their visible name and acted on by button role
  (`getByRole('button', { name: 'Add to cart' })`), so a test reads like a user
  action and does not depend on how the site builds its element IDs. Structural
  CSS classes are used only for read-only bits with no better hook (price and
  summary labels).
- **Login once, reuse the session** — `auth.setup.ts` logs in through the UI
  and saves the storage state; the cart and checkout suites reuse it via a
  project dependency, so they stay focused and fast. The login suite itself
  still runs against the real login screen.
- **Meaningful assertions** — assert *outcomes* (exact error text, badge
  counts, price maths, order confirmation), not just that a page loaded.
- **Web-first assertions** — `expect(locator).toHaveText(...)` etc. auto-wait
  and retry, so there are no hard-coded sleeps, which reduces timing-related
  flakiness.

---

## To Do — with more time

Given the time-box I focused on the critical flows above. Next, in rough
priority order, I would add:

- **Product sorting** — validate the sort dropdown (Name A–Z / Z–A, Price
  low–high / high–low) actually reorders the inventory, not just that the
  option is selectable.
- **Fuller cart / checkout coverage** — remove-from-cart on the cart page,
  "Continue Shopping", and cancelling out of checkout.
- **Fuller checkout form validation** — the suite covers a missing first name;
  I would extend it to last name and postcode, ideally data-driven.
- **Independent tax validation** — the checkout test verifies the totals are
  self-consistent (item total + tax = grand total); with more time I would also
  assert the tax equals the expected percentage of the subtotal.
- **Problem users** — Sauce Demo ships `problem_user` and
  `performance_glitch_user`; I would use them to catch broken images, wrong
  links, and slow-loading behaviour.
- **Cross-browser** — run the suite on Firefox and WebKit as well as Chromium
  (the config makes this a small change).
- **Data-driven login** — parameterise the login tests over a table of
  users/messages instead of one test each.
- **Visual and accessibility checks** — snapshot key pages and add basic a11y
  assertions (labels, roles, keyboard navigation).
- **Reporting / CI polish** — publish the HTML report and trends; a CI run on
  every push is already wired up in `.github/workflows/`.

---

## Notes

- Sauce Demo's test credentials are shown on its own login page, so they are
  kept in `tests/test-data.ts` for readability rather than hidden in secrets.
- The saved session (`.auth/`) and all Playwright output are git-ignored.
