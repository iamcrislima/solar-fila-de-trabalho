// Utilitários puros para manipulação de datas no formato BR (dd/mm/aaaa).
// Sem dependências de UI — pode ser consumido por qualquer camada.

export interface ParsedDate {
  day: number;
  month: number; // 0-indexed (igual ao Date.getMonth())
  year: number;
}

export interface DateRange {
  from: string | null;
  to: string | null;
}

export function parseDateBR(str: string): ParsedDate | null {
  if (!str) return null;
  const parts = str.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  return { day: d, month: m - 1, year: y };
}

export function formatDateBR(year: number, month: number, day: number): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(day)}/${p(month + 1)}/${year}`;
}

export function normalizeDateOnBlur(raw: string, now: Date = new Date()): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  const p = (n: number) => String(n).padStart(2, '0');
  const currentMonth = p(now.getMonth() + 1);
  const currentYear = String(now.getFullYear());

  const len = digits.length;

  if (len <= 2) return `${p(Number(digits))}/${currentMonth}/${currentYear}`;
  if (len === 3) {
    const dd = p(Number(digits.slice(0, 2)));
    const d3 = digits[2];
    const mm = d3 === '0' ? currentMonth : `0${d3}`;
    return `${dd}/${mm}/${currentYear}`;
  }
  if (len === 4) {
    return `${p(Number(digits.slice(0, 2)))}/${digits.slice(2, 4)}/${currentYear}`;
  }
  if (len === 5) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits[4]}`;
  if (len === 6) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/20${digits.slice(4)}`;
  if (len === 7) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function expandYearBR(str: string): string {
  if (!str || str.length !== 8) return str;
  const parts = str.split('/');
  if (parts.length !== 3 || parts[2].length !== 2) return str;
  return `${parts[0]}/${parts[1]}/20${parts[2]}`;
}

export function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isValidDateBR(str: string): boolean {
  if (!str || str.length < 10) return false;
  const parts = str.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return false;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || m < 1 || m > 12 || d < 1) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function getDateErrorBR(str: string): string | null {
  if (!str || str.length < 7) return null;
  if (str.length === 7 || str.length === 9) return 'Ano inválido. Informe 2 ou 4 dígitos.';
  if (str.length === 8) return null;
  if (str.length !== 10) return null;

  const parts = str.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return 'Data inválida.';

  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);

  if (!m || m < 1 || m > 12) return 'Mês informado não existe.';
  if (!d || d < 1) return 'Dia inválido.';

  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    const maxDay = new Date(y, m, 0).getDate();
    if (m === 2) {
      if (d === 29) return `${y} não é ano bissexto. Fevereiro possui 28 dias.`;
      return `Fevereiro não possui ${d} dias.`;
    }
    if (d > maxDay) return `${MONTH_NAMES[m - 1]} possui apenas ${maxDay} dias.`;
    return 'Data inválida.';
  }

  return null;
}

export function emptyDateRange(): DateRange {
  return { from: null, to: null };
}

export function isDateRangeActive(range: DateRange | null | undefined): boolean {
  return !!(range?.from || range?.to);
}

export function dateInRange(value: string, range: DateRange | null | undefined): boolean {
  if (!range || (!range.from && !range.to)) return true;
  const parsed = parseDateBR(value);
  if (!parsed) return !range.from && !range.to;
  const d = new Date(parsed.year, parsed.month, parsed.day);
  if (range.from) {
    const p = parseDateBR(range.from);
    if (p && d < new Date(p.year, p.month, p.day)) return false;
  }
  if (range.to) {
    const p = parseDateBR(range.to);
    if (p && d > new Date(p.year, p.month, p.day)) return false;
  }
  return true;
}
