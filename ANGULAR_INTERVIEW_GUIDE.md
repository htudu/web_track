# Angular Interview Guide for Beginners

A practical reference for learning Angular fundamentals and showing that you can build a usable, polished UI. Focus on understanding and explaining the ideas rather than memorizing definitions.

## 1. What Angular is

Angular is a TypeScript framework for building web applications. An Angular app is composed of components. A component connects:

- A TypeScript class for data and behavior
- An HTML template for the view
- Optional CSS for presentation

Modern Angular applications commonly use **standalone components**. You may also encounter older projects organized with **NgModules**, so recognize the term even if you learn standalone APIs first.

## 2. Components and templates

Use components to split a page into pieces with clear responsibilities. For example, a product page might have a `ProductListComponent`, a `ProductCardComponent`, and a `ProductFiltersComponent`.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  standalone: true,
  template: `
    <h1>{{ title }}</h1>
    <button type="button" (click)="sayHello()">Say hello</button>
  `,
})
export class GreetingComponent {
  title = 'Welcome';

  sayHello(): void {
    console.log('Hello!');
  }
}
```

The `@Component` decorator tells Angular that the class is a component. The selector lets another template use it as an HTML element, for example `<app-greeting />`.

### Template binding

| Syntax | Purpose | Example |
|---|---|---|
| `{{ value }}` | Display a value | `<h1>{{ title }}</h1>` |
| `[property]="value"` | Set an element or component property | `<button [disabled]="isSaving">Save</button>` |
| `(event)="handler()"` | Respond to an event | `<button (click)="save()">Save</button>` |
| `[(ngModel)]="value"` | Two-way form binding (requires `FormsModule`) | `<input [(ngModel)]="name">` |

Use property and event binding instead of manually querying the DOM for routine UI behavior.

### Conditional content and lists

Angular 17+ templates support built-in control flow:

```html
@if (products.length === 0) {
  <p>No products found.</p>
} @else {
  @for (product of products; track product.id) {
    <app-product-card [product]="product" />
  }
}
```

The `track` expression helps Angular identify list items when updating the view. You may also see the older `*ngIf` and `*ngFor` syntax in existing code.

For Angular 16, use `*ngIf` and `*ngFor` (and import `CommonModule` in a standalone component, or the relevant module in an NgModule-based app). The `@if` and `@for` syntax requires Angular 17 or later.

## 3. Sharing data between components

- **Parent to child:** pass data through an input.
- **Child to parent:** emit an event through an output.
- **Across unrelated components:** use a shared service when appropriate.

The decorator-based input/output APIs are common and useful to recognize:

```ts
@Input() product!: Product;
@Output() selected = new EventEmitter<Product>();
```

Angular also provides newer signal-based input and output APIs. Learn the patterns used by the project you are working in; the underlying goal is still to make data flow clear.

## 4. Services and dependency injection

Put reusable or non-view logic—such as API access—in a service instead of duplicating it across components. Angular's dependency injection system provides the service where it is needed.

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>('/api/products');
  }
}
```

`providedIn: 'root'` makes the service available application-wide in a typical application. Components can inject it with `inject(ProductService)` or through a constructor parameter.

## 5. Routing

The Angular router maps URLs to views, allowing an app to have multiple pages without a full page reload. Learn how to:

- Define routes and connect a route to a component
- Add `<router-outlet>` where the active page should render
- Navigate with `routerLink`
- Read route parameters, such as a product ID

Keep navigation links meaningful and make sure users can tell which page they are on.

## 6. Forms and validation

Angular offers **template-driven forms** and **reactive forms**. Reactive forms define the form model in TypeScript and are a useful first choice for interview practice because validation and behavior are explicit.

Be able to demonstrate:

- Required fields and basic validation
- Showing an error next to the relevant field
- Disabling submission when a form is invalid or saving
- Showing a success or failure message after submission
- Using labels and helpful error text for accessibility

Avoid showing validation errors before the user has had a reasonable chance to interact with the form.

## 7. HTTP and async UI states

Use Angular's `HttpClient` to communicate with a backend. Keep the request in a service, then make the component's UI reflect the result.

For a data-driven screen, plan for all four states:

1. **Loading:** tell the user that data is being fetched.
2. **Success:** display the data.
3. **Empty:** explain that there is no data to display.
4. **Error:** explain that loading failed and, when practical, offer a retry.

Don't leave the page blank while waiting for a request or silently treat a failed request as an empty result.

## 8. RxJS and signals

**RxJS** provides Observables, which Angular uses in many async APIs, including `HttpClient` and reactive forms. At a beginner level, understand that an Observable represents values that may arrive over time. Learn how to subscribe safely and recognize common operators such as `map`, `filter`, and `switchMap`.

**Signals** are Angular's reactive values for tracking state and updating dependent UI. Know how to read a signal and how computed state can depend on other signals.

You do not need to memorize every RxJS operator or choose one state approach for every situation. Explain the approach used in your project and why it fits.

## 9. CSS, responsive design, and accessibility

A decent UI is more than a working Angular template. Practice:

- CSS layout with Flexbox and Grid
- Consistent spacing, typography, and colors
- Responsive behavior on narrow and wide screens
- Clear hover, focus, disabled, and validation states
- Semantic HTML, such as `<button>`, `<nav>`, and headings in a logical order
- Form labels, keyboard navigation, and sufficient color contrast

Prefer native HTML elements where possible. A clickable `<div>` usually needs extra keyboard and accessibility behavior that a real `<button>` already provides.

## 10. A small project to practice

Build a product catalog or task tracker with:

- A responsive page layout
- A list rendered from data using reusable card components
- Search, filtering, or sorting
- A detail page or a form to add/edit an item
- Input validation and useful feedback
- Loading, empty, error, and success states if using an API

Start with local sample data. Add API calls and routing after the basic UI works. Keep the project small enough that you can explain every part of it.

### Before showing the project

- Try it at both phone and desktop widths.
- Test empty, invalid, loading, and error cases.
- Check that buttons and form controls work with a keyboard.
- Make sure each form control has a label.
- Remove dead buttons, placeholder links, and unexplained console errors.
- Be ready to describe one design decision and one improvement you would make next.

## 11. Interview questions to practice

Try answering these in your own words, with an example from your project:

1. What is an Angular component?
2. What is the difference between property binding and event binding?
3. How do you pass data from a parent component to a child?
4. When would you put logic in a service?
5. What does dependency injection do?
6. How would you show loading and error states for an API request?
7. What is the difference between template-driven and reactive forms?
8. What is an Observable? Where have you seen one in Angular?
9. How do routes and route parameters work?
10. How do you make a form or page more accessible?

If you don't know an answer, explain what you do know and how you would investigate it. Avoid claiming experience you don't have.

## 12. One-week study plan

| Day | Focus | Practice |
|---|---|---|
| 1 | TypeScript, components, templates | Build a page with a heading, button, and list |
| 2 | Binding, control flow, component data | Add search and reusable cards |
| 3 | Services and dependency injection | Move sample data access into a service |
| 4 | Routing and forms | Add a detail route and a validated form |
| 5 | HTTP, RxJS, and UI states | Load data and handle loading, empty, and error states |
| 6 | CSS, responsive design, accessibility | Improve the page on mobile and check keyboard use |
| 7 | Review and interview practice | Demo the project and answer the questions above aloud |

## How to describe your project

Use a concise, truthful structure:

> “I built a [type of UI] using Angular. I split it into [components], used [service or form approach] for [purpose], and handled [important UI states]. One challenge was [challenge]. Next, I would improve it by [specific improvement].”

Be prepared to open the relevant code and explain the choices you made.
