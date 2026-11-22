# Angular Interview Learning Plan

## What this job description is really screening for

This is not only a list of Angular topics. It asks for evidence in project or work-experience bullets that you:

- Have at least **3 years of hands-on Angular 16+ experience**
- Authored and developed Angular components
- Used RxJS or a comparable reactive/state library together with a UI component library
- Wrote HTML and CSS for layout, styling, and responsive behavior
- Have Angular in your **current role**, not only in older roles

These are hard gates. A study plan or portfolio can build skills and show current practice, but it cannot truthfully replace three years of professional experience. Do not claim years, projects, or responsibilities you have not actually had. If you are new to Angular, use this plan to become capable, gather real evidence, and target roles whose experience requirements match your background while you build professional Angular experience.

## Target outcome

Build and confidently explain one polished Angular 16+ application that demonstrates component authorship, reactive data handling, a UI component library, and deliberate HTML/CSS work. Be able to discuss your actual contribution, trade-offs, testing, and improvements without overstating your experience.

The schedule below assumes roughly **8–10 hours per week**. Adjust the pace as needed; the project outcomes matter more than the calendar.

## Learning plan

### Weeks 1–2: Angular and TypeScript foundations

**Learn**

- TypeScript types, interfaces, classes, and modules
- Angular CLI and project structure
- Standalone components, templates, and component styles
- Interpolation, property binding, event binding, and two-way binding
- Built-in template control flow such as `@if` and `@for`

**Build**

- Create an Angular 16+ project and record its Angular version.
- Make a responsive page with a header, navigation, and a list of sample items.
- Author at least three components yourself, such as a page, filter bar, and item card.

**Checkpoint**

- Explain what belongs in a component class, template, and stylesheet.
- Explain the difference between property binding and event binding.
- Show how data reaches a child component and how a child reports an action.

### Weeks 3–4: Components, routing, and UI structure

**Learn**

- Component inputs and outputs
- Reusable components and clear component responsibilities
- Angular Router, route configuration, links, and route parameters
- Services and dependency injection

**Build**

- Add list and detail routes.
- Split the UI into reusable components you authored.
- Move shared data access or logic into an injectable service.
- Add visible active-navigation and not-found states.

**Checkpoint**

- Trace a user action from the template through component logic to the resulting UI update.
- Explain why a piece of logic belongs in a service rather than a view component.

### Weeks 5–6: Reactive forms and user feedback

**Learn**

- Reactive forms and typed form controls
- Required and format validation
- Showing field-level errors at appropriate times
- Disabled, submitting, success, and failure states

**Build**

- Add a create/edit form to the application.
- Use semantic HTML, labels, and useful validation messages.
- Prevent duplicate submission while saving and provide clear feedback.

**Checkpoint**

- Demonstrate a valid submission, an invalid submission, and keyboard-only use.
- Explain how validation is represented and displayed.

### Weeks 7–8: RxJS, HTTP, and async states

**Learn**

- Observables and subscriptions
- Common operators such as `map`, `switchMap`, and `catchError`
- Angular `HttpClient`
- Loading, success, empty, and error states
- When signals are useful and how they differ from Observables

**Build**

- Load data through a service using `HttpClient`.
- Add search or filtering; avoid stale search results when requests overlap.
- Show loading, empty, and error states, with a retry where it makes sense.
- Keep state handling explicit rather than presenting a failed request as an empty result.

**Checkpoint**

- Explain where an Observable enters the application and how the template responds to its result.
- Explain the reactive/state approach used in your project and why you chose it.

### Weeks 9–10: UI component library and custom styling

**Learn**

- Choose one library compatible with the project's Angular version, such as Angular Material or PrimeNG.
- Use library components appropriately for common controls and feedback.
- Use HTML and CSS directly for page layout, responsive behavior, and visual details.
- Accessibility basics: semantic elements, keyboard focus, labels, and contrast.

**Build**

- Use the library for a few suitable controls, such as a dialog, form field, or table.
- Do not make the entire UI a collection of unmodified library defaults.
- Write CSS for layout, spacing, responsive breakpoints, and focus/disabled states.
- Check the UI at a narrow mobile width and a desktop width.

**Checkpoint**

- Point to specific HTML and CSS you wrote and explain what they achieve.
- Explain which parts use the UI library and which parts are custom.
- Verify that interactive controls remain usable by keyboard.

### Week 11: Quality and maintainability

**Learn and practice**

- Run the project's build, lint, and test commands.
- Add focused tests for important component behavior and service behavior.
- Handle empty, error, and invalid input cases.
- Keep components focused and avoid duplicated UI logic.

