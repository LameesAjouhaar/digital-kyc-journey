
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KycRequirements } from '@/features/kyc-session/components/KycRequirements';

describe('KycRequirements', () => {
  it('displays the identity verification requirements', () => {
    render(<KycRequirements />);

    expect(
      screen.getByRole('heading', { name: 'What you will need' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/valid Passport, National ID or Driver’s Licence/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/device with a working camera/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/well-lit environment/i),
    ).toBeInTheDocument();
  });

  it('displays the estimated completion time', () => {
    render(<KycRequirements />);

    expect(screen.getByText('About 5 minutes')).toBeInTheDocument();
  });
});
