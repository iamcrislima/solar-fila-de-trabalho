export const USER_DEFINED_NAME_MAX_LENGTH = 40;

const USER_DEFINED_NAME_PATTERN = /^[\p{L}\p{N} ]+$/u;

export type UserDefinedNameValidationCode = 'required' | 'maxLength' | 'invalidCharacters' | null;

export function normalizeUserDefinedName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function getUserDefinedNameValidationCode(value: string): UserDefinedNameValidationCode {
  const normalized = normalizeUserDefinedName(value);

  if (!normalized) return 'required';
  if (normalized.length > USER_DEFINED_NAME_MAX_LENGTH) return 'maxLength';
  if (!USER_DEFINED_NAME_PATTERN.test(normalized)) return 'invalidCharacters';

  return null;
}

export function isValidUserDefinedName(value: string): boolean {
  return getUserDefinedNameValidationCode(value) === null;
}
