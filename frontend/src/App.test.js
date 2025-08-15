import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('App renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(container).toBeInTheDocument();
});

