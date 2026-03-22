import { DocumentValidator } from './document-validator';
import { describe, it, expect } from 'vitest';

describe('DocumentValidator', () => {
  it('should validate right CPF', () => {
    expect(DocumentValidator.isCpf('61554477050')).toBe(true);
  });

  it('should invalidate wrong CPF', () => {
    expect(DocumentValidator.isCpf('11111111111')).toBe(false); 
    expect(DocumentValidator.isCpf('12345678901')).toBe(false); 
  });

  it('should validate right CNPJ', () => {
    expect(DocumentValidator.isCnpj('35136703000126')).toBe(true);
  });

  it('should invalidate wrong CNPJ', () => {
    expect(DocumentValidator.isCnpj('11111111111111')).toBe(false);
    expect(DocumentValidator.isCnpj('12345678901234')).toBe(false);
  });
});
