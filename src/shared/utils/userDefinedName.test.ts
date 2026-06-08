import { describe, expect, it } from 'vitest';
import {
  USER_DEFINED_NAME_MAX_LENGTH,
  getUserDefinedNameValidationCode,
  isValidUserDefinedName,
  normalizeUserDefinedName,
} from './userDefinedName';

describe('userDefinedName', () => {
  it('RN-VP-05/RN-CT-04: aceita letras, acentos, numeros e espacos', () => {
    expect(isValidUserDefinedName('Revisao critica 2026')).toBe(true);
    expect(isValidUserDefinedName('Análise órgão 123')).toBe(true);
  });

  it('RN-VP-05/RN-CT-04: rejeita nomes vazios apos trim', () => {
    expect(getUserDefinedNameValidationCode('   ')).toBe('required');
  });

  it('RN-VP-05/RN-CT-04: limita nomes a 40 caracteres', () => {
    expect(isValidUserDefinedName('A'.repeat(USER_DEFINED_NAME_MAX_LENGTH))).toBe(true);
    expect(getUserDefinedNameValidationCode('A'.repeat(USER_DEFINED_NAME_MAX_LENGTH + 1))).toBe(
      'maxLength'
    );
  });

  it('RN-VP-05/RN-CT-04: rejeita caracteres especiais', () => {
    expect(getUserDefinedNameValidationCode('Urgente!')).toBe('invalidCharacters');
    expect(getUserDefinedNameValidationCode('Fila/RH')).toBe('invalidCharacters');
    expect(getUserDefinedNameValidationCode('Tag_prioritaria')).toBe('invalidCharacters');
  });

  it('RN-VP-05/RN-CT-04: normaliza espacos antes de salvar', () => {
    expect(normalizeUserDefinedName('  Revisao   critica  ')).toBe('Revisao critica');
  });
});
