export function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function textIncludesSearch(value: unknown, term: unknown): boolean {
  return normalizeSearchText(value).includes(normalizeSearchText(term));
}

export function isPresentFilterValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();
  return normalized !== '' && normalized !== '-';
}

export function getDateOnly(value: unknown): string {
  const normalized = String(value ?? '').trim();
  const match = normalized.match(/^(\d{2}\/\d{2}\/\d{4})/);
  return match ? match[1] : normalized;
}

interface FieldConfig {
  type?: string;
}

export function normalizeFilterValue(value: unknown, field: FieldConfig = {}): unknown {
  return field.type === 'date' ? getDateOnly(value) : value;
}

export function parseSortableValue(value: unknown): string {
  if (!isPresentFilterValue(value)) return '';
  const normalized = String(value);
  const match = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) return `${match[3]}${match[2]}${match[1]}`;
  return normalizeSearchText(normalized);
}
