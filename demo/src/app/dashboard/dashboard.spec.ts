import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { Dashboard } from './dashboard';
import { Login } from '../login/login';

describe('Dashboard routing', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter(routes)],
    });
  });

  afterEach(() => localStorage.clear());

  it('redirects visitors without a token to login', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard', Login);
    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('opens the dashboard with a token and logs out', async () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('user_data', '{"username":"alice"}');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard', Dashboard);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');

    const button = harness.routeNativeElement?.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Log out');
    button.click();
    await navigate.mock.results[0].value;
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
    expect(router.url).toBe('/login');
  });
});
