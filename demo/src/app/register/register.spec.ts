import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { Login } from '../login/login';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  async function fillForm(username: string, email: string, password: string) {
    for (const [id, value] of Object.entries({ username, email, password })) {
      const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    await fixture.whenStable();
  }

  it('registers the user once and returns to login with a success message', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fillForm('alice', 'alice@example.com', 'password123');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    const request = http.expectOne('http://localhost:8000/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      username: 'alice', email: 'alice@example.com', password: 'password123',
    });
    expect(component.isLoading).toBe(true);
    component.onRegister();
    http.expectNone('http://localhost:8000/register');

    request.flush(
      { message: 'User registered successfully', user: { id: 1, username: 'alice', email: 'alice@example.com' } },
      { status: 201, statusText: 'Created' }
    );
    expect(component.isLoading).toBe(false);
    expect(component.password).toBe('');
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { registered: 'true' } });
  });

  it('does not submit invalid registration details', async () => {
    await fillForm('ab', 'invalid', 'short');
    const email = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    email.dispatchEvent(new Event('blur'));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('button') as HTMLButtonElement).disabled).toBe(true);
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('#email-hint').textContent)
      .toContain('Enter a valid email address');
    http.expectNone('http://localhost:8000/register');
  });

  it('shows backend errors and allows a retry', () => {
    component.onRegister();
    http.expectOne('http://localhost:8000/register').flush(
      { error: 'Username or email already exists' },
      { status: 409, statusText: 'Conflict' }
    );
    expect(component.errorMessage).toBe('Username or email already exists');
    expect(component.isLoading).toBe(false);

    component.onRegister();
    expect(component.errorMessage).toBe('');
    http.expectOne('http://localhost:8000/register').flush(
      null, { status: 503, statusText: 'Unavailable' }
    );
    expect(component.errorMessage).toBe('Registration failed. Please try again.');
  });
});

describe('Registration routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    });
  });

  it('opens registration and displays the success message on login', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/register', Register);
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/login');

    await harness.navigateByUrl('/login?registered=true', Login);
    expect(harness.routeNativeElement?.querySelector('[role="status"]')?.textContent)
      .toContain('Registration successful');
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/register');
  });
});
