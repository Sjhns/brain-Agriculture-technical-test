import { FarmAreaValidator } from './farm-area.validator';
import { describe, it, expect } from 'vitest';

describe('FarmAreaValidator', () => {
  it('should pass when arable + vegetation <= total', () => {
    expect(FarmAreaValidator.isValidAreas(100, 50, 50)).toBe(true);
    expect(FarmAreaValidator.isValidAreas(100, 40, 40)).toBe(true);
  });

  it('should fail when arable + vegetation > total', () => {
    expect(FarmAreaValidator.isValidAreas(100, 60, 50)).toBe(false);
    expect(FarmAreaValidator.isValidAreas(50, 50, 50)).toBe(false);
  });
});
