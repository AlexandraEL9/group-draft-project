import { render, screen } from '@testing-library/react';
import Footer from './footer';

test('renders the footer component', () => {
  render(<Footer />);
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  expect(screen.getByText(/© 2025 NeuroNudge/i)).toBeInTheDocument();
});

