import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('submits the form, stores the response and navigates to the dashboard', async () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const username = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    username.value = 'alice';
    username.dispatchEvent(new Event('input'));
    password.value = 'password123';
    password.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    const request = http.expectOne('http://localhost:8000/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'alice', password: 'password123' });
    expect(component.isLoading).toBe(true);

    component.backendLogin();
    http.expectNone('http://localhost:8000/login');

    const user = { id: 1, username: 'alice', email: 'alice@example.com' };
    request.flush({ message: 'Login successful', token: 'test-token', user });
    expect(localStorage.getItem('auth_token')).toBe('test-token');
    expect(JSON.parse(localStorage.getItem('user_data')!)).toEqual(user);
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.pwd).toBe('');
    expect(component.isLoading).toBe(false);
  });

  it('does not submit an empty form', async () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    http.expectNone('http://localhost:8000/login');
  });

  it('displays a backend error and allows retrying', () => {
    component.backendLogin();
    http.expectOne('http://localhost:8000/login').flush(
      { error: 'Invalid username or password' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(component.errorMessage).toBe('Invalid username or password');
    expect(component.isLoading).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();

    component.backendLogin();
    expect(component.errorMessage).toBe('');
    http.expectOne('http://localhost:8000/login').flush(
      null, { status: 503, statusText: 'Unavailable' }
    );
    expect(component.errorMessage).toBe('Login failed. Please try again.');
  });

  it('does not navigate on a malformed successful response', () => {
    const navigate = vi.spyOn(router, 'navigate');
    component.backendLogin();
    http.expectOne('http://localhost:8000/login').flush({ message: 'Login successful' });

    expect(component.errorMessage).toBe('Login failed. Please try again.');
    expect(component.isLoading).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
