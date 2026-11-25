
import { describe, expect, it } from 'vitest';

describe('Vitest configuration', () => {
  it('runs with the jsdom environment', () => {
    const element = document.createElement('div');

    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
  });
});
