import { render, screen } from '@testing-library/react';

function Greeting() {
  return <h1>Pizza Store</h1>;
}

describe('Greeting', () => {
  it('renders the brand heading', () => {
    render(<Greeting />);

    expect(screen.getByText('Pizza Store')).toBeInTheDocument();
  });
});
