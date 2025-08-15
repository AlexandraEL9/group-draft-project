// Copy this file next to a component and rename appropriately.

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders without crashing', () => {
    // render(<ComponentName />);
    // expect(screen.getByText(/some text/i)).toBeInTheDocument();
    expect(true).toBe(true); // delete me when you add a real assertion
  });

  test('responds to user interaction', async () => {
    const user = userEvent.setup();
    // render(<ComponentName />);
    // await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(true).toBe(true);
  });
});