**Checkpoint**

- Demonstrate the application from a clean start.
- Explain one bug you found, how you fixed it, and how you verified the fix.

### Week 12: Interview and project presentation

**Prepare**

- Give a 3–5 minute walkthrough of the application.
- Practice the questions below aloud.
- Prepare honest explanations of what you did yourself, what you learned, and what you have not yet used professionally.
- Review the JD and map each requirement to real evidence. Mark gaps clearly; do not turn portfolio work into employment experience.

**Demo outline**

1. State the problem the app solves.
2. Show the key user flow and responsive layout.
3. Explain your component structure and one data flow.
4. Explain the RxJS/state and UI library choices.
5. Show the HTML/CSS work and accessibility considerations.
6. Describe testing, a challenge, and a next improvement.

## Portfolio project: responsive management dashboard

Build a small dashboard for managing products, tasks, or bookings. Keep the scope focused enough to finish and explain.

**Feature checklist**

- [ ] Angular 16+ project; record the exact version and setup
- [ ] Components authored by you, with clear responsibilities
- [ ] List and detail pages with working navigation
- [ ] Search, filter, or sort
- [ ] Reactive create/edit form with validation
- [ ] Service-based data access
- [ ] RxJS for async data flow, plus a clear explanation of any signals used
- [ ] Angular Material, PrimeNG, or another compatible UI component library
- [ ] Custom HTML/CSS for layout and responsive behavior
- [ ] Loading, empty, error, success, and disabled states where relevant
- [ ] Semantic HTML, labels, keyboard navigation, and visible focus
- [ ] A few meaningful tests and a successful production build
- [ ] README with setup steps, features, screenshots, and your own contribution

Keep a short work log as you build: date, feature implemented, decisions, issue encountered, and how you verified it. This helps you explain your work accurately; it is not a substitute for professional experience.

## Interview questions to rehearse

1. How do you decide what should be its own Angular component?
2. How do parent and child components communicate?
3. What is dependency injection, and where have you used it?
4. What is an Observable? How have you used RxJS in your UI?
5. When might you use a signal instead of an Observable?
6. How do you handle loading, empty, and error states for an HTTP request?
7. Why did you choose Angular Material, PrimeNG, or another UI library?
8. What HTML and CSS did you write yourself?
9. How did you make the UI responsive and keyboard accessible?
10. How did you test an important user flow?
11. What was a technical decision you changed after trying an initial approach?
12. What Angular work have you done in your current role?

Answer from concrete examples. If you have not used a feature in professional work, say so and distinguish what you have practiced in your project from what you have done on the job.

## Addressing the 3-year and current-role gates

If you are not already able to demonstrate 3 years of Angular 16+ work, a 12-week plan will not meet that requirement. Do not invent dates, production usage, team ownership, or a current-role Angular project.

Instead:

1. **Check your real experience first.** List employers/projects, dates, Angular versions, components you authored, libraries used, and HTML/CSS work. Keep professional work separate from personal learning.
2. **If you are employed, seek a genuine Angular task or project in your current role.** Agree on scope with your manager, then document your actual contribution and outcomes. Do not relabel unrelated work as Angular.
3. **If you are not yet doing Angular at work, target an entry-level role, internship, internal transfer, or project opportunity that can give you real hands-on experience.**
4. **Apply selectively.** This JD explicitly treats three years and current-role experience as hard gates, so a strong portfolio may not overcome those filters. Prioritize postings whose stated experience requirements fit your actual background.
5. **Keep the portfolio as portfolio evidence.** It can demonstrate your current skills and initiative, but do not present it as three years of employment.
6. **Build experience over time.** Keep taking substantive Angular work, authoring components, using reactive data patterns and a UI library, and writing HTML/CSS. Track dates and outcomes accurately.

## Readiness checklist

You are better prepared to interview for Angular work when you can do these without following a tutorial line by line:

- [ ] Create and explain a standalone component with a template and styles
- [ ] Build a reusable component and pass data/actions between components
- [ ] Implement a route, a validated form, and service-based data access
- [ ] Use RxJS in a real UI flow and explain its role
- [ ] Integrate a UI component library without relying on it for all styling
- [ ] Show your own responsive HTML/CSS work
- [ ] Handle async, empty, error, and validation states
- [ ] Run and explain relevant tests and the build
- [ ] Present your project truthfully and discuss its limitations
- [ ] Separately verify whether you meet the JD's three-year and current-role requirements
