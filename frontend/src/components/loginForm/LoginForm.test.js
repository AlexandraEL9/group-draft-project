/*
// @ts-nocheck
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const mockResponse = { userId: 1, username: 'alice' };

let setItemSpy;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
  );

  // spy on Storage.prototype.setItem and keep the spy reference
  setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

  Object.defineProperty(window, 'location', {
    value: { href: '' },
    writable: true,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders username, password and submit button', () => {
  render(<LoginForm />);
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});

test('happy path: posts creds, saves to localStorage, redirects', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/username/i), 'alice');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(global.fetch).toHaveBeenCalledTimes(1);
  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe('http://localhost:5000/login');
  expect(options.method).toBe('POST');
  expect(JSON.parse(options.body)).toEqual({ username: 'alice', password: 'password123' });

  await waitFor(() => {
    // either of these styles is fine:

    // (A) independent assertions
    expect(setItemSpy).toHaveBeenCalledWith('userId', String(mockResponse.userId));
    expect(setItemSpy).toHaveBeenCalledWith('username', mockResponse.username);

    // OR (B) check exact order:
    // expect(setItemSpy).toHaveBeenNthCalledWith(1, 'userId', String(mockResponse.userId));
    // expect(setItemSpy).toHaveBeenNthCalledWith(2, 'username', mockResponse.username);
  });

  await waitFor(() => {
    expect(window.location.href).toBe('/routines');
  });
});
*/
